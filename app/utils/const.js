export const rankTabOptions = [{
		value: 'today',
		label: '今天'
	},
	{
		value: 'yesterday',
		label: '昨天'
	},
	{
		value: 'lastweek',
		label: '上周'
	},
	{
		value: 'lastmonth',
		label: '上月'
	},
	{
		value: 'total',
		label: '总榜'
	},
]
export const periods = [{
		value: "daily",
		name: '每天',
	},
	{
		value: "weekday",
		name: '法定工作日',
	},
]
export const types = [{
		value: "sign",
		name: '打卡',
	},
	{
		value: "mission",
		name: '事项',
	},
]

export const signRequireds = [
	{
		label: "文字",
		value: "text"
	},
	{
		label: "图片",
		value: "images"
	},
	{
		label: "视频",
		value: "videos"
	},
	{
		label: "音频",
		value: "audios"
	},
]

export const templateId = "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM"
export const SERVER_URL = "http://127.0.0.1:8090/" // 本地开发环境
// export const SERVER_URL = "https://guoxiuqiong.top/"  // 生产环境
export const WS_URL = "ws://127.0.0.1:8091/" // 本地开发环境
// export const WS_URL = "wss://guoxiuqiong.top/"  // 生产环境