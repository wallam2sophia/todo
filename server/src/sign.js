const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const { timeContinusData } = require("../utils/util")
const { sendMsg } = require("../ws")
// 新增打卡
const signApi = {
  addSign: async function (signData) {
    try {
      // LOG.info(JSON.stringify(signData))
      let signDate = dayjs(signData.signTime).format("YYYY-MM-DD");
      const isSigned = await this.checkIsSigned(signData.taskId, signData.signer, signDate);
      if (isSigned) {
        return {
          code: 101,
          data: '你今天已完成打卡!'
        };
      }
      
      const taskData = await sequelize.models.Task.findByPk(signData.taskId, { raw: true });
      let beginDate = dayjs(taskData.beginTime)
      let endDate = dayjs(taskData.endTime)
      let today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"))
      if(dayjs(signDate).isBefore(beginDate)){
        return {
          code: 101,
          data: '打卡任务还未开始!'
        };
      }
      if(dayjs(signDate).isAfter(endDate)){
        return {
          code: 101,
          data: '打卡任务已结束!'
        };
      }
      if(dayjs(signDate).isBefore(today)){
        signData.signTime = dayjs(signData.signTime).format("YYYY-MM-DD HH:mm:ss");
        const signInfo = await sequelize.models.Sign.create({ ...signData, status: 0});
        let wsMsg = {
          taskId: taskData.id,
          signId: signInfo.id,
          taskTitle: taskData.title,
          title: '补卡申请',
          sender: signInfo.signer, 
          receiver: taskData.creator, 
          message: `${signInfo.signer}申请补卡,补卡时间：${signInfo.signTime}!`,
          type: 'apply',
          avatarUrl: signInfo.avatarUrl
        }
        await sendMsg(wsMsg)
        return {
          code: 100,
          data: '补卡申请已发起,等待管理员审批!'
        };
      }
      signData.signTime = dayjs(signData.signTime).format("YYYY-MM-DD HH:mm:ss");
      const signInfo = await sequelize.models.Sign.create({ ...signData, status: 1});
      // 发送ws消息
      let wsMsg = {
        taskId: taskData.id,
        taskTitle: taskData.title,
        title: '打卡',
        sender: signInfo.signer, 
        receiver: signInfo.signer, 
        message: `【${taskData.title}】今日打卡完成!`,
        type: 'sign',
        avatarUrl: signInfo.avatarUrl
      }
      await sendMsg(wsMsg)
      return {
        code: 100,
        data: "打卡成功"
      };
    } catch (error) {
      console.log(error)
      // LOG.error(JSON.stringify(error))
      return {
        code: 101,
        data: "打卡失败"
      };
    }
  },
  // 修改打卡
  editSign: async function (signData) {
    try {
      // LOG.info(JSON.stringify(taskData))
      await sequelize.models.Sign.update(signData, { where: { id: signData.id } });
      return {
        code: 100,
        data: '更新打卡成功'
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: '更新打卡失败'
      };
    }
  },
    // 审批打卡
    approveSign: async function (data) {
      try {
        // LOG.info(JSON.stringify(taskData))
        let { msgId, signId, status } = data
        console.log( msgId, signId, status )
        const signInfo = await sequelize.models.Sign.upsert({ status }, {
          where: { id: signId },
        });
        const msgInfo = await sequelize.models.Message.upsert({ status: 1 }, {
          where: { id: msgId },
        });
        
        const taskInfo =  await sequelize.models.Task.findByPk(msgInfo.taskId);
        // 发送ws消息
        let wsMsg = {
          taskId: taskInfo.id,
          taskTitle: taskInfo.title,
          title: '补卡申请',
          sender: taskInfo.creator, 
          receiver: msgInfo.sender, 
          message: `你的补卡申请被${status === 1 ? '通过' : '拒绝'}，补卡时间：${signInfo.signTime}!`,
          type: 'sign',
          avatarUrl: taskInfo.creatorAvatar
        }
        await sendMsg(wsMsg)
        return {
          code: 100,
          data: '审批成功'
        };
      } catch (error) {
        console.log(error)
        return {
          code: 101,
          data: '审批失败'
        };
      }
    },
  // 检查某人某天某任务是否完成打卡
  checkIsSigned: async function (taskId, signer, signDate) {
    const signList = await sequelize.models.Sign.findAll({
      where: {
        taskId: taskId,
        signer: signer,
        status: 1,
        signTime: {
          [Op.startsWith]: signDate,
        }
      }
    });
    if (signList.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  // 获取打卡日志
  listSign: async function (params) {
    try {
      let queryObj = {
        taskId: params.taskId,
        status: 1
      }
      if (!!params.member) {
        queryObj.signer = params.member
      }
      if (!!params.signDate) {
        queryObj.signTime = {
          [Op.startsWith]: params.signDate,
        }
      }
      const { count, rows} = await sequelize.models.Sign.findAndCountAll({
        where: queryObj,
        order: [
          ['signTime', 'DESC'],
        ],
        offset: Number(params.size) * (Number(params.page) - 1), 
        limit: Number(params.size),
        raw: true
      });
      // LOG.info(JSON.stringify(signs))
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

  // 统计个人打卡信息
  statisticSign: async function (params) {
    try {
      const taskRank = await this.taskSignRank(params.taskId)
      if (taskRank.code !== 100) {
        return {
          code: 101,
          data: "查询失败"
        };
      }
      const statistic = await this.memberSignRank(params.taskId, params.member)
      let result = { ...statistic, rankNumber: taskRank.data.findIndex(item => item.signer === params.member) + 1 };
      return {
        code: 100,
        data: result
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: "查询失败"
      };
    }
  },

  // 统计指定成员指定任务的打卡信息
  memberSignRank: async function (taskId, signer) {
    try {
      let queryObj = {
        taskId: taskId,
        signer: signer,
        status: 1,
      }
      const signs = await sequelize.models.Sign.findAll({
        where: queryObj,
        order: [
          ['createTime', 'ASC'],
        ],
        raw: true,
      });
      const signTimeArr = signs.map(item => item.signTime.split(" ")[0])
      const [contArr, lastC, maxC] = timeContinusData(signTimeArr)
      let signData = {
        signCounts: signs.length,
        continuousCounts: lastC,
        maxContinuous: maxC,
        signs: signs
      }
      return signData
    } catch (error) {
      console.log(error)
      return error;
    }
  },

  // 统计指定任务的打卡排名
  taskSignRank: async function (taskId) {
    try {
      let queryObj = {
        taskId: taskId,
        status: 1
      }
      const res = await sequelize.models.Sign.findAll({
        where: queryObj,
        attributes: [
          'signer',
          'avatarUrl',
          [sequelize.fn('COUNT', sequelize.col('signer')), 'sign_count'],
        ],
        group: 'signer'
      });
      const signs = JSON.parse(JSON.stringify(res, null, 2));
      console.log(signs)
      return {
        code: 100,
        data: signs
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: "查询失败"
      };
    }
  }
}






module.exports = {
  signApi
}