const express = require('express')
const router = express.Router()
const { commonApi } = require("../src/common");
// 登录
router.post("/login", async(req, res) => {
  try {
    const data = req.body;
    const result = await commonApi.login(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 发送模板消息
router.post("/send/msg", async(req, res) => {
  try {
    const data = req.body;
    const result = await commonApi.sendMsg(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 测试定时任务
router.post("/test/schedule", async(req, res) => {
  try {
    const { rule } = req.body;
    const result = await commonApi.testSchedule(rule);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
module.exports = router;