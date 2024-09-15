const WebSocketClient = require('../WebSocketClient');

const messageParser = (message) => {
    console.log("messageParser, " + message);
}

let ws = new WebSocketClient("ws://localhost:7890", messageParser)

// setTimeout(() => {
//   ws.sendMessage(JSON.stringify({"message": "screenshot"}));
// }, 1000);

setTimeout(() => {
  ws.sendMessage(JSON.stringify({"message": "voice"}));
}, 4000);