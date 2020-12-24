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
			 <view  class="my-btn short-btn" :class="btnClass">{{btnText}}</view>
		</view>
		<view class="sign-logs">
			<view class="block-box">
				<text class="title">打卡记录</text>
			</view>
			<signLog :taskId="taskId" :member="userInfo.nickName"></signLog>
		</view>
	</view>
</template>

<script>
	import signLog from "../../components/sign-log.vue";
	import signApi from "../../utils/service/sign.js";
	import uniCalendar from '../../components/uni-calendar/uni-calendar.vue'
	import { dateCompare } from "../../utils/util.js"
	import dayjs from 'dayjs';
	export default {
		components:{ signLog, uniCalendar },
		data() {
			return {
				today: "",
				taskId: "",
				btnText: "点击打卡",
				btnClass: "primary-btn",
				beginTime: "",
				endTime: "",
				selected: [],
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
				})
			},
			fetchSelected(){
				let sendData = {
					taskId: this.taskId,
					member: this.userInfo.nickName
				}
				signApi.listSign(sendData).then(res => {
					this.selected = res.data.map(item=>{
						return {date: item.signTime.split(" ")[0]}
					})
				})
			},
			changeCalendar(e){
				let curDate = dayjs(e.fulldate)
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
		},
		onLoad(options){
			console.log(options)
			this.taskId = options.taskId;
			this.today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"));
			this.beginTime = options.beginTime;
			this.endTime = options.endTime;
			let isSigned = options.isSigned;
			if(isSigned === 'true'){
				this.btnText = "已打卡"
				this.btnClass = ["success-btn", "disabled-btn"]
			}
			this.fetchSelected();
			this.fetchSignStatistic();
		}
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
