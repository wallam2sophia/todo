import { getJSON, postJSON } from "../request.js"

export default {
	// 我的任务和打卡信息
	myGeneral(data){
		return new Promise((resolve, reject) => {
			let url = "api/statistic/general"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}