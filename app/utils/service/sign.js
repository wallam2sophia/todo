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
	// 审批打卡
	approveSign(data){
		return new Promise((resolve, reject) => {
			let url = "api/approve/sign"
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
	
	// 统计打卡
	statisticSign(data){
		return new Promise((resolve, reject) => {
			let url = "api/statistic/sign"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 统计打卡
	statisticTask(data){
		return new Promise((resolve, reject) => {
			let url = "api/statistic/task"
			postJSON(url, data).then(res=>{
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
}