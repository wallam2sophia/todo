import { getJSON, postJSON } from "../request.js"

export default {
	// 新建打卡
	addSign(data){
		return new Promise((resolve, reject) => {
			let url = "api/add/sign"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 查询打卡日志
	listSign(data){
		return new Promise((resolve, reject) => {
			let url = "api/list/sign"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}