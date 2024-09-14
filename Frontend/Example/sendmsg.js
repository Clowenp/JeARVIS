const WebSocketClient = require('../WebSocketClient');

const messageParser = () => {
    console.log("Called Message Parser");
}

let ws = new WebSocketClient("ws://localhost:7890", messageParser)

setTimeout(() => {
  ws.sendMessage('I want 10 pizzas');
}, 1000);