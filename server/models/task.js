const {
  DataTypes,
  Model
} = require('sequelize');

class Task extends Model {}

const task = function(sequelize) {
  Task.init({
    // 在这里定义模型属性
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'column'
    },
    desc: DataTypes.STRING,
    type: DataTypes.STRING,
    bgImg: {
      type: DataTypes.STRING,
    },
    members: {
      type: DataTypes.JSON,
    },
    signType: {
      type: DataTypes.STRING
    },
    beginTime: {
      type: DataTypes.STRING
    },
    endTime: {
      type: DataTypes.STRING
    },
    remindTime: {
      type: DataTypes.STRING
    },
    creator: {
      type: DataTypes.STRING
    },
    creatorAvatar: {
      type: DataTypes.STRING
    },
    manager: {
      type: DataTypes.STRING
    },
    locationLimit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    locations: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'todo' // todo 未开始  doing 进行中 done 已结束
    }
  }, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'Task', // 我们需要选择模型名称
    // 不要忘记启用时间戳！
    timestamps: true,
    // 重命名 createdAt
    createdAt: "createTime",
    // 重命名 updatedAt
    updatedAt: 'updateTime'
  })
}

module.exports = { task }