const {
  DataTypes,
  Model
} = require('sequelize');

class Schedule extends Model {}

const schedule = function(sequelize) {
  Schedule.init({
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
    job: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    desc: DataTypes.STRING,
    reminPattern: DataTypes.STRING,
    action: DataTypes.STRING,
    params: DataTypes.JSON,
    beginTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 1 // 1 生效中  0 已失效
    }
  }, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'Schedule', // 我们需要选择模型名称
    // 不要忘记启用时间戳！
    timestamps: true,
    // 重命名 createdAt
    createdAt: "createTime",
    // 重命名 updatedAt
    updatedAt: 'updateTime'
  })
}

module.exports = { schedule }