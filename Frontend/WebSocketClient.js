const WebSocket = require('ws');

class WebSocketClient {

  static isConnected = false;

  static socket = null;
  static parser = null;

  static setParser(parserFunction) {
    if (typeof parserFunction === 'function') {
      this.parser = parserFunction;
    } else {
      throw new Error('Parser must be a function');
    }
  }

  static connect(url = 'ws://localhost:7890') {
    this.socket = new WebSocket(url);

    this.socket.on('open', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
      this.socket.send('Hello Server!');
    });

    this.socket.on('message', (data) => {
      console.log(data.toString());
      if (this.parser) {
        try {
          this.parser(data.toString())
          console.log("Parsed Message: " + data.toString())
        } catch (error) {
          console.error("Error Running Message Parser: " + data.toString())
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

  static sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open. ReadyState:', this.socket ? this.socket.readyState : 'Socket not initialized');
    }
  }

  static close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

module.exports = WebSocketClient;