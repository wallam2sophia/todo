const express = require('express')
const router = express.Router()
const { statisticApi } = require("../src/statistic");
// 我的任务和打卡信息
router.post("/statistic/general", async(req, res) => {
  try {
    const { user } = req.body;
    const result = await statisticApi.myGeneral(user);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({ msg: error });
  }
})

module.exports = router;