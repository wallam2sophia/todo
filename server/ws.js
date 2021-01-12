const { sequelize } = require("./sql")
const Server = require('ws').Server;
const wss = new Server({ port: 8091 });
const clientsInfo = new Map();

wss.on('connection', function (ws, req) {
  let nickName = decodeURI(req.url.split('//')[1]);
  console.log(`用户${nickName}已上线`);
  // 保存住当前用户连接
  clientsInfo.set(nickName, ws);

  ws.on('message', function (msg) {
    // 接收到消息保存到数据库
    console.log('收到一条消息', JSON.parse(msg));
    let { sender, receiver, message } = JSON.parse(msg);
    let msgData = {
      ...msg,
      status: 0
    }
    sequelize.models.Message.create(msgData, { raw: true }).then(res=>{
      //添加一条消息记录
      let sendObj = {
        type: 'msg',
        data: JSON.parse(msg),
      };
      // 如果接收方在线发送该消息
      if (clientsInfo.has(receiver)) {
        console.log(`向${receiver}发送消息`);
        clientsInfo.get(receiver).send(JSON.stringify(sendObj));
      }
      }).catch(error=>{
        console.log(error)
      })
  })
});

async function sendMsg(props){
  try {
    let res = await sequelize.models.Message.create({ ...props, status: 0}, { raw: true })
    // 如果接收方在线发送该消息
    if (clientsInfo.has(props.receiver)) {
      console.log(`向${props.receiver}发送消息`);
      clientsInfo.get(props.receiver).send(res.id);
    }
  }catch(error){
    console.log(error)
  }
}

module.exports = {
  clientsInfo,
  sendMsg
};
