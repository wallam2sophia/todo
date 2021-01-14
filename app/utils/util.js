import {
	ConvertPinyin
} from "./PY.js"
import {
	templateId
} from "./const"
const pySegSort = function(arr) {
	let letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
	let segs = {};
	let indexedList = []
	// 创建一个以26个为key的对象
	letters.forEach(item => {
		segs[item] = [];
	})
	arr.forEach(item => {
		// 取姓氏并返回姓氏的拼音首字母
		let calP = ConvertPinyin(item).substr(0, 1)
		// 在A-z之中写入对应字母的对象数组中，否则传入*对象数组里
		letters.includes(calP) ? segs[calP.toLocaleUpperCase()].push(item) : segs['*'].push(item)

	})
	// 循环segs对象，转换为indexList组件需要的格式
	for (const [key, value] of Object.entries(segs)) {
		value.length && indexedList.push({
			letter: key,
			data: value
		})
	}
	indexedList.forEach(item => {
		if (item.data.length > 1) {
			// 这里是给相同拼音首字母进行排序
			item.data = item.data.sort((a, b) => {
				return a.localeCompare(b)
			})
		}
	})
	return indexedList;
}

/**
 * 比较时间大小
 */
const dateCompare = function(startDate, endDate) {
	// 计算截止时间
	startDate = new Date(startDate.replace('-', '/').replace('-', '/'))
	// 计算详细项的截止时间
	endDate = new Date(endDate.replace('-', '/').replace('-', '/'))
	if (startDate < endDate) {
		return -1
	} else if (startDate === endDate) {
		return 0
	} else {
		return 1
	}
}

const chooseFileUpload = function(count = 9) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera '], //从相册选择
			success: function({
				tempFilePaths,
				tempFiles
			}) {
				console.log("tempFilePaths", tempFilePaths);
				console.log("tempFiles", tempFiles);
				const p = tempFilePaths.map(item => uploadFile(item))
				uni.showLoading({
					title: "上传中...",
					mask: true
				});
				Promise.all(p).then(res => {
					console.log(res)
					uni.hideLoading()
					resolve(res)
				}).catch(err => {
					uni.hideLoading()
					reject([])
				})
			}
		});
	})
}

const uploadFile = function(file) {
	return new Promise((resolve, reject) => {
		console.log("file", file)
		uniCloud.uploadFile({
			filePath: file,
			cloudPath: 'a.jpg',
			success(e) {
				if (e.success == true) {
					resolve(e.fileID);
				} else {
					uni.showModal({
						title: "上传图片失败",
						content: JSON.stringify(e) + file
					})
					reject(e)
				}
			},
			fail(e) {
				uni.showModal({
					title: "上传图片失败",
					content: JSON.stringify(e) + file
				})
				reject(e)
			}
		})
	})

}

const hasWarning = function() {
	return new Promise((resolve, reject)=>{
		wx.requestSubscribeMessage({
			tmplIds: [templateId],
			success(res) {
				console.log(res)
				if (res.errMsg === 'requestSubscribeMessage:ok') {
					resolve(true)
				}else {
					reject(false)
				}
			},
			fail(error) {
				console.log(error)
				reject(false)
			},
		})
	})
	
}

// 方法定义 lat,lng 
const getDistance = function( lat1,  lng1,  lat2,  lng2){
    let radLat1 = lat1*Math.PI / 180.0;
    let radLat2 = lat2*Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * 6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 * 1000;
    return s;
}
export {
	pySegSort,
	dateCompare,
	chooseFileUpload,
	uploadFile,
	hasWarning,
	getDistance
}
