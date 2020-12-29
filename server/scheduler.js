const schedule = require('node-schedule');
const { sequelize } = require("./sql")
const { Op } = require("sequelize");
const { checkTaskStatus } = require("./src/task")
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

scheduleCronstyle();