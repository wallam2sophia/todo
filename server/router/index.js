const express = require('express')
const router = express.Router()
const { taskApi } = require("../src/task");
const { signApi } = require("../src/sign");
const { commentApi } = require("../src/comment");
const { likeApi } = require("../src/like");
const { statisticApi } = require("../src/statistic");
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
// 删除点赞
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

// 我的任务和打卡信息
router.post("/my/general", async(req, res) => {
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