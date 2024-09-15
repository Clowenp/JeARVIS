const WebSocketClient = require('../WebSocketClient');

const messageParser = (message) => {
    console.log("Called Message Parser");
    console.log(message)
    console.log("Called Message Parser End");
}

let ws = new WebSocketClient("ws://localhost:7890", messageParser)

setTimeout(() => {
  ws.sendMessage(JSON.stringify({"message": "screenshot"}));
}, 1000);

setTimeout(() => {
  ws.close();
}, 1000);