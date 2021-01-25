const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const { signApi } = require("./sign");
const dayjs = require("dayjs")
const path = require("path")
const fs = require('fs')
const schedule = require('node-schedule');
const formdata = require('formidable');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
const { templateId, sendTemplateMessage } = require("../utils/util")
const scheduleTask = new Map();
const taskApi = {
  taskBg: function () {
    try {
      let imgpath = path.resolve(__dirname, '../static/imgs/default_task_bg');
      let files = fs.readdirSync(imgpath).filter(item => /\.jpg$|\.png$|\.jpeg$/.test(item))
      let randomIndex = Math.floor((Math.random() * files.length))
      let randomBg = files[randomIndex]
      return {
        code: 100,
        data: `imgs/default_task_bg/${randomBg}`
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: '查询失败'
      };
    }
  },
  changeTaskBg: function (req, res) {
    const form = new formdata.IncomingForm();
    form.uploadDir = path.resolve(__dirname, "../static/imgs/upload_img");//指定保存文件的路径，formidable会自动保存文件
    form.keepExtensions = true;//保存扩展名
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }
      console.log(files.file.path.split("static\\")[1])
      res.status(200);
      res.send({
        code: 100,
        data: files.file.path.split("static\\")[1].replace(/\\/g, '/')
      });
    })
  },
  // 新增任务
  addTask: async function (taskData) {
    try {
      // LOG.info(JSON.stringify(taskData))
      taskData.status = checkTaskStatus(taskData.beginTime, taskData.endTime)
      const taskInfo = await sequelize.models.Task.upsert(taskData, {
        where: { id: taskData.id },
        raw: true
      });
      let p = []
      if(taskData.remindTime){
        let minute = taskData.remindTime.split(":")[1].replace(/^0/g,"")
        let hour = taskData.remindTime.split(":")[0].replace(/^0/g,"")
        let reminPattern = `0 ${minute} ${hour} * * *`
        let members = taskData.members
        members.forEach(member => {
          p.push(this.addTaskSchedule(member, taskInfo[0], reminPattern))
        })
      }
      await Promise.all(p)
      return {
        code: 100,
        data: "创建打卡成功"
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: "创建打卡失败"
      };
    }
  },
  // 创建一个定时提醒任务
  addTaskSchedule: async function(member, taskData, reminPattern){
    console.log('添加定时任务')
    const user = await sequelize.models.User.findOne({
      where: {
        nickName: member
      },
      raw: true
    })
   
    let paramsData = {
      openId: user.openId, 
      templateId: templateId, 
      title: taskData.title, 
      user: taskData.creator, 
      remark: '未打卡'
    }
    console.log('reminPattern', reminPattern)
    let job = schedule.scheduleJob({start: taskData.beginTime, end: taskData.endTime, rule: reminPattern}, function (params){
      return function(){
        return sendTemplateMessage(params)
      }
    }(paramsData))
    let scheduleData = {
      taskId: taskData.id,
      desc: `${taskData.title}-${member}-打卡提醒`,
      reminPattern: reminPattern,
      action: 'sendTemplateMessage',
      params: paramsData,
      beginTime: taskData.beginTime,
      endTime: taskData.endTime,
      status: 1,
    }
    console.log(scheduleData)
    const sch = await sequelize.models.Schedule.create(scheduleData, {raw: true});
    let jobs = !!scheduleTask.get(sch.taskId) ? [...scheduleTask.get(sch.taskId), job] : [job]
    scheduleTask.set(sch.taskId, jobs)
    return true;
  },
  // 修改任务
  editTask: async function (taskData) {
    try {
      // LOG.info(JSON.stringify(taskData))
      await sequelize.models.Task.update(taskData, { where: { id: taskData.id } });
      return {
        code: 100,
        data: '修改成功'
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: '修改失败'
      };
    }
  },
  // 添加成员
  addMember: async function (taskData) {
    try {
      // LOG.info(JSON.stringify(taskData))
      const taskInfo = await sequelize.models.Task.update({ members: taskData.members }, { where: { id: taskData.id }, raw: true });
      console.log(taskInfo)
      // 向管理员发送ws消息
      let wsMsg = {
        taskId: taskInfo.id,
        taskTitle: taskInfo.title,
        title: '新成员加入',
        sender: taskData.member, 
        receiver: taskInfo.creator, 
        message: `新成员【${taskData.member}】加入【${taskInfo.title}】打卡任务!`,
        type: 'member',
        avatarUrl: taskData.avatarUrl
      }
      await sendMsg(wsMsg)
      // 向申请者发送ws消息
      let wsMsg = {
        title: '加入打卡任务',
        sender: taskInfo.creator, 
        receiver: taskData.member, 
        message: `你已成功加入【${taskInfo.title}】打卡任务!`,
        type: 'task',
        avatarUrl: taskInfo.creatorAvatar
      }
      await sendMsg(wsMsg)
      return {
        code: 100,
        data: '添加成员成功'
      };
    } catch (error) {
      console.log(error)
      return {
        code: 101,
        data: '添加成员失败'
      };
    }
  },
  // 删除任务
  deleteTask: async function (taskId) {
    try {
      // 删除该任务的打卡记录
      await sequelize.models.Sign.destroy({ where: { taskId: taskId } });
      // 删除该任务的点赞记录
      await sequelize.models.Like.destroy({ where: { taskId: taskId } });
      // 删除该任务的评论记录
      await sequelize.models.Comment.destroy({ where: { taskId: taskId } });
      // 删除该任务的定时任务记录
      // 停止定时任务
      // console.log('scheduleTask', scheduleTask)
      !!scheduleTask.get(taskId) && (scheduleTask.get(taskId).forEach(item=> item.cancel()))
      await sequelize.models.Schedule.destroy({ where: { taskId: taskId } });
      // 删除该任务的消息记录
      await sequelize.models.Message.destroy({ where: { taskId: taskId } });
      // 删除任务
      await sequelize.models.Task.destroy({ where: { id: taskId } });
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
  listTask: async function (params) {
    try {
      let queryObj = {
        members: {
          [Op.substring]: params.user,
        }
      }
      params.status !== 'all' && (queryObj = { ...queryObj, status: params.status })
      if(params.title){
        queryObj.title = {
          [Op.substring]: params.title,
        }
      }
      const { count, rows} = await sequelize.models.Task.findAndCountAll({
        where: queryObj,
        order: [
          // 按照updateTime字段进行降序排列
          ['updateTime', 'DESC']],
        offset: Number(params.size) * (Number(params.page) - 1), 
        limit: Number(params.size),
        raw: true
      });
      let signDate = dayjs(new Date()).format("YYYY-MM-DD")
      // 计算是否今天卡卡
      const result = rows.map(async (item) => {
        const isSigned = await signApi.checkIsSigned(item.id, params.user, signDate);
        if (isSigned > 0) {
          return { ...item, isSigned: true }
        } else {
          return { ...item, isSigned: false }
        }
      })
      const data = await Promise.all(result)
      return {
        code: 100,
        data: {
          count: count, 
          list: data
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
  detailTask: async function (taskId, user) {
    try {
      const res = await sequelize.models.Task.findByPk(taskId);
      let taskData = JSON.parse(JSON.stringify(res, null, 2));
      let beginDate = dayjs(taskData.beginTime)
      let endDate = dayjs(taskData.endTime)
      let today = dayjs(new Date()).format("YYYY-MM-DD");
      let totalDays = endDate.diff(beginDate, 'day') + 1;
      let finishDays;
      if(taskData.status === 'todo'){
        finishDays = 0
      }else if(taskData.status === 'doing'){
        finishDays = dayjs(today).diff(beginDate, 'day') + 1;
      }else {
        finishDays = totalDays
      }
      const isSigned = await signApi.checkIsSigned(taskId, user, today);
      let result = { ...taskData, totalDays, finishDays, isSigned };
      // LOG.info(JSON.stringify(result))
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
}
// 内部使用方法
const checkTaskStatus = function (beginTime, endTime) {
  let today = dayjs(dayjs(new Date()).format("YYYY-MM-DD"));
  let beginDate = dayjs(beginTime);
  let endDate = dayjs(endTime);
  if (today.isBefore(beginDate)) {
    return 'todo'
  } else if (today.isSameOrAfter(beginDate) && today.isSameOrBefore(endDate)) {
    return 'doing'
  } else if (today.isAfter(endDate)) {
    return 'done'
  }
  return 'todo'
}
module.exports = {
  taskApi,
  checkTaskStatus
}