const WebSocketClient = require('../WebSocketClient');

const messageParser = () => {
    console.log("Called Message Parser");
}

// Connect to the WebSocket server
WebSocketClient.connect();
WebSocketClient.setParser(messageParser)

// Send a message after a short delay to ensure connection is established
setTimeout(() => {
  WebSocketClient.sendMessage('Hello from the static class!');
}, 1000);