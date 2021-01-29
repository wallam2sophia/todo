const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const { sendMsg } = require("../ws")

const commentApi = {
  // 新增评论
  addComment: async function (commentData) {
    try {
      // LOG.info(JSON.stringify(commentData))
      await sequelize.models.Comment.create(commentData);
      const taskInfo = await sequelize.models.Task.findByPk(commentData.taskId, { raw: true });
      const signInfo = await sequelize.models.Sign.findByPk(commentData.signId, { raw: true });
      // 发送ws消息
      let wsMsg = {
        signId: signInfo.id,
        taskId: taskInfo.id,
        taskTitle: `${taskInfo.title} / ${signInfo.signTime.split(" ")[0]}`,
        title: '打卡评论',
        sender: commentData.sender, 
        receiver: commentData.receiver || signInfo.signer, 
        message: `${commentData.content}`,
        type: 'comment',
        avatarUrl: commentData.avatar
      }
      await sendMsg(wsMsg)
      return {
        code: 100,
        data: "评论成功"
      };
    } catch (error) {
      console.log(error)
      // LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "评论失败"
      };
    }

  },
// 删除评论
deleteComment: async function (commentId) {
  try {
    await sequelize.models.Comment.destroy({ where: { id: commentId } });
    return {
      code: 100,
      data: '删除成功'
    };
  } catch (error) {
    console.log(error)
    return {
      code: 101,
      data: '删除失败'
    };
  }
},

  // 获取某个任务的评论
  listComment: async function (params) {
    try {
      let queryObj = {
        taskId: params.taskId
      }
      if (!!params.signId) {
        queryObj.signId = params.signId
      }
      const res = await sequelize.models.Comment.findAll({
        where: queryObj,
        order: [
          ['createTime', 'ASC'],
        ]
      });
      const comments = JSON.parse(JSON.stringify(res, null, 2));
      // LOG.info(JSON.stringify(comments))
      return {
        code: 100,
        data: comments
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
  commentApi
}