const express = require('express')
const router = express.Router()
const { taskApi } = require("../src/task");
const { signApi } = require("../src/sign");

// 新增任务
router.post("/add/task", async (req, res) => {
  try {
    const result = await taskApi.addTask(req.body);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send(error);
  }
})
// 修改任务
router.post("/edit/task", async (req, res) => {
  try {
    const result = await taskApi.editTask(req.body);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send(error);
  }

})

// 查询任务列表
router.post("/list/task", async (req, res) => {
  try {
    const result = await taskApi.listTask(req.body);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send({error});
  }

})

// 获取指定任务详情
router.get("/detail/task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await taskApi.detailTask(taskId);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({error});
  }

})

// 新增打卡
router.post("/add/sign", async (req, res) => {
  try {
    const data = req.body;
    const result = await signApi.addSign(data);
    res.status(200);
    res.send({
      code: 100,
      msg: result
    });
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 获取打卡日志
router.post("/list/sign", async (req, res) => {
  try {
    const result = await signApi.listSign(req.body);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 获取成员打卡统计
router.post("/statistic/sign", async (req, res) => {
  try {
    const result = await signApi.statisticSign(req.body);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 获取任务打卡统计
router.post("/statistic/task", async (req, res) => {
  try {
    const result = await signApi.taskSignRank(req.body.taskId);
    res.status(200);
    res.send({
      code: 100,
      data: result
    });
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
module.exports = router;