const { DataTypes, Model } = require('sequelize');

class User extends Model {}

const user = function(sequelize) {
  User.init({
    // 在这里定义模型属性
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'column'
    },
    avatarUrl: DataTypes.STRING,
    sessionKey: {
      type: DataTypes.STRING,
    },
    openId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    }
  }, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'User', // 我们需要选择模型名称
    // 不要忘记启用时间戳！
    timestamps: true,
    // 重命名 createdAt
    createdAt: "createTime",
    // 重命名 updatedAt
    updatedAt: 'updateTime'
  })
}

module.exports = { user }