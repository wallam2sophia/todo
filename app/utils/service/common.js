import { getJSON, postJSON } from "../request.js"

export default {
	// 登录
	login(data){
		return new Promise((resolve, reject) => {
			let url = "api/login"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 发送消息
	sendMsg(data){
		return new Promise((resolve, reject) => {
			let url = "api/send/msg"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}