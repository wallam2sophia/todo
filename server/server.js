require("./sql.js"); // 连接数据库
require("./scheduler"); // 执行定时任务
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const router = require("./router/index")
const log4js = require('log4js');
const log4js_config = require('./config/log4js_config');
const app = express()
const port = 8090

//接管console日志，自动区分类别
log4js.configure(log4js_config);
const loggerOfConsole = log4js.getLogger('console');
console.log = loggerOfConsole.info.bind(loggerOfConsole); // do the same for others - console.debug, etc.
console.debug = loggerOfConsole.info.bind(loggerOfConsole);
global.LOG = log4js.getLogger(path.basename(__filename));
app.use(log4js.connectLogger(loggerOfConsole, { level: 'auto' }));
//extended:false 不使用第三方模块处理参数，使用Nodejs内置模块querystring处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/api", router);
// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'static')));

app.listen(port, () => console.log(`listening on port ${port}!`))
