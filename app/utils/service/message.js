import { getJSON, postJSON } from "../request.js"

export default {
	// 查询消息列表
	listMessage(data){
		return new Promise((resolve, reject) => {
			let url = "api/list/message"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}