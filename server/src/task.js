const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const { signApi } = require("./sign");
const dayjs = require("dayjs")
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter)
// 新增任务
const taskApi = {
  addTask: async function (taskData) {
    try {
      let today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"));
      let beginDate = dayjs(taskData.beginTime);
      let endDate = dayjs(taskData.endTime);
      today.isBefore(beginDate) && (taskData.status = 'todo');
      today.isSameOrAfter(beginDate) && today.isBefore(endDate) && (taskData.status = 'doing');
      today.isAfter(endDate) && (taskData.status = 'done');
      await sequelize.models.Task.create(taskData);
      return '添加成功';
    }catch(error){
      console.log(error)
      return error;
    }
  },

  // 修改任务
  editTask: async function (taskData) {
    try {
      await sequelize.models.Task.update(taskData,{where: {id: taskData.id}});
      return '添加成功';
    }catch(error){
      console.log(error)
      return error;
    }
    
  },
  listTask: async function (params){
    try {
      let queryObj = {
        members:{
          [Op.substring]: params.user,                         
        }
      }
      params.status !== 'all' && (queryObj= {...queryObj, status:  params.status})
      const res = await sequelize.models.Task.findAll({
        where: queryObj,
        order: [
          // 按照updateTime字段进行降序排列
          ['updateTime', 'DESC']]
      });
      const tasks = JSON.parse(JSON.stringify(res, null, 2));
      let signDate = dayjs(new Date()).format("YYYY-MM-DD")
      // 计算是否今天卡卡
      const result =  tasks.map(async(item) => {
        const isSigned = await signApi.checkIsSigned(item.id, params.user, signDate);
        if(isSigned > 0){
          return {...item, isSigned:true}
        }else {
          return {...item, isSigned:false}
        }
      })
      const data = await Promise.all(result)
      return data;
    }catch(error){
      console.log(error)
      return error;
    }
  },
  detailTask: async function(taskId){
    try {
      const res = await sequelize.models.Task.findByPk(taskId);
      let taskData = JSON.parse(JSON.stringify(res, null, 2));
      let beginDate = dayjs(taskData.beginTime)
      let endDate = dayjs(taskData.endTime)
      let today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"));
      let totalDays = endDate.diff(beginDate, 'day');
      let finishDays = today.diff(beginDate, 'day');
      return {...taskData, totalDays: totalDays, finishDays: finishDays};
    }catch(error){
      console.log(error)
      return error;
    }
  }
}

module.exports = {
  taskApi
}