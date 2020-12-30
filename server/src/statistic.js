const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")

const statisticApi = {
  // 我的任务和打卡信息
  myGeneral: async function (user) {
    try {
      // LOG.info(JSON.stringify(likeData))
      const tasks = await sequelize.models.Task.count({
        where: {
          members: {
            [Op.substring]: user,
          }
        }
      });
      const signs = await sequelize.models.Sign.count({
        where: {
          signer: user
        }
      });
      return {
        code: 100,
        data: {
          tasks,
          signs
        }
      };
    } catch (error) {
      console.log(error)
      // LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "查询失败"
      };
    }

  },

// 删除点赞
deleteLike: async function (likeId) {
  try {
    await sequelize.models.Like.destroy({ where: { id: likeId } });
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
  listLike: async function (params) {
    try {
      let queryObj = {
        taskId: params.taskId
      }
      if (!!params.signId) {
        queryObj.signId = params.signId
      }
      const res = await sequelize.models.Like.findAll({
        where: queryObj,
        order: [
          ['createTime', 'DESC'],
        ]
      });
      const likes = JSON.parse(JSON.stringify(res, null, 2));
      // LOG.info(JSON.stringify(likes))
      return {
        code: 100,
        data: likes
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
  statisticApi
}