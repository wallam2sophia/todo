require("./sql.js"); // 连接数据库
const express = require('express')
const bodyParser = require('body-parser');
const router = require("./router/index")
const app = express()
const port = 2333
//extended:false 不使用第三方模块处理参数，使用Nodejs内置模块querystring处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/api", router);

app.listen(port, () => console.log(`listening on port ${port}!`))
