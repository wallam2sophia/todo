const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const https = require("https");  
const iconv = require("iconv-lite");
const { authSession, sendTemplateMessage} = require("../utils/util")
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
      const res = await sequelize.models.User.upsert(userData, {
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
  async sendMsg(data){
    try {
      const user = await sequelize.models.User.findOne({
        where: {
          nickName: data.nickName
        },
        raw: true
      })
      const res = await sendTemplateMessage(user.openId, data.template_id)
      console.log('res', res)
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
}


module.exports = {
  commonApi
}