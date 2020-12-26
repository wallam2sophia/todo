const {
  sequelize
} = require("../sql")
const { Op } = require("sequelize");
const { signApi } = require("./sign");
const dayjs = require("dayjs")
const path = require("path")
const fs = require('fs')
const formdata = require('formidable');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter)

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
      LOG.info(JSON.stringify(taskData))
      taskData.status = checkTaskStatus(taskData.beginTime, taskData.endTime)
      await sequelize.models.Task.create(taskData);
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

  // 修改任务
  editTask: async function (taskData) {
    try {
      LOG.info(JSON.stringify(taskData))
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
  listTask: async function (params) {
    try {
      let queryObj = {
        members: {
          [Op.substring]: params.user,
        }
      }
      params.status !== 'all' && (queryObj = { ...queryObj, status: params.status })
      const res = await sequelize.models.Task.findAll({
        where: queryObj,
        order: [
          // 按照updateTime字段进行降序排列
          ['updateTime', 'DESC']]
      });
      const tasks = JSON.parse(JSON.stringify(res, null, 2));
      let signDate = dayjs(new Date()).format("YYYY-MM-DD")
      // 计算是否今天卡卡
      const result = tasks.map(async (item) => {
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
        data: data
      };
    } catch (error) {
      console.log(error)
      LOG.error(JSON.stringify(error))
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
      let finishDays = dayjs(today).diff(beginDate, 'day') + 1;
      const isSigned = await signApi.checkIsSigned(taskId, user, today);
      let result = { ...taskData, totalDays, finishDays, isSigned };
      LOG.info(JSON.stringify(result))
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
  } else if (today.isSameOrAfter(beginDate) && today.isBefore(endDate)) {
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