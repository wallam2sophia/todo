<template>
	<view class="app" v-if='!isAuthed'>
		<van-button type="primary" block @getuserinfo="handleAuth" custom-class="submit-btn" open-type="getUserInfo">点击授权</van-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAuthed: false
			}
		},
		onLoad() {
			if(this.userInfo){
				this.isAuthed  =true;
				console.log('go index,,,,')
				this.goIndex()
			}
		},
		methods: {
			handleAuth(res){
				console.log(res);
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
	.submit-btn {
		width: 70%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(to right, #114fad, #0073d1);
		border-color: #114fad;
	}
}
</style>
