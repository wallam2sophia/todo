<template>
	<view class="add-task">
		<image :src="bgUrl"/>
		<view class="my-btn warning-btn change-bg-btn" @click="changeBgImg">更换背景图</view>
		<van-field :value="formData.title" placeholder="请填写标题" @input="(e)=>formData.title=e.detail"/>
		<van-field :value="formData.desc" placeholder="请填写备注" @input="(e)=>formData.desc=e.detail"/>
		<van-cell title="类型" :value="formData.type" is-link @click="typeShow=true"/>
		<van-cell title="开始日期" :value="formData.beginTime" is-link @click="beginShow=true"/>
		<van-cell title="结束日期" :value="formData.endTime" is-link @click="endShow=true"/>
		<van-cell title="签到周期" :value="formData.signType" is-link @click="periodShow=true"/>
		<van-cell title="提醒时间" :value="formData.remindTime" is-link @click="remindShow=true"/>
		<view class="required-row">
			必填项
		</view>
		<view class="required-options flex-row">
			<view class="required-item flex-row" v-for="(item, index) in signRequireds" :key="index" :class="{'selected-item': formData.requireds.includes(item.value)}" @click="selectRequireds(item.value)">
				<view class="selceted-icon" v-show="formData.requireds.includes(item.value)">
					<van-icon name="passed" custom-class="icon"/>
				</view>
				<view class="selceted-icon" v-show="!formData.requireds.includes(item.value)">
					<van-icon name="circle" custom-class="icon"/>
				</view>
				<view class="select-text">
					{{item.label}}
				</view>
			</view>
		</view>
		<van-cell title="指定签到地点" :border="false">
		  <van-switch :checked="formData.locationLimit" @change="locationSwitch" size="20px"/>
		</van-cell>
		<!-- <view class="location-row">
			必填项
		</view> -->
		<view class="location-row" v-if="formData.locationLimit">
			<view v-for="(item, index) in formData.locations" :key="index" class="location-item">
				<view class="select-location flex-row" >
					<view class="flex-row first" @click="chooseLocation(index)">
						<van-icon name="location-o" custom-class="location"/>
						<view class="location-name">
							{{item.name}}
						</view>
					</view>
					<van-icon name="close" custom-class="close" @click.stop="delLoc(index)"/>
				</view>
				<view class="set-offset flex-row">
					<view class="placeholder">
						设置签到范围(至少需要50米)
					</view>
					<input
						:value="item.offset" 
						placeholder="0" 
						@change="(e)=>offsetChange(index, e.detail.value)" 
						type="text" 
						placeholder-class="comment-input-placeholder"
						class="input"/>
					<view class="unin">
						米
					</view>
				</view>
			</view>
			<view class="add-btn flex-row" @click="addLoc">
				<van-icon name="add-o" custom-class="add"/>
				<view class="text">
					点击继续添加
				</view>
			</view>
		</view>
		<van-cell title="指定签到wifi" :border="false">
		  <van-switch :checked="formData.wifiLimit" @change="wifiSwitch" size="20px"/>
		</van-cell>
		<view class="location-row" v-if="formData.wifiLimit">
			<view v-for="(item, index) in formData.wifis" :key="index" class="location-item">
				<view class="select-location flex-row">
					<view class="flex-row first"  @click="getWifi(index)">
						<van-icon name="bar-chart-o" custom-class="location"/>
						<view class="location-name">
							{{item.SSID}}
						</view>
					</view>
					<van-icon name="close" custom-class="close" @click.stop="delWifi(index)"/>
				</view>
			</view>
			<view class="add-btn flex-row" @click="addWifi">
				<van-icon name="add-o" custom-class="add"/>
				<view class="text">
					点击继续添加
				</view>
			</view>
		</view>
		<van-action-sheet :show="typeShow" :actions="types" round :close-on-click-overlay="true" @select="setType"/>
		<van-action-sheet :show="periodShow" :actions="periods" round :close-on-click-overlay="true" @select="setPeriod"/>
		<van-popup :show="beginShow" position="bottom" round >
			<van-datetime-picker type="date" :value="currentBegin" :min-date="minBegin" @input="onInput"  @cancel="beginShow=false" @confirm="setBeginCurrent"/>
		</van-popup>
		<van-popup :show="endShow" position="bottom" round @cloce="endShow=false">
			<van-datetime-picker type="date" :value="currentEnd" :min-date="minEnd" @input="onInput"  @cancel="endShow=false" @confirm="setEndCurrent"/>
		</van-popup>
		<van-popup :show="remindShow" position="bottom" round @cloce="remindShow=false">
			<van-datetime-picker type="time" :value="currentRemind" @input="onInput"  @cancel="remindShow=false" @confirm="setRemindTime"/>
		</van-popup>
		<view  class="my-btn primary-btn submit-btn" @click="submitForm">创建打卡</view>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="task-notify"/>
	</view>
</template>

<script>
	import uniCombox from "../../components/uni-combox/uni-combox"
	import taskApi from "../../utils/service/task.js"
	import { chooseFileUpload, hasWarning } from "../../utils/util.js"
	import dayjs from 'dayjs';
	import { periods, types, signRequireds} from "../../utils/const.js"
	import isSameOrAfter from'dayjs/plugin/isSameOrAfter';
	dayjs.extend(isSameOrAfter)
	export default {
		components: {
			"uni-combox": uniCombox
		},
		data() {
			return {
				periods: periods,
				types: types,
				signRequireds,
				beginShow: false,
				endShow: false,
				periodShow: false,
				typeShow: false,
				remindShow: false,
				currentRemind: '12:00',
				currentBegin: new Date().getTime(),
				currentEnd: new Date().getTime(),
				minBegin: new Date().getTime(),
				minEnd: new Date().getTime(),
				loading: false,
				formData: {
					bgImg: "",
					title: "",
					desc: "",
					type: "",
					beginTime: "",
					endTime: "",
					remindTime: "",
					signType: "",
					requireds: [],
					locationLimit: false,
					locations: [
						{
							name: "请指定签到地点",
							offset: 50
						},
					],
					wifiLimit: false,
					wifis: [
						{
							SSID: "点击获取wifi",
						}
					]
					
				},
				
			}
		},
		onLoad(options){
			if(options.taskInfo){
				this.formData = JSON.parse(options.taskInfo);
				this.currentBegin = new Date(this.formData.beginTime).getTime();
				this.currentEnd = new Date(this.formData.endTime).getTime();
				this.currentRemind = this.formData.remindTime;
			}else {
				taskApi.getTaskBg().then(res=>{
					console.log(res)
					this.formData.bgImg = res.data;
				})
			}
			
			// this.currentDate = dayjs(new Date()).format("YYYY-MM-DD")
		},
		computed:{
			bgUrl(){
				return this.formData.bgImg.startsWith('https://') ? this.formData.bgImg : this.SERVER_URL + this.formData.bgImg
			}
		},
		methods: {
			submitForm() {
				let that = this
				if(this.formData.remindTime){
					hasWarning().then(res=>{
						that.handleAddTask()
					}).catch(error=>{
						console.log(error)
						// 失败通知
						that.notify({ 
							context: that,
							text: error.data,
							type: "danger",
							selector: "#task-notify"
						});
					})
				}else {
					that.handleAddTask()
				}
				
			},
			selectRequireds(value){
				let index = this.formData.requireds.indexOf(value)
				if(index > -1){
					this.formData.requireds.splice(index, 1)
				}else {
					this.formData.requireds.push(value)
				}
			},
			locationSwitch(e){
				console.log(e)
				this.formData.locationLimit = e.detail;
				if(!e.detail){
					this.formData.locations = [{ name: "请指定签到地点"}];
					
				}
			},
			wifiSwitch(e){
				this.formData.wifiLimit = e.detail;
				if(!e.detail){
					this.formData.wifis = [{ SSID: "点击获取wifi"}];
				}
			},
			addLoc(){
				this.formData.locations.push({
					name: "请指定签到地点",
					offset: 50
				})
			},
			delLoc(index){
				this.formData.locations.splice(index, 1)
			},
			addWifi(){
				this.formData.wifis.push({
					SSID: "点击获取wifi"
				})
			},
			delWifi(index){
				this.formData.wifis.splice(index, 1)
			},
			chooseLocation(index){
				let that = this
				uni.chooseLocation({
					success: function (res) {
						let location = {
							...that.formData.locations[index],
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						that.formData.locations.splice(index, 1, location)
					},
					fail(error){
						console.log(error)
					}
				})
			},
			getWifi(index){
				let that = this
				wx.getConnectedWifi({
					success(res){
						let wifi = res.wifi;
						that.formData.wifis.splice(index, 1, wifi)
					},
					fail(error){
						console.log(error)
					}
				})
			},
			offsetChange(index, value){
				let location = {
					...this.formData.locations[index],
					offset: value
				}
				this.formData.locations.splice(index, 1, location)
			},
			handleAddTask(){
				let sendData = Object.assign({}, this.formData, {creator: this.userInfo.nickName, members: [this.userInfo.nickName], creatorAvatar: this.userInfo.avatarUrl })
				taskApi.addTask(sendData).then(res => {
					// 成功通知
					this.notify({ 
						context: this,
						text: "创建成功!",
						type: "success",
						selector: "#task-notify",
					});
					uni.navigateBack()
				}).catch(error=>{
					// 失败通知
					this.notify({ 
						context: this,
						text: error.data,
						type: "danger",
						selector: "#task-notify"
					});
				})
			},
			changeBgImg(){
				let that = this;
				chooseFileUpload(1).then(res=>{
					that.formData.bgImg = res[0];
				})
			},
			onInput(e){
				this.currentDate = e.detail;
			},
			setPeriod(e){
				this.formData.signType = e.detail.name;
				this.periodShow = false;
			},
			setType(e){
				this.formData.type = e.detail.name;
				this.typeShow = false;
			},
			setBeginCurrent(val){
				if(this.formData.endTime){
					let endTime = dayjs(this.formData.endTime)
					let beginTime = dayjs(dayjs(val.detail).format("YYYY-MM-DD"))
					if(beginTime.isSameOrAfter(endTime)){
						uni.showToast({
							title:'开始时间不得晚于结束时间!',
							duration:2000
						})
						return false;
					}
				} 
				this.formData.beginTime =  dayjs(val.detail).format("YYYY-MM-DD")
				this.beginShow = false
				this.minEnd = dayjs(val.detail).add(1, 'day').toDate().getTime()
			},
			setEndCurrent(val){
				if(this.formData.beginTime){
					let beginTime = dayjs(this.formData.beginTime)
					let endTime = dayjs(dayjs(val.detail).format("YYYY-MM-DD"))
					if(beginTime.isSameOrAfter(endTime)){
						uni.showToast({
							title:'开始时间不得晚于结束时间!',
							duration:2000
						})
						return false;
					}
				} 
				this.formData.endTime =  dayjs(val.detail).format("YYYY-MM-DD")
				this.endShow = false
			},
			setRemindTime(val){
				this.formData.remindTime =  val.detail
				this.remindShow = false
			},
			
		},
	}
</script>

<style lang="scss">
	.add-task {
		position: relative;
		image {
			width: 100%;
			height: 100px;
		}
		.required-row {
			padding: 10px 16px;
			
			
		}
		.required-options {
			padding: 10px 16px;
			border-bottom: 1px solid #ebedf0;
			.required-item {
				padding: 6px 10px;
				border: 1px solid $main-icon-color;
				border-radius: 4px;
				margin-right: 5px;
				color: $main-icon-color;
				background-color: #fff;
				font-size: 12px;
				.icon {
					font-size: 16px;
					margin-right: 5px;
					vertical-align: top;
				}
			}
			.selected-item {
				background-color: $main-icon-color;
				color: #fff;
			}
		}
		.location-row {
			padding: 0 16px;
			.location-item {
				margin-bottom: 10px;
				.select-location {
					line-height: 34px;
					.location-name {
						flex: 1;
						color: $main-icon-color;
					}
					.location {
						font-size: 20px;
						color: $main-icon-color;
						margin-right: 5px;
					}
					.close {
						font-size: 20px;
						color: $main-grey-text;
						margin-left: 5px;
					}
				}
				.set-offset {
					line-height: 34px;
					.placeholder{
						font-size: 12px;
						color: $main-grey-text;
						margin-right: 10px;
						flex: 1;
					}
					input {
						width: 30%;
					}
					.unin {
						margin-left: 10px;
					}
					.close {
						font-size: 20px;
						color: $main-grey-text;
						margin-left: 5px;
					}
				}
			}
			.add-btn {
				line-height: 34px;
				color: $main-icon-color;
				.add {
					font-size: 20px;
					margin-right: 5px;
				}
				
			}
			.first {
				flex: 1;
			}
		}
		.submit-btn {
			width: 70%;
			margin: 40rpx auto;
		}
		.change-bg-btn {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
			padding: 16rpx 30rpx;
		}
	}
</style>
