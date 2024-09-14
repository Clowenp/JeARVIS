const WebSocket = require('ws');

class WebSocketClient {
  constructor(url, parserFunction) {
    this.isConnected = false;
    this.url = url;
    this.setParser(parserFunction);
    this.connect();
  }

  setParser(parserFunction) {
    if (typeof parserFunction === 'function') {
      this.parser = parserFunction;
    } else {
      throw new Error('Parser must be a function');
    }
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.on('open', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
      this.socket.send(JSON.stringify({"message": "connect"}));
    });

    this.socket.on('message', (data) => {
      const message = data.toString();
      console.log('Received message:', message);
      if (this.parser) {
        try {
          this.parser(message);
          console.log("Message parsed successfully");
        } catch (error) {
          console.error("Error Running Message Parser: ", error)
        }
      } else {
        console.log("No Parser Found!")
      }
    });

    this.socket.on('close', () => {
      this.isConnected = false;
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open. ReadyState:', this.socket ? this.socket.readyState : 'Socket not initialized');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

module.exports = WebSocketClient;