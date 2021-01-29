const dayjs = require("dayjs")
const https = require("https");
const iconv = require("iconv-lite");
const APPID = "wx1bdebb28c99f1a74"
const SECRET = "a3b1eb4dc9a613c23b9dd8403a98d74b"
const querystring = require('querystring')
const request = require('superagent');
const crypto = require('crypto')
const templateId = "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM"

function timeContinusData(timeArr) {
  let resultArr = []
  let curArr = []
  let maxC = 0;
  let lastC = 0;
  if (timeArr.length <= 1) {
    return [timeArr]
  }
  for (let i = 0; i <= timeArr.length - 2; i++) {
    let cur = timeArr[i]
    let next = timeArr[i + 1]
    if (dayjs(next).diff(dayjs(cur), 'day') === 1) {
      curArr.push(cur)
    } else {
      curArr.length > 0 && resultArr.push([...curArr, cur]);
      curArr = []
    }
  }
  curArr.length > 0 && resultArr.push([...curArr, timeArr[timeArr.length - 1]]) && (lastC = [...curArr, timeArr[timeArr.length - 1]].length);
  resultArr.forEach(item => {
    if (item.length > maxC) {
      maxC = item.length
    }
  })
  return [resultArr, lastC, maxC]
}

// 用户认证
const authSession = async function (code) {
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`
  let res = await request
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    let bodyJson = JSON.parse(res.text)
    console.log(bodyJson)
    if(bodyJson.errcode && bodyJson.errcode !== 0){
      console.log(bodyJson.errcode, bodyJson.errmsg)
      return false
    }
    return {openid: bodyJson.openid, session_key: bodyJson.session_key};
}

// 获取AccessToken
const getAccessToken = async function () {
  let url = `https://api.weixin.qq.com/cgi-bin/token?appid=${APPID}&secret=${SECRET}&grant_type=client_credential`;
  let res = await request
      .get(url)
      .set('Accept', 'application/json')
  if(res.body.errcode && res.body.errcode !== 0){
    console.log(res.body.errcode, res.body.errmsg)
    return false
  }
  return res.body.access_token;
}

// 获取小程序二维码
const getQRCode = async function(path){
  const access_token = await getAccessToken();
  let url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`
  let postData = {
    path,
    width: 280
  }
  let res = await request
      .post(url)
      .send(postData)
      .set('Accept', 'application/json')
  console.log(res.body)
  if(res.body.errcode && res.body.errcode !== 0){
    console.log(res.body.errcode, res.body.errmsg)
    return false
  }
  return res.body;
}
// 发送模板消息
const sendTemplateMessage = async function ({
  openId,
  templateId,
  title,
  user,
  remark = ""
}) {
  try {
    console.log(openId, templateId)
    console.log(`${title}发送定时任务`)
    let time = dayjs(new Date()).format("YYYY年M月D日")
    const access_token = await getAccessToken();
    const postData = {
      touser: openId,
      template_id: templateId,
      page: "/pages/index/index",
      // miniprogram_state: "trial",
      lang: "zh_CN",
      data: {
        "thing1": {
          "value": title
        },
        "thing17": {
          "value": user
        },
        "date4": {
          "value": time
        },
        "phrase6": {
          "value": remark
        }
      }
    }
    let res = await request
      .post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`)
      .send(postData)
      .set('Accept', 'application/json')
    if(res.body.errcode !== 0){
      console.log(res.body.errcode, res.body.errmsg)
      return false
    }
    return true
  }catch(error){
    console.log(error)
    return false
  }
}

// 解密数据
const decryptData = function (sessionKey, encryptedData, iv) {
  // base64 decode
  try {
    sessionKey = new Buffer(sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')
     // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    
    decoded = JSON.parse(decoded)
    if (decoded.watermark.appid !== APPID) {
      return null;
    }
    return decoded
  } catch (err) {
    console.log(err)
    return null
  }
 
}
module.exports = {
  timeContinusData,
  getAccessToken,
  authSession,
  sendTemplateMessage,
  templateId,
  getQRCode,
  decryptData
}