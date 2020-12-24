const {
  DataTypes,
  Model
} = require('sequelize');

class Sign extends Model {}

const sign = function(sequelize) {
  Sign.init({
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
    signer: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    signTime: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    media: {
      type: DataTypes.JSON,
    },
    location: {
      type: DataTypes.JSON,
    },
  }, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'Sign', // 我们需要选择模型名称
    // 不要忘记启用时间戳！
    timestamps: true,
    // 重命名 createdAt
    createdAt: "createTime",
    // 重命名 updatedAt
    updatedAt: 'updateTime'
  })
}

module.exports = { sign }