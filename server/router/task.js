const express = require('express')
const router = express.Router()
const { taskApi } = require("../src/task");

// 新增任务
router.post("/add/task", async (req, res) => {
  try {
    const result = await taskApi.addTask(req.body);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 修改任务
router.post("/edit/task", async (req, res) => {
  try {
    const result = await taskApi.editTask(req.body);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }

})
// 新增成员
router.post("/add/member", async (req, res) => {
  try {
    const result = await taskApi.addMember(req.body);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 删除任务
router.get("/delete/task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await taskApi.deleteTask(taskId);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }

})
// 查询任务列表
router.post("/list/task", async (req, res) => {
  try {
    const result = await taskApi.listTask(req.body);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }

})

// 获取指定任务详情
router.get("/detail/task/:user/:taskId", async (req, res) => {
  try {
    const { user, taskId } = req.params;
    const result = await taskApi.detailTask(taskId, user);
    res.status(200);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({msg: error});
  }

})

// 随机获取一张背景图
router.get("/task/bgimg", (req, res) => {
  try {
    const result = taskApi.taskBg();
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 修改背景图
router.post("/change/taskbg", (req, res) => {
  try {
    console.log(req.body)
    taskApi.changeTaskBg(req, res);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

module.exports = router;