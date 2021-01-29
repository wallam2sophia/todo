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
	// 获取小程序码
	getQRCode(data){
		return new Promise((resolve, reject) => {
			let url = "api/qrcode"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取运动数据
	getRunData(data){
		return new Promise((resolve, reject) => {
			let url = "api/run/data"
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
	// 测试定时任务
	testSchedule(data){
		return new Promise((resolve, reject) => {
			let url = "api/test/schedule"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}