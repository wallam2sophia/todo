<template>
	<view class="my-logs">
		<view class="my-info flex-column">
			<view class="avatar">
				<image :src="userInfo.avatarUrl" mode="aspectFit"></image>
			</view>
			<view class="nick-name">
				{{userInfo.nickName}}
			</view>
			<view class="info-bars flex-row">
				<view class="bar-item  flex-column">
					<view class="number">
						{{signInfo.rankNumber || 0}}
					</view>
					<view class="text">
						当前排名
					</view>
				</view>
				<view class="bar-item  flex-column">
					<view class="number">
						{{signInfo.signCounts || 0}}
					</view>
					<view class="text">
						累计签到
					</view>
				</view>
				<view class="bar-item  flex-column">
					<view class="number">
						{{signInfo.continuousCounts || 0}}
					</view>
					<view class="text">
						连续签到
					</view>
				</view>
				<view class="bar-item  flex-column">
					<view class="number">
						{{signInfo.maxContinuous || 0}}
					</view>
					<view class="text">
						最大连续
					</view>
				</view>
			</view>
		</view>
		<view class="sign-calender">
			 <uni-calendar 
			    ref="calendar"
			    :insert="true"
				:start-date="beginTime"
				:end-date="endTime"
				:selected="selected"
				@change="changeCalendar"
			     ></uni-calendar>
			 <view  class="my-btn short-btn  info-btn disabled-btn" v-if="taskStatus==='todo'">打卡任务未开始</view>
			 <view  class="my-btn short-btn  warning-btn disabled-btn" v-else-if="taskStatus==='done'">打卡任务已结束</view>
			 <view class="xxx" v-else>
			 	<view  class="my-btn short-btn " :class="btnClass" @click="signIn">{{btnText}}</view>
				<view class="notice-bar">
					<view class="location" v-if="taskInfo.locationLimit">
						<!-- <view class="title">
							指定打卡地点:
						</view> -->
						<view class="loc" v-for="(item, index) in taskInfo.locations" :key="index">
							<text class='loc-href' @click="goAddress(item)">{{item.name}}</text>-{{item.offset}}米以内
						</view>
					</view>
					<view class="wifi-l" v-if="taskInfo.wifiLimit">
						<!-- <view class="title">
							指定打卡wifi:
						</view> -->
						<view class="wifi">
							{{taskInfo.wifis.map(item=>item.SSID).join("/")}}
						</view>
						
					</view>
				</view>
			 </view>
			 
			 
		</view>
		<view class="sign-logs">
			<view class="block-box">
				<text class="title">打卡记录</text>
			</view>
			<signLog :list="signLogs"  :taskStatus="taskStatus" :taskId="taskId"></signLog>
		</view>
	</view>
</template>

