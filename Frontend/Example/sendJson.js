const WebSocketClient = require('../WebSocketClient');

const messageParser = () => {
    console.log("Called Message Parser");
}

let ws = new WebSocketClient("ws://localhost:7890", messageParser)

setTimeout(() => {
  ws.sendMessage(JSON.stringify({"message": "john"}));
}, 1000);