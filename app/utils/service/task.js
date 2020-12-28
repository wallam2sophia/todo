import { getJSON, postJSON } from "../request.js"

export default {
	// 随机获取一张任务背景图
	getTaskBg(){
		return new Promise((resolve, reject) => {
			let url = "api/task/bgimg"
			getJSON(url).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	
	// 新建任务
	addTask(data){
		return new Promise((resolve, reject) => {
			let url = "api/add/task"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 修改任务
	editTask(data){
		return new Promise((resolve, reject) => {
			let url = "api/edit/task"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 删除任务
	deleteTask(id){
		return new Promise((resolve, reject) => {
			let url = "api/delete/task/"+ id
			getJSON(url).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 查询任务列表
	listTask(data){
		return new Promise((resolve, reject) => {
			let url = "api/list/task"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 查询任务详情
	detailTask(user, taskId){
		return new Promise((resolve, reject) => {
			let url = "api/detail/task"
			getJSON(url + "/" + user + "/" + taskId).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}