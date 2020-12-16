const dayjs = require("dayjs")

const  { timeContinusData } = require("./util")
let time = dayjs(new Date().getTime())
let cArr = [0,2,3,5,6,7,8,10,11,13,14,15]
console.log(timeContinusData(cArr))