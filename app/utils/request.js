const BASE_URL = "http://guoxiuqiong.top:8090/"

const request = (url, method="GET", data={}, )=>{
	return new Promise((resolve, reject)=>{
		uni.request({
			url:BASE_URL + url,
			data,
			method,
			success:(res)=>{
				if(res.data.code !== 100){
					uni.showToast({
						title:"接口请求失败!"
					})
					reject(res.data)
				}
				resolve(res.data);
			},
			fail:(error)=>{
				uni.showToast({
					title:"接口请求失败!"
				})
				reject(error);
			}
		})
	})
}

export const getJSON = (url, data={}) => {
	return request(url, "GET", data)
}

export const postJSON = (url, data={}) => {
	return request(url, "POST", data)
}