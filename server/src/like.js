const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")

const likeApi = {
  // 新增点赞
  addLike: async function (likeData) {
    try {
      LOG.info(JSON.stringify(likeData))
      await sequelize.models.Like.create(likeData);
      return {
        code: 100,
        data: "点赞成功"
      };
    } catch (error) {
      console.log(error)
      LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "点赞失败"
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
      LOG.info(JSON.stringify(likes))
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
  likeApi
}