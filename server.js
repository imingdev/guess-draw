// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wsInstance = new WebSocketServer({
  port: 9999
});

wsInstance.on('connection', ws => {
  console.log(`[SERVER] connection()`);
  ws.on('message', function (message) {
    console.log(`[SERVER] Received: ${message}`);

    wsInstance.clients.forEach((client) => {
      client.send(message)
    })
  })
});
