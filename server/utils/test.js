const dayjs = require("dayjs")
const path = require("path")
const fs = require('fs')

let imgpath = path.resolve(__dirname, '../static/imgs/default_task_bg');
console.log(imgpath)
let files = fs.readdirSync(imgpath).filter(item=>/\.jpg$|\.png$|\.jpeg$/.test(item))
console.log(files)
let randomIndex = Math.floor((Math.random()*files.length))
console.log(randomIndex)