import { SERVER_URL, WS_URL } from "./const.js"
import Notify from '../wxcomponents/vant-weapp/notify/notify.js';

export default {
	data(){
		return {
			SERVER_URL: SERVER_URL,
			WS_URL: WS_URL,
			userInfo: {},
			loading: false,
		}
	},
	onLoad(options){
		this.userInfo = uni.getStorageSync('userInfo');
	},
	mounted(){
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
		},
		startLoading(title = "加载中"){
			this.loading = true;
			uni.showLoading({
			    title: title,
				mask: true
			});
		},
		stopLoading(){
			this.loading = false;
			uni.hideLoading();
		}
	}
}