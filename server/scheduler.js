const schedule = require('node-schedule');
const { sequelize } = require("./sql")
const { Op } = require("sequelize");
const { checkTaskStatus } = require("./src/task")
const { templateId, sendTemplateMessage } = require("./utils/util")
function scheduleCronstyle(){
  // 6个占位符从左到右分别代表：秒、分、时、日、月、周几
  schedule.scheduleJob('0 0 0 * * *', updateStatus); 
}
async function updateStatus(){
  console.log("updateStatus")
  const res = await sequelize.models.Task.findAll({
    where: {
      status:{
        [Op.ne]: 'done',  
      }
    }
  });
  const tasks = JSON.parse(JSON.stringify(res, null, 2));
  tasks.forEach(item=>{
    let status = checkTaskStatus(item.beginTime, item.endTime);
    sequelize.models.Task.update({...item, status}, {where: {id: item.id}});
  })
}
function sendMsg(paramsData){
  return function(){
    return sendTemplateMessage(paramsData)
  }
}
function setSchedule(){
  let paramsData = {
    openid: "oTkOq5dqK4rWNgUz8k4up1d1FUuA", 
    template_id: "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM", 
    title: "定时通知1", 
    user: "多喝水", 
    time: '2021年1月8日', 
    remark: '未打卡'
  }
  let reminPattern = "0 12 12 * * *"
  let job = schedule.scheduleJob(reminPattern, sendMsg(paramsData))
}
// setSchedule()
scheduleCronstyle();