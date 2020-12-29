<template>
	<view class="app" v-if='!isAuthed'>
		<view class="content-box">
			<view class="head">
				打卡了吧 欢迎您 :)
			</view>
			<view class="info">
				<view class="title">
					满足各种打卡场景：
				</view>
				<view class="features" v-for="(item, index) in features" :key="index">
					<view class="text">
						{{index + 1}}.&nbsp;&nbsp;{{item}}
					</view>
				</view>
			</view>
			<van-button type="primary" block @getuserinfo="handleAuth" custom-class="submit-btn" open-type="getUserInfo">点击登录</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAuthed: false,
				features:[
					"个人日记记录打卡",
					"读书阅读兴趣类打卡",
					"会议培训签到打卡",
					"学校班级布置作业签到",
					"公司考勤统计",
					"公众号粉丝签到活动等等"
				]
			}
		},
		onLoad() {
			if(this.userInfo){
				this.isAuthed  =true;
				console.log('go index,,,,')
				this.goIndex()
			}else {
				this. isAuthed = false
			}
		},
		methods: {
			handleAuth(res){
				console.log(res);
				if(res.detail.errMsg !== 'getUserInfo:ok'){
					uni.showToast({
						title: '授权失败'
					})
					this. isAuthed = false
					return false;
				}
				this.isAuthed = true;
				uni.setStorageSync('userInfo', res.detail.userInfo);
				console.log('go index,,,,')
				this.goIndex()
			},
			goIndex() {
				uni.switchTab({
					url: "../index/index"
				})
			},
		}
	}
</script>

<style lang="scss">
.app {
	position:fixed;
	top: 0;
	left: 0;
	width:100%;
	height:100%;
	z-index:-10;
	zoom: 1;
	background-color: #fff;
	background: url(http://127.0.0.1:8090/imgs/home_bg4.png);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center 0;
	
	.content-box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 26rpx;
		line-height: 2;
		
		.head {
			font-size: 34rpx;
			margin-bottom: 10px;
		}
		.info {
			.title {
				font-size: 30rpx;
				margin-bottom: 10px;
			}
		}
	}
	.submit-btn {
		margin-top: 30px;
		width: 300rpx;
		background: linear-gradient(to right, #114fad, #0073d1);
		border-color: #114fad;
	}
}
</style>
