const commonR =  require("./common")
const taskR =  require("./task")
const signR =  require("./sign")
const commentR =  require("./comment")
const likeR =  require("./like")
const statisticR =  require("./statistic")
const messageR =  require("./message")
const router = [commonR, taskR, signR, commentR, likeR, statisticR, messageR]

module.exports = router