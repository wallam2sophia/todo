export default {
	data(){
		return {
			SERVER_URL: "http://guoxiuqiong.top:8090/",
			userInfo: {},
		}
	},
	onLoad(options){
		this.userInfo = uni.getStorageSync('userInfo');
	}
}