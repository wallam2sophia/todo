const dayjs = require("dayjs")
const https = require("https");  
const iconv = require("iconv-lite");
const  APPID = "wx1bdebb28c99f1a74"
const SECRET = "a3b1eb4dc9a613c23b9dd8403a98d74b"

function timeContinusData(timeArr){
  let resultArr = []
  let curArr = []
  let maxC = 0;
  let lastC = 0;
  if(timeArr.length <= 1){
    return [timeArr]
  }
  for(let i = 0; i <= timeArr.length-2; i++){
    let cur = timeArr[i]
    let next = timeArr[i + 1]
    if(dayjs(next).diff(dayjs(cur), 'day') === 1){
      curArr.push(cur)
    }else {
      curArr.length > 0 && resultArr.push([...curArr, cur]);
      curArr = []
    }
  }
  curArr.length > 0 && resultArr.push([...curArr, timeArr[timeArr.length -1]]) && (lastC = [...curArr, timeArr[timeArr.length -1]].length);
  resultArr.forEach(item => {
    if(item.length > maxC){
      maxC = item.length
    }
  })
  return [resultArr, lastC, maxC]
}

// 用户认证
const authSession = function(code){
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`
  return new Promise((resolve, reject) =>{
    https.get(url, res=> {
      let datas = [];  
      let size = 0;  
      res.on('data', function (data) {  
          datas.push(data);  
          size += data.length;  
      });  
      res.on("end", function () {  
          var buff = Buffer.concat(datas, size);  
          var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
         resolve(result)
      })
    })
  })
}

// 获取AccessToken
const getAccessToken = async function(){
  return new Promise((resolve, reject) =>{
    let url = `https://api.weixin.qq.com/cgi-bin/token?appid=${APPID}&secret=${SECRET}&grant_type=client_credential`
    https.get(url, res=> {
      let datas = [];  
      let size = 0;  
      res.on('data', function (data) {  
          datas.push(data);  
          size += data.length;  
      });  
      res.on("end", function () {  
          var buff = Buffer.concat(datas, size);  
          var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
         resolve(JSON.parse(result))
      })
    })
  })
}
// 发送模板消息
const sendTemplateMessage = async function(openid, template_id){
  return new Promise(async (resolve, reject) =>{
    const { access_token } = await getAccessToken();
    let url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}&touser=${openid}&template_id=${template_id}`
    const options = {
      path: '/cgi-bin/message/subscribe/send?access_token=' + access_token,
      method: 'POST',
      hostname: 'api.weixin.qq.com',
    };
    const postData = {
      touser: openid,
      template_id: template_id,
      data: {
        "thing1": {
          "value": "跳绳吧"
        },
        "thing17": {
          "value": "多喝水"
        },
        "date4": {
          "value": "2021年1月5日"
        },
        "thing17": {
          "phrase6": "未打卡"
        }
      }
    }
    const req = https.request(options, (res) => {
      let datas = [];  
      let size = 0;  
      res.on('data', function (data) {  
          datas.push(data);  
          size += data.length;  
      });  
      res.on("end", function () {  
          var buff = Buffer.concat(datas, size);  
          var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
          console.log('result', result);
         resolve(result)
      })
    });
    
    req.on('error', (e) => {
      reject(e)
    });
    
    // 将数据写入请求主体。
    req.write(JSON.stringify(postData));
    req.end();
  })
}
module.exports = { timeContinusData, getAccessToken, authSession, sendTemplateMessage }