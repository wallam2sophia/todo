<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// uni.getProvider({
			// 	service: "oauth",
			// 	success: function(res){
			// 		let provider = res.provider[0]
			// 		console.log(provider)
			// 		uni.login({
			// 			provider: provider,
			// 			success: function(res){
			// 				console.log(res)
			// 			}
			// 		})
		
			// 	}
			// })
			uni.getUserInfo(
			{
				success: function(res) {
					console.log('获取用户信息成功', res.userInfo);
					uni.setStorageSync('userInfo', res.userInfo);
				},
				fail: function(e) {
				    console.log("获取用户信息失败: ", e);
					// uni.navigateTo({
					// 	url: "/pages/home/home"
					// })
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './wxcomponents/vant-weapp/common/index.wxss';

	body,
	page {
		background-color: #fff;
		font-size: 26rpx;
		color: #333;
		
	}

	.ds-beetw {
		display: flex;
		justify-content: space-between;
	}

	.my-btn {
		font-size: 26rpx;
		color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 28rpx;
		cursor: pointer;
		text-align: center;
	}

	.primary-btn {
		background: linear-gradient(to right, #114fad, #0073d1);
	}

	.warning-btn {
		background: linear-gradient(to right, #f7b56b, #f27f59);
	}
	.success-btn {
		background: linear-gradient(to right, #2de069, #1a803c);
	}
	.info-btn {
		background: linear-gradient(to right, #d4d4d4, #6e6e6e);
	}
	.disabled-btn {
		cursor: not-allowed;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
		align-items: center
	}

	.flex-row {
		display: flex;
		align-items: center;
	}
</style>
