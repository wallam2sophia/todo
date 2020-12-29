import { getJSON, postJSON } from "../request.js"

export default {
	// 新建点赞
	addLike(data){
		return new Promise((resolve, reject) => {
			let url = "api/add/like"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	
	// 删除点赞
	deleteLike(likeId){
		return new Promise((resolve, reject) => {
			let url = "api/delete/like/" + likeId
			getJSON(url).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	
	// 查询点赞
	listLike(data){
		return new Promise((resolve, reject) => {
			let url = "api/list/like"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}