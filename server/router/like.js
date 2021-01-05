const express = require('express')
const router = express.Router()
const { likeApi } = require("../src/like");

// 新增点赞
router.post("/add/like", async(req, res) => {
  try {
    const data = req.body;
    const result = await likeApi.addLike(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})
// 删除点赞
router.get("/delete/like/:likeId", async(req, res) => {
  try {
    const { likeId } = req.params;
    const result = await likeApi.deleteLike(likeId);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

// 查询点赞
router.post("/list/like", async(req, res) => {
  try {
    const data = req.body;
    const result = await likeApi.listLike(data);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({msg: error});
  }
})

module.exports = router;