<template>
	<view class="add-sign">
		<view class="content">
			<van-field
			    :value="form.text"
				@input="(e)=>form.text=e.detail"
			    type="textarea"
			    placeholder="请输入文字内容"
			    :autosize="{ maxHeight: 250, minHeight: 150}"
			    :border="false"
				input-class="text-input required"
			/>
			<view class="oper-bars flex-row">
				<view class="picture bar-item flex-column required" @click="chooseImage">
					<van-icon name="photo-o" custom-class="icon"/>
					<view class="text">
						上传图片
					</view>
				</view>
				<view class="video bar-item flex-column required">
					<van-icon name="video-o" custom-class="icon" @click="chooseVideo"/>
					<view class="text">
						上传视频
					</view>
				</view>
				<view class="volumn bar-item flex-column" @click="openRecord">
					<van-icon name="volume-o" custom-class="icon" />
					<view class="text">
						打开录音
					</view>
				</view>
				<view class="volumn bar-item flex-column" v-if="!recordOpen" @click="getRunData">
					<van-icon name="award-o" custom-class="icon" />
					<view class="text">
						{{runText}}
					</view>
				</view>
			</view>
			<view class="media-box flex-row">
				<view class="media-item" v-for="(item, index) in form.images" :key="index">
					<image :src="item" mode="aspectFit"></image>
					<van-icon name="clear" custom-class="icon-delete" @click="deleteImage(index)"/>
				</view>
				<view class="media-item" v-for="(item, index) in form.videos" :key="index">
					<image :src="item.cover" mode="aspectFit"></image>
					<van-icon name="clear" custom-class="icon-delete" @click="deleteVideo(index)"/>
					<van-icon name="play-circle-o" custom-class="icon-play" @click="playVideo(item.src)"/>
				</view>
			</view>
			<view class="flex-column">
				<view class="row">
					<van-cell title="地理位置" :label="form.location.name" is-link @click="chooseLocation" icon="location-o" :border="false" custom-class="location"/> 
				</view>
				
			</view>
			
		</view>
		<view class="tips"v-if="recordOpen">
			录音(最多支持9段录音,每段录音600秒内。)
		</view>
		<view class="flex-column content" v-if="recordOpen">
			<view class="row flex-row" v-if="form.audios.length > 0">
				<view class="audio-bar flex-row" @click="playAudio(item.src)" v-for="(item, index) in form.audios" :key="index">
					<van-icon name="volume-o" custom-class="icon-volume"/>
					<text>{{item.duration}}″</text>
					<van-icon name="clear" custom-class="icon-delete" @click="deleteAudio(index)"/>
				</view>
			</view>
			<view class="line">
				
			</view>
			<view class="row flex-column" @click="goRecord">
				<view class="flex-row record-box">
					<view class="icon">
						<van-icon name="volume-o" custom-class="icon-start" v-if="!recordStart"/>
						<view class="go-end" v-else>
							<van-icon name="stop" custom-class="icon-end"/>
						</view>
						
					</view>
					<view class="info flex-row">
						<!-- <view class="dot" v-show="recordStart"></view> -->
						<view class="seconds">{{recordDuration}}″/600″</view>
						<view v-show="recordStart">录音中</view>
					</view>
					
				</view>
				<view class="text">
					<text v-if="recordStart" class="end-text">点击完成录音</text>
					<text v-else>点击开始录音</text>
				</view>
			</view>
			
		</view>
		<view  class="my-btn primary-btn sign-btn" @click="signIn()">确定发布打卡</view>
		<van-overlay :show="viewVideo" @click="viewVideo=false" z-index="999">
		  <view class="wrapper" @click.stop="">
			<video :src="videoSrc" controls :autoplay="true" :muted="true" object-fit="contain" enable-play-gesture></video>
		  </view>
		</van-overlay>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="sign-notify"/>
	</view>
</template>

