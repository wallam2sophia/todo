import { SERVER_URL } from "./const.js"
import Notify from '../wxcomponents/vant-weapp/notify/notify.js';

export default {
	data(){
		return {
			SERVER_URL: SERVER_URL,
			userInfo: {},
		}
	},
	onLoad(options){
		this.userInfo = uni.getStorageSync('userInfo');
	},
	methods:{
		notify({context, text, type="success", selector="#van-notify", duration=2000}=options){
			Notify({
			  type: type,
			  context: context,
			  message: text,
			  duration: duration,
			  selector: selector,
			});
		}
	}
}