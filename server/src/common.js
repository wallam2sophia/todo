const {
  sequelize
} = require("../sql")
const schedule = require('node-schedule');
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const https = require("https");  
const iconv = require("iconv-lite");
const { authSession, sendTemplateMessage} = require("../utils/util")
const templateId = "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM"
const commonApi = {
  // 登录
  login: async function (data) {
    try {
      // LOG.info(JSON.stringify(likeData))
      let session = JSON.parse(await authSession(data.code))
      let userData = {
        nickName: data.nickName,
        avatarUrl: data.avatarUrl,
        openId: session.openid,
        sessionKey: session.session_key,
        status: 1
      }
      await sequelize.models.User.upsert(userData, {
        where: { nickName: data.nickName },
      });
      return {
        code: 100,
        data: "登录成功"
      };
    } catch (error) {
      console.log(error)
      // LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "登录失败"
      };
    }
  },
  sendMsg: async function(data){
    try {
      const user = await sequelize.models.User.findOne({
        where: {
          nickName: data.nickName
        },
        raw: true
      })
      let sendData = {
        openId: user.openId, 
        templateId: templateId, 
        title: "测试发送消息", 
        user: "多喝水", 
        remark: '未打卡'
      }
      const res = await sendTemplateMessage(sendData)
      if(res.errcode !== 0){
        console.log(res.errmsg)
        return {
          code: 101,
          data: "发送失败"
        };
      }
      return {
        code: 100,
        data: "发送成功"
      };
    }catch(error){
      console.log(error)
      return {
        code: 101,
        data: "发送失败"
      };
    }
    
  },
  testSchedule: async function(rule){
    try {
      console.log(":shezhi ")
      let paramsData = {
        openId: "oTkOq5dqK4rWNgUz8k4up1d1FUuA", 
        templateId: "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM", 
        title: "测试定时任务", 
        user: "多喝水", 
        remark: '啦啦啦啦啦'
      }
      let job = schedule.scheduleJob('30 * * * * *', function (params){
        return function(){
          console.log('test schedule task 2222')
          return sendTemplateMessage(params)
        }
      }(paramsData))
      return {
        code: 100,
        data: "设置成功"
      }
    }catch(error){
      console.log(error)
      return {
        code: 101,
        data: "设置失败"
      }
    }
    
  }
}


function test(){
  console.log('test schedule task')
}


module.exports = {
  commonApi
}