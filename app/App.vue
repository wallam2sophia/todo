<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getUserInfo().then(res => {
				uni.setStorageSync('userInfo', res[1].userInfo);
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
	body,page {
		background-color: #fff;
		font-size: 30rpx;
		color: #333;
	}
	.ds-beetw {
		display: flex;
		justify-content: space-between;
	}
</style>
