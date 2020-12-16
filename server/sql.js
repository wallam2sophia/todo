const { Sequelize } = require('sequelize');
const { task } = require("./models/task");
const { sign } = require("./models/sign");
// 连接数据库
const sequelize = new Sequelize('todo', 'root', 'admin123', {
  host: '8.131.60.165',
  port: 3306,
  dialect: 'mysql'
})
const connect = async function(){
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功.');
    //创建数据表
    task(sequelize);
    sign(sequelize);
    // await sequelize.sync();
    console.log("数据库模型同步成功.");
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}
connect();

module.exports = { sequelize };