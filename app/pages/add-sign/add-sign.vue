<template>
	<view class="add-sign">
		<view class="content">
			<van-field
			    :value="form.text"
			    type="textarea"
			    placeholder="请输入文字内容"
			    :autosize="{ maxHeight: 250, minHeight: 150}"
			    :border="false"
				input-class="text-input required"
			/>
			<view class="oper-bars flex-row">
				<view class="picture bar-item flex-column required">
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
				<view class="location bar-item flex-column">
					<van-icon name="location-o" custom-class="icon" />
					<view class="text">
						地理位置
					</view>
				</view>
			</view>
		</view>

		<view  class="my-btn primary-btn sign-btn" >确定发布打卡</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					text: "",
				}
			}
		},
		methods: {
			
		}
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
