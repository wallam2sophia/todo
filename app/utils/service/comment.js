import { getJSON, postJSON } from "../request.js"

export default {
	// 新建评论
	addComment(data){
		return new Promise((resolve, reject) => {
			let url = "api/add/comment"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 删除评论
	deleteComment(commentId){
		return new Promise((resolve, reject) => {
			let url = "api/delete/comment/" + commentId
			getJSON(url).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 查询评论
	listComment(data){
		return new Promise((resolve, reject) => {
			let url = "api/list/comment"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}