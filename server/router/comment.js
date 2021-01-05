const express = require('express')
const router = express.Router()
const { commentApi } = require("../src/comment");

// 新增评论
router.post("/add/comment", async(req, res) => {
  try {
    const data = req.body;
    const result = await commentApi.addComment(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 删除评论
router.get("/delete/comment/:commentId", async(req, res) => {
  try {
    const { commentId } = req.params;
    const result = await commentApi.deleteComment(commentId);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 查询评论
router.post("/list/comment", async(req, res) => {
  try {
    const data = req.body;
    const result = await commentApi.listComment(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

module.exports = router;