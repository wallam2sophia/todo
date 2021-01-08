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
	import commonApi from "../../utils/service/common.js"
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
			if(Object.keys(this.userInfo).length > 0){
				this.isAuthed  =true;
				this.goIndex()
			}else {
				this. isAuthed = false
			}
		},
		methods: {
			handleAuth(res){
				let that = this;
				console.log(res);
				if(res.detail.errMsg !== 'getUserInfo:ok'){
					uni.showToast({
						title: '登录失败'
					})
					this.isAuthed = false
					return false;
				}
				let userInfo = res.detail.userInfo
				that.login(userInfo).then(res=>{
					that.isAuthed = true;
					uni.setStorageSync('userInfo', userInfo);
					that.goIndex()
				}).catch(error=>{
					uni.showToast({
						title: '登录失败'
					})
					that.isAuthed = false
					return false;
				})
				
			},
			login(userInfo){
				let that = this;
				return new Promise((resolve, reject)=>{
					wx.login({
						success(res){
							if (res.code) {
							      //发起网络请求
								  let sendData = {
									  nickName: userInfo.nickName,
									  avatarUrl: userInfo.avatarUrl,
									  code: res.code
								  }
								  commonApi.login(sendData).then(res=>{
									  console.log(res)
									  resolve(true)
								  })
							} else {
							  console.log('登录失败！' + res.errMsg)
							  reject(false)
							}
						},
						fail(error){
							console.log('登录失败！' + error)
							reject(false)
						}
					})
				})
				
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
	background: url(https://guoxiuqiong.top/imgs/home_bg4.png);
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
