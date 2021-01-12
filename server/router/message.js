const express = require('express')
const router = express.Router()
const { messageApi } = require("../src/message");

// 新增消息
router.post("/add/message", async(req, res) => {
  try {
    const data = req.body;
    const result = await messageApi.addMessage(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 查询消息
router.post("/list/message", async(req, res) => {
  try {
    const data = req.body;
    const result = await messageApi.listMessage(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

module.exports = router;