<script>
	import signLog from "../../components/sign-log.vue";
	import signApi from "../../utils/service/sign.js";
	import taskApi from "../../utils/service/task.js"
	import uniCalendar from '../../components/uni-calendar/uni-calendar.vue'
	import { getDistance } from "../../utils/util.js"
	import dayjs from 'dayjs';
	export default {
		components:{ signLog, uniCalendar },
		data() {
			return {
				page: 1,
				size: 5,
				total: 0,
				today: "",
				selectDay: "",
				taskId: "",
				taskInfo:{},
				taskStatus: "",
				btnText: "点击打卡",
				btnClass: "primary-btn",
				beginTime: "",
				endTime: "",
				signLogs: [],
				selected: [],
				dataFinishShow: false,
				signInfo: {
					rankNumber: 0,
					signCounts: 0,
					continuousCounts: 0,
					maxContinuous: 0
				}
			}
		},
		methods: {
			fetchSignStatistic(){
				let sendData = {
					taskId: this.taskId,
					member: this.userInfo.nickName
				}
				signApi.statisticSign(sendData).then(res => {
					console.log(res.data)
					this.signInfo = res.data;
					this.selected = res.data.signs.map(item=>{
						return {date: item.signTime.split(" ")[0]}
					})
					if(this.selected.filter(item=>item.date === this.selectDay).length > 0){
						this.btnText = "已打卡"
						this.btnClass = ["success-btn", "disabled-btn"]
					}
				})
			},
			fetchSignLogs(){
				let sendData = {
					taskId: this.taskId,
					member: this.userInfo.nickName,
					page: this.page,
					size: this.size
				}
				signApi.listSign(sendData).then(res => {
					let { count, list } = res.data;
					this.total = count;
					this.signLogs = [...this.signLogs, ...list];
				})
			},
			refreshSignLogs(){
				this.page = 1;
				this.signLogs = []
				this.dataFinishShow = false
				this.fetchSignLogs();
			},
			async signIn(){
				try {
					if(this.btnText === "打卡未开始" || this.btnText === "已打卡"){
						return false;
					}
					let signTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
					if(this.btnText === "点击补卡"){
						signTime = this.selectDay + " 23:59:59"
					}
					// 限制打卡地点
					let locValid = true
					if(this.taskInfo.locationLimit){
						let [_, curLoc] = await uni.getLocation({type: 'wgs84', altitude: true })
						// 获取当前位置
						for(let location of this.taskInfo.locations){
							let distance = getDistance(location.latitude, location.longitude, curLoc.latitude, curLoc.longitude)
							if(distance > parseInt(location.offset)){
								locValid = false;
								break;
							}
						}
					}
					// 限制打卡wifi
					let wifiValid = true
					if(this.taskInfo.wifiLimit){
						let { wifi: curWifi }  = await wx.getConnectedWifi()
						// 获取当前位置
						for(let wifi of this.taskInfo.wifis){
							if(wifi.BSSID !== curWifi.BSSID){
								wifiValid = false;
								break;
							}
						}
					}
					if(locValid && wifiValid){
						uni.navigateTo({
							url: `../add-sign/add-sign?taskId=${this.taskId}&signDate=${signTime}`
						})
					}else if(!locValid){
						// 失败通知
						this.notify({ 
							context: this,
							text: "你当前不在可打卡的范围!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}else if(!wifiValid){
						// 失败通知
						this.notify({ 
							context: this,
							text: "请连接到指定wifi列表打卡!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}else{
						// 失败通知
						this.notify({ 
							context: this,
							text: "暂无法打卡,请联系管理员!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}
				}catch(error){
					console.log(error)
				}
			},
			changeCalendar(e){
				let curDate = dayjs(e.fulldate)
				this.selectDay = curDate.format("YYYY-MM-DD");
				if(Object.keys(e.extraInfo).length > 0){
					// 已打卡
					this.btnText = "已打卡"
					this.btnClass = ["success-btn", "disabled-btn"]
				}else {
					if(curDate.isBefore(this.today)){
						// 点击补卡
						this.btnText = "点击补卡"
						this.btnClass = "warning-btn"
					}else if(curDate.isSame(this.today)){
						// 点击打卡
						this.btnText = "点击打卡"
						this.btnClass = "primary-btn"
					}else {
						// 打卡未开始
						this.btnText = "打卡未开始"
						this.btnClass = ["info-btn", "disabled-btn"]
					}
				}
			},
			fetchTaskInfo(){
				taskApi.detailTask(this.userInfo.nickName, this.taskId).then(res => {
					this.taskInfo = res.data;
					this.taskStatus = res.data.taskStatus;
					this.beginTime = res.data.beginTime;
					this.endTime = res.data.endTime;
					let isSigned = res.data.isSigned;
					if(isSigned === 'true'){
						this.btnText = "已打卡"
						this.btnClass = ["success-btn", "disabled-btn"]
					}
				})
			},
		},
		onLoad(options){
			this.taskId = options.taskId;
			this.today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"));
		},
		onShow(){
			this.refreshSignLogs();
			this.fetchSignStatistic();
			this.fetchTaskInfo();
		},
		onReachBottom(){
			if(this.signLogs.length > 0 && this.signLogs.length === this.total){
				this.dataFinishShow = true;
			}
			if(!this.dataFinishShow){
				this.page ++;
				this.fetchSignLogs();
			}
		},
	}
</script>

<style lang="scss">
.my-logs {
	font-size: 26rpx;
	background-color: #eee;
	.my-info {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		align-items: center;
		background-color: #fff;
		.avatar {
			width: 50px;
			height: 50px;
			margin-bottom: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.nick-name {
			margin-bottom: 20rpx;
		}
		.info-bars {
			margin-bottom: 20rpx;
			justify-content: space-around;
			width: 90%;
			.bar-item {
				.number {
					font-size: 40rpx;
				}
				
			}
		}
	}
	
	.sign-calender {
		margin-top: 40rpx;
		background-color: #fff;
		padding: 10px;
	}
	.notice-bar {
		margin-top: 10px;
		font-size: 12px;
		color: #999;
		text-align: center;
		.location {
			margin-bottom: 5px;
			line-height: 20px;
			
			.loc-href {
				color: $main-bg-color;
			}
		}
		.wifi{
			color: $main-bg-color;
		}
	}
	.short-btn {
		width: 50%;
		margin: 20rpx auto 0;
	}
	.sign-logs {
		margin-top: 40rpx;
		background-color: #fff;
		
		.block-box {
			border-bottom: 1px solid #eee;
			line-height: 2;
			padding: 10px;
		}
	}
	.van-empty {
		background-color: #fff !important;
	}
	.van-empty__image {
		width: 100px;
		height: 100px;
	}
	.van-empty__description {
		padding: 0;
		font-size: 12px;
	}
}
</style>
