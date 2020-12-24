import { SERVER_URL } from "./const.js"

export default {
	data(){
		return {
			SERVER_URL: SERVER_URL,
			userInfo: {},
		}
	},
	onLoad(options){
		this.userInfo = uni.getStorageSync('userInfo');
	}
}