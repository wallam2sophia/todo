const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")
const  { timeContinusData } = require("../utils/util")
// 新增打卡
const signApi = {
  addSign: async function (signData) {
    try {
      let signDate = dayjs(new Date()).format("YYYY-MM-DD");
      const isSigned = await this.checkIsSigned(signData.taskId, signData.signer, signDate);
      if(isSigned){
        return '你今天已完成打卡!'
      }
      signData.signTime = dayjs(signData.signTime).format("YYYY-MM-DD HH:mm:ss");
      await sequelize.models.Sign.create(signData);
      return '打卡成功';
    }catch(error){
      console.log(error)
      return error;
    }
    
  },
  // 检查某人某天某任务是否完成打卡
  checkIsSigned: async function(taskId, signer, signDate){
    const signList = await sequelize.models.Sign.findAll({
      where: {
        taskId: taskId,
        signer: signer,
        signTime: {
          [Op.startsWith]: signDate, 
        }
      }
    });
    if(signList.length > 0){
      return true;
    }else {
      return false;
    }
  },

  // 获取打卡日志
  listSign: async function (params){
    try {
      let queryObj = {
        taskId:params.taskId
      }
      if(!!params.member){
        queryObj.signer = params.member
      }
      const res = await sequelize.models.Sign.findAll({
        where: queryObj,
        order: [
          ['createTime', 'DESC'],
        ]
      });
      const signs = JSON.parse(JSON.stringify(res, null, 2));
      return signs;
    }catch(error){
      console.log(error)
      return error;
    }
  },

  // 统计个人打卡信息
  statisticSign: async function (params){
    try {
      const data = await this.taskSignRank(params.taskId)
      console.log(data)
      const statistic = await this.memberSignRank(params.taskId, params.member)
      return {...statistic, rankNumber: data.findIndex(item=>item.signer===params.member) + 1};
    }catch(error){
      console.log(error)
      return error;
    }
  },

  // 统计指定成员指定任务的打卡信息
  memberSignRank:  async function (taskId, signer){
    try {
      let queryObj = {
        taskId: taskId,
        signer: signer
      }
      const res = await sequelize.models.Sign.findAll({
        where: queryObj,
        order: [
          ['createTime', 'ASC'],
        ]
      });
      const signs = JSON.parse(JSON.stringify(res, null, 2));
      const signTimeArr = signs.map(item=>item.signTime.split(" ")[0])
      const [contArr, lastC, maxC] = timeContinusData(signTimeArr)
      let signData = {
        signCounts: signs.length,
        continuousCounts: lastC,
        maxContinuous: maxC
      }
      return signData;
    }catch(error){
      console.log(error)
      return error;
    }
  },

  // 统计指定任务的打卡排名
  taskSignRank:  async function (taskId){
    try {
      let queryObj = {
        taskId: taskId
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
      return signs;
    }catch(error){
      console.log(error)
      return error;
    }
  }
}






module.exports = {
  signApi
}