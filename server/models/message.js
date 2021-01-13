const {
  DataTypes,
  Model
} = require('sequelize');

class Message extends Model {}

const message = function(sequelize) {
  Message.init({
    // 在这里定义模型属性
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    signId: {
      type: DataTypes.INTEGER,
    },
    taskTitle: DataTypes.STRING,
    sender: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    receiver: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    type: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 0 // 1 已读  0 未读
    }
  }, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'Message', // 我们需要选择模型名称
    // 不要忘记启用时间戳！
    timestamps: true,
    // 重命名 createdAt
    createdAt: "createTime",
    // 重命名 updatedAt
    updatedAt: 'updateTime'
  })
}

module.exports = { message }