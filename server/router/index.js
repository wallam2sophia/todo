const commonR =  require("./common")
const taskR =  require("./task")
const signR =  require("./sign")
const commentR =  require("./comment")
const likeR =  require("./like")
const statisticR =  require("./statistic")

const router = [commonR, taskR, signR, commentR, likeR, statisticR]

module.exports = router