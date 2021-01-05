const express = require('express')
const router = express.Router()
const { signApi } = require("../src/sign");
// 新增打卡
router.post("/add/sign", async (req, res) => {
  try {
    const data = req.body;
    const result = await signApi.addSign(data);
    res.status(200);
    res.send(result);
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
    res.send(result);
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
    res.send(result);
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
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

module.exports = router;