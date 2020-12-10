const dayjs = require("dayjs")

let time = dayjs(new Date().getTime())
console.log(time.format("YYYY-MM-DD HH:mm:ss"))
console.log(dayjs(new Date()).format("YYYY-MM-DD"))