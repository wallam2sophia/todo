const schedule = require('node-schedule');
const { sequelize } = require("./sql")
const { checkTaskStatus } = require("./src/task")
function scheduleCronstyle(){
  schedule.scheduleJob('0 0 0 * * *', updateStatus); 
}
async function updateStatus(){
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