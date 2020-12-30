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
				<view class="video bar-item flex-column">
					<van-icon name="video-o" custom-class="icon" />
					<view class="text">
						上传视频
					</view>
				</view>
				<view class="volumn bar-item flex-column">
					<van-icon name="volume-o" custom-class="icon" />
					<view class="text">
						打开录音
					</view>
				</view>
			</view>
			<view class="media-box flex-row">
				<view class="media-item" v-for="(item,index) in form.media" :key="index">
					<image :src="item" mode="aspectFit"></image>
					<van-icon name="clear" custom-class="icon-delete" @click="deleteMedia(index)"/>
				</view>
			</view>
			<view class="flex-column">
				<view class="row">
					<van-cell title="地理位置" :label="form.location.name" is-link @click="chooseLocation" icon="location-o" :border="false" custom-class="location"/> 
				</view>
				
			</view>
		</view>

		<view  class="my-btn primary-btn sign-btn" @click="signIn()">确定发布打卡</view>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="sign-notify"/>
	</view>
</template>

<script>
	import signApi from "../../utils/service/sign.js"
	import { chooseFileUpload } from "../../utils/util.js"
	
	export default {
		data() {
			return {
				taskId: "",
				signDate: "",
				form: {
					text: "",
					media: [],
					location: {}
				},
				rules:{
					required: ['text']
				}
			}
		},
		methods: {
			chooseImage(){
				let that = this
				chooseFileUpload().then(res=>{
					console.log(res)
					that.form.media = res;
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
			deleteMedia(index){
				this.form.media = [...this.form.media.slice(0, index), ...this.form.media.slice(index)]
				console.log(this.form.media)
			},
			signIn(){
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
						text: "打卡成功!",
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
			
			.icon-delete {
				font-size: 18px;
				position: absolute;
				color: #f00;
				top: 0;
				right: -5px;
			}
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
}
</style>
