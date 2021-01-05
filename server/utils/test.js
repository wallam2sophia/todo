const dayjs = require("dayjs")
const path = require("path")
const fs = require('fs')

const { commonApi } = require("../src/common");

const test = async function(){
  let sendData = {
    nickName: "多喝水",
    template_id: "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM"
  }
    const res = await commonApi.sendMsg(sendData)
    console.log(res)
}
test()
