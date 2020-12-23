export default {
	data(){
		return {
			SERVER_URL: "https://guoxiuqiong.top/",
			// SERVER_URL: "http://127.0.0.1:8090/",
			userInfo: {},
		}
	},
	onLoad(options){
		this.userInfo = uni.getStorageSync('userInfo');
	}
}