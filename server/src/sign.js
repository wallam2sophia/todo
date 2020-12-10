const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const dayjs = require("dayjs")
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
  listSign: async function (taskId){
    try {
      const res = await sequelize.models.Sign.findAll({
        where: {
          taskId:taskId
        }
      });
      const signs = JSON.parse(JSON.stringify(res, null, 2));
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