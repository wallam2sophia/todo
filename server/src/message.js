const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")

const messageApi = {
  // 新增消息
  addMessage: async function (msgData) {
    try {
      // LOG.info(JSON.stringify(commentData))
      await sequelize.models.Message.create(msgData);
      return {
        code: 100,
        data: "新增消息成功"
      };
    } catch (error) {
      console.log(error)
      // LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "新增消息失败"
      };
    }

  },

  // 获取某人的消息列表
  listMessage: async function (params) {
    try {
      let queryObj = {
        receiver: params.nickName
      }
      const { count, rows} = await sequelize.models.Message.findAndCountAll({
        where: queryObj,
        order: [
          ['createTime', 'DESC'],
        ],
        offset: Number(params.size) * (Number(params.page) - 1), 
        limit: Number(params.size),
        raw: true
      });
      // LOG.info(JSON.stringify(comments))
      return {
        code: 100,
        data:  {
          count: count, 
          list: rows
        }
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: "查询失败"
      };
    }
  },
}


module.exports = {
  messageApi
}