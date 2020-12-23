<template>
	<view class="add-task">
		<image :src="SERVER_URL + formData.bgImg"/>
		<view class="my-btn warning-btn change-bg-btn" @click="changeBgImg">更换背景图</view>
		<van-field :value="formData.title" placeholder="请填写打卡标题" @input="(e)=>formData.title=e.detail"/>
		<van-field :value="formData.desc" placeholder="请填写备注" @input="(e)=>formData.desc=e.detail"/>
		<van-cell title="开始日期" :value="formData.beginTime" is-link @click="beginShow=true"/>
		<van-cell title="结束日期" :value="formData.endTime" is-link @click="endShow=true"/>
		<van-cell title="签到周期" :value="formData.signType" is-link @click="periodShow=true"/>
		<van-action-sheet :show="periodShow" :actions="periods" round close-on-click-overlay @select="setPeriod"/>
		<van-popup :show="beginShow" position="bottom" round >
			<van-datetime-picker type="date" :value="currentBegin" :min-date="minBegin" @input="onInput"  @cancel="beginShow=false" @confirm="setBeginCurrent"/>
		</van-popup>
		<van-popup :show="endShow" position="bottom" round @cloce="endShow=false">
			<van-datetime-picker type="date" :value="currentEnd" :min-date="minEnd" @input="onInput"  @cancel="endShow=false" @confirm="setEndCurrent"/>
		</van-popup>
		<view  class="my-btn primary-btn submit-btn" @click="submitForm">点击打卡</view>
	</view>
</template>

<script>
	import uniCombox from "../../components/uni-combox/uni-combox"
	import taskApi from "../../utils/service/task.js"
	import dayjs from 'dayjs';
	import isSameOrAfter from'dayjs/plugin/isSameOrAfter';
	dayjs.extend(isSameOrAfter)
	export default {
		components: {
			"uni-combox": uniCombox
		},
		data() {
			return {
				beginShow: false,
				endShow: false,
				periodShow: false,
				currentBegin: new Date().getTime(),
				currentEnd: new Date().getTime(),
				minBegin: new Date().getTime(),
				minEnd: new Date().getTime(),
				loading: false,
				formData: {
					bgImg: "",
					title: "",
					desc: "",
					beginTime: "",
					endTime: "",
					signType: ""
				},
				periods: [
					 {
						value: "daily",
						name: '每天',
					 },
					 {
						value: "weekday",
						name: '法定工作日',
					 },
				],
				formatter(type, value) {
				      console.log(type, value)
				},
			}
		},
		onLoad(){
			taskApi.getTaskBg().then(res=>{
				console.log(res)
				this.formData.bgImg = res.data;
			})
			// this.currentDate = dayjs(new Date()).format("YYYY-MM-DD")
		},
		methods: {
			submitForm() {
				console.log(this.userInfo)
				let sendData = Object.assign({}, this.formData, {creator: this.userInfo.nickName, members: [this.userInfo.nickName]})
				console.log(sendData)
				taskApi.addTask(sendData).then(res => {
					uni.showToast({
						icon: 'success',
					    title: res.data,
					    duration: 2000
					});
					uni.navigateBack()
				}).catch(error=>{
					uni.showToast({
					    title: error.data,
					    duration: 2000
					});
				})
			},
			changeBgImg(){
				let that = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
				        uni.uploadFile({
							url: this.SERVER_URL + 'api/change/taskbg', // 仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								taskId: this.taskId
							},
							success(res) {
								console.log(res)
								if(res.statusCode !== 200){
									uni.showToast({
									    title: "上传失败!",
									    duration: 2000
									});
									return false
								}
								let data = JSON.parse(res.data)
								if(data.code !== 100){
									uni.showToast({
									    title: "上传失败!",
									    duration: 2000
									});
									return false
								}
								that.formData.bgImg = data.data;
							},
				        });
				    }
				});
				// uni.navigateTo({
				// 	url:'../task-bg/task-bg'
				// })
			},
			onInput(e){
				this.currentDate = e.detail;
			},
			setPeriod(e){
				this.formData.signType = e.detail.name;
				this.periodShow = false;
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