<script>
	import signApi from "../../utils/service/sign.js"
	import commonApi from "../../utils/service/common.js"
	import { chooseImage, chooseVideo, uploadFile } from "../../utils/util.js"
	
	export default {
		data() {
			return {
				taskId: "",
				signDate: "",
				viewVideo: false,
				recordOpen: false,
				recordStart: false,
				videoSrc: "",
				runText: "运动步数",
				form: {
					text: "",
					images: [],
					videos:[],
					audios:[],
					location: {}
				},
				rules:{
					required: ['text']
				},
				recordDuration: 0,
				recordManager: null,
				innerAudioContext: null
			}
		},
		methods: {
			getRunData(){
				let that = this;
				wx.getWeRunData({
					success(res){
						console.log(res)
						let sendData = {
							nickName: that.userInfo.nickName,
							encryptedData: res.encryptedData,
							iv: res.iv
						}
						commonApi.getRunData(sendData).then(res=>{
							console.log(res)
							let runData = res.data.stepInfoList
							that.runText = runData[runData.length - 1].step
						})
					},
					fail(error){
						console.log(error)
					}
				})
			},
			openRecord(){
				let that = this
				let timer = null
				this.recordOpen = true;
				this.recordManager = uni.getRecorderManager();
				this.innerAudioContext = uni.createInnerAudioContext();
				this.recordManager.onStart(function(){
					console.log("开始录音")
					timer = setInterval(()=>{
						that.recordDuration ++ 
					}, 1000)
				})
				this.recordManager.onStop(function(res){
					console.log("结束录音")
					clearInterval(timer)
					let result = {
						duration: that.recordDuration,
						src: res.tempFilePath
					}
					that.form.audios.push(result)
					that.recordStart = false;
					that.recordDuration = 0;
				})
				this.recordManager.onError(function(res){
					console.log(res)
					console.log("录音出错")
				})
			},
			goRecord(){
				if(this.recordStart){
					this.recordManager.stop()
				}else{
					if(this.form.audios.length >= 9){
						// 失败通知
						this.notify({ 
							context: this,
							text: "最多支持9段录音!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}
					this.recordManager.start({ duration: 600000 })
				}
				this.recordStart = !this.recordStart
			},
			chooseImage(){
				let that = this
				chooseImage({ upload: false }).then(res=>{
					console.log(res)
					that.form.images = [...that.form.images, ...res];
				})
			},
			chooseVideo(){
				let that = this
				chooseVideo({ upload: false }).then(res=>{
					console.log(res);
					that.form.videos = [...that.form.videos, ...res];
				})
			},
			chooseLocation(){
				let that = this
				uni.chooseLocation({
					success: function (res) {
							that.form.location = {
								name: res.name,
								address: res.address,
								latitude: res.latitude,
								longitude: res.longitude
							}
					},
					fail(error){
						console.log(error)
					}
				})
			},
			deleteImage(index){
				this.form.images.splice(index, 1)
			},
			deleteVideo(index){
				this.form.videos.splice(index, 1)
			},
			playVideo(src){
				this.viewVideo = true;
				this.videoSrc = src;
			},
			deleteAudio(index){
				this.form.audios.splice(index, 1)
			},
			playAudio(src){
				this.innerAudioContext.src = src;
				this.innerAudioContext.play()
			},
			uploadMediaFile(){
				return new Promise((resolve, reject)=>{
					uni.showLoading({
						title: "上传中...",
						mask: true
					});
					let count = 0;
					// 上传图片
					let images = JSON.parse(JSON.stringify(this.form.images))
					const p = images.map(item => uploadFile(item))
					Promise.all(p).then(res => {
						this.form.images = res;
						if(count === 3){
							resolve(true)
						}else {
							count ++;
						}
					}).catch(err => {
						console.log(err)
						reject(false)
					})
					// 上传视频文件
					let videos = JSON.parse(JSON.stringify(this.form.videos))
					console.log('videos', videos)
					const p1 = videos.map(item => uploadFile(item.src))
					Promise.all(p1).then(res => {
						this.form.videos.forEach((item, index)=>{
							this.form.videos[index].src = res[index]
						})
						if(count === 3){
							resolve(true)
						}else {
							count ++;
						}
					}).catch(err => {
						console.log(err)
						reject(false)
					})
					// 上传视频封面
					const p2 = videos.map(item => uploadFile(item.cover))
					Promise.all(p2).then(res => {
						this.form.videos.forEach((item, index)=>{
							this.form.videos[index].cover = res[index]
						})
						if(count === 3){
							resolve(true)
						}else {
							count ++;
						}
					}).catch(err => {
						console.log(err)
						reject(false)
					})
					
					// 上传录音文件
					let audios = JSON.parse(JSON.stringify(this.form.audios))
					const p3 = audios.map(item => uploadFile(item.src))
					Promise.all(p3).then(res => {
						this.form.audios.forEach((item, index)=>{
							this.form.audios[index].src = res[index]
						})
						if(count === 3){
							resolve(true)
						}else {
							count ++;
						}
					}).catch(err => {
						console.log(err)
						reject(false)
					})
				})
			},
			signIn(){
				this.uploadMediaFile().then(res=>{
					uni.hideLoading()
					let sendData = {
						taskId: this.taskId,
						signer: this.userInfo.nickName,
						avatarUrl: this.userInfo.avatarUrl,
						signTime: this.signDate,
						...this.form
					}
					console.log(sendData)
					signApi.addSign(sendData).then(res => {
						// 成功通知
						this.notify({ 
							context: this,
							text: res.data,
							type: "success",
							selector: "#sign-notify"
						});
						uni.navigateBack()
					}).catch(error=>{
						// 失败通知
						this.notify({ 
							context: this,
							text: error.data,
							type: "danger",
							selector: "#sign-notify"
						});
					})
				}).catch(error=>{
					// 失败通知
					console.log(error)
					this.notify({ 
						context: this,
						text: "上传失败!",
						type: "danger",
						selector: "#sign-notify"
					});
					uni.hideLoading()
				})
				

			},
			validateForm(){
				for(let [key, value] of Object.entries(this.rules)){
					console.log(key, value)
					switch(key){
						case 'required':
							for(let item of value){
								if(! item in this.form || !this.form[item]){
									break
								}
							}
					}
				}
			},
		},
		onLoad(options){
			this.taskId = options.taskId;
			this.signDate = options.signDate || new Date().getTime()
		},
	}
</script>

<style lang="scss">
.add-sign {
	background-color: #eee;
	height: 100vh;
	
	.content {
		padding: 30rpx 20rpx;
		background-color: #fff;
	}
	.js-start {
		align-items: flex-start;
	}
	.tips {
		height: 100rpx;
		line-height: 100rpx;
		color: $main-grey-text;
		font-size: 24rpx;
		padding-left: 10px;
	}
	.audio-bar {
		background-color: #0081ff;
		color: #fff;
		border: 1px solid #0081ff;
		padding: 5px 15px;
		display: inline-flex;
		border-radius: 5px;
		position: relative;
		margin-right: 20px;
		margin-bottom: 10px;
		
		.icon-volume {
			font-size: 16px;
			margin-right: 5px;
		}
		.icon-delete {
			font-size: 18px;
			position: absolute;
			color: #f00;
			top: -7px;
			right: -13px;
		}
	}
	.line {
		height: 1px;
		background-color: #eee;
		width: 100%;
		margin-bottom: 10px;
	}
	.record-box {
		position: relative;
	}
	.icon-start {
		font-size: 20px;
		border: 1px solid $main-grey-text;
		color: $main-icon-color;
		padding: 10px;
		border-radius: 50%;
	}
	.go-end {
		border: 1px solid $main-grey-text;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		position: relative;
	}
	.icon-end {
		font-size: 20px;
		color: $main-icon-color;
		animation: spark 1s infinite;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	// .end-text {
	// 	color: $main-grey-text;
	// }
	.info {
		color: #f00;
		position: absolute;
		top: 50%;
		left: 52px;
		transform: translateY(-50%);
		white-space: nowrap;
		
		.dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background-color: #f00;
			margin-right: 5px;
			animation: spark 1s infinite
		}
	}
	.seconds {
		margin-right: 5px;
	}
	.text {
		color: $main-icon-color;
		margin-top: 5px;
	}
	.van-cell {
		padding: 0;
	}
	.van-field__page--textarea {
	    padding: 0;
	}
	.text-input {
		border: 1px solid $uni-border-color;
		padding: 20rpx;
		border-radius: 5px;
		position: relative;
	}
	.oper-bars {
		margin: 20rpx auto;
		flex-wrap: wrap;
		.bar-item {
			// width: 130rpx;
			// height: 130rpx;
			border: 1px solid $uni-border-color;
			border-radius: 5px;
			margin-right: 20rpx;
			box-sizing: border-box;
			padding: 10rpx 15rpx;
			cursor: pointer;
			position: relative;
			
			.icon {
				font-size: 48rpx;
				margin-bottom: 10rpx;
				color: $main-icon-color;
			}
			.text {
				font-size: 24rpx;
			}
		}
	}
	.media-box {
		flex-wrap: wrap;
		.media-item {
			width: 150rpx;
			height: 150rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			image {
				width: 100%;
				height: 100%;
			}
			
			.icon-play {
				font-size: 18px;
				color: #fff;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.icon-delete {
				font-size: 18px;
				position: absolute;
				color: #f00;
				top: -6px;
				right: -6px;
			}
		}
	}
	.wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
		video {
			width: 750rpx;
		}
	}
	.row {
		width: 100%;
		padding: 20rpx;
	}
	.location {
		.van-icon-location-o {
			font-size: 20px;
			color: #f00;
		}
	}
	.sign-btn {
		margin: 30rpx auto;
		width: 70%;
		
	}
	
	.required {
		&::after {
			content: "必填";
			position: absolute;
			right: 0px;
			top: 0px;
			background-color: #f00;
			color: #fff;
			padding: 1px 3px;
			border-radius: 3px;
			font-size: 22rpx;
		}
	}
	@keyframes spark {
	  0% {
	    opacity: 0.1
	  }
	  20% {
	    opacity: 0.3
	  }
	  40% {
	    opacity: 0.5
	  }
	  60% {
	    opacity: 0.7
	  }
	  80% {
	    opacity: 0.9
	  }
	  100% {
	    opacity: 1
	  }
	}
}
</style>
