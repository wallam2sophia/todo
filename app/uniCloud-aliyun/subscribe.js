// 插件市场导入的引入方式
const  APPID = "wx1bdebb28c99f1a74"
const SECRET = "a3b1eb4dc9a613c23b9dd8403a98d74b"
const openapi = require('mp-cloud-openapi')

const openapiWeixin = openapi.initWeixin({
  appId: APPID,
  secret: SECRET
})

const getAccessToken = async function(){
	const { accessToken, expiresIn } = await openapiWeixin.auth.getAccessToken()
	return accessToken
}

const sendMsg = async function(){
	const accessToken = await getAccessToken()
	console.log(accessToken)
	await openapiWeixin.customerServiceMessage.send({
	  accessToken: accessToken,
	  touser: '',
	  msgtype: 'miniprogrampage',
	  miniprogrampage: {
		  title: '打卡提醒',
		  pagepath: 'pages/index/index',
		  thumbMediaId: ''
	  }
	})
}
