const SystemController = require('./SystemController');

// WebSocket Class 
class WebSocketClientClass {
  constructor(url, messageParser) {
    const WebSocketClient = require('./WebSocketClient');
    this.url = url;
    this.ws = new WebSocketClient(url, messageParser);
  }

  sendMessage(message) {
    this.ws.sendMessage(message);
    console.log("Sent message:", message);
  }
}

// Event Listener Class
class EventListener {
  constructor(avatars = []) { // Accept an array of avatars
    this.iohook = require('iohook');
    this.robot = require('robotjs');
    this.fs = require('fs'); // Use promises for async file operations
    this.path = require('path');
    this.PNG = require('pngjs').PNG;
    this.ws = new WebSocketClientClass('ws://localhost:7890', this.onMessage.bind(this));
    
    // Store the avatars array
    this.avatars = avatars;

    // Initialize the SystemController
    this.systemController = new SystemController();

    // Take a screenshot every 5 seconds
    setInterval(async () => {
      // await this.systemController.takeScreenshot();
    }, 5000);

    // Mapping of keycodes to strings for non-printable characters
    this.keyMap = {
      42: '<shift>', 54: '<shift>', // Left and Right Shift
      29: '<control>', 157: '<control>', // Left and Right Control
      56: '<alt>', 184: '<alt>', // Left and Right Alt
      61008: '<down>', 61003: '<left>', 61005: '<right>', 61000: '<up>', // Corrected Arrow keys
      28: '<enter>', 14: '<backspace>', 57: ' ', 15: '<tab>', 1: '<esc>', // Other keys
    };
    this.keyInputs = ''; // Initialize an empty string to store key inputs
    this.state = "LISTENING"; // "LISTENING", "PROCESSING", "AVATAR"
    this.isTrackingMouse = false; // Corrected to 'false'
  }

  start() {
    this.iohook.on('mousemove', this.onMouseMove.bind(this));
    this.iohook.on('mousedown', this.onMouseDown.bind(this));
    this.iohook.on('keydown', this.onKeyDown.bind(this));
    this.iohook.on('keyup', this.onKeyUp.bind(this));
    this.iohook.start();
  }

  // Define websocket functions
  async onMessage(message) {
  }

  async sendPayload(payload) {
    // Wait until the state is "LISTENING"
    let effectiveLength = this.keyInputs.replace(/<[^>]+>/g, '.').length;
    if (effectiveLength < 10) {
      return;
    }
    this.keyInputs = ''; // Clear the key inputs
    console.log("Sending payload", payload);
    while (this.state !== "LISTENING") {
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms before checking again
    }
    this.state = "PROCESSING";
    this.ws.sendMessage(JSON.stringify(payload));
    this.state = "LISTENING";
  }


  // Define iohook functions
  async onMouseMove(event) {
    if (this.isTrackingMouse) {
      this.avatars[0].setPosition(event.x, event.y); // Update avatar position
    }
  }

  async onMouseDown(event) {
    if (event.button === 1) {
      this.keyInputs += '<leftMouseClick>';
    } else if (event.button === 2) {
      this.keyInputs += '<rightMouseClick>';
    }
    const payload = { // Declare the payload variable
      "message": "mouse_click",
      "data": this.keyInputs
    };
    this.sendPayload(payload);
  }

  async onKeyDown(event) {
    console.log('Key down event:', event.keycode);
    let char = "";
    // Check if keycode is in the keyMap dictionary
    if (this.keyMap[event.keycode]) {
      char = this.keyMap[event.keycode];
    } else if (event.rawcode >= 32 && event.rawcode <= 126) {
      char = String.fromCharCode(event.rawcode);
    } else {
      char = `<key${event.rawcode}>`;
    }
    
    this.keyInputs += char;

    // On enter, send the message to the backend and clear the key inputs
    if (event.keycode === 28) { // 28 is the keycode for Enter
      let path = await this.systemController.takeScreenshot();
      let payload = {
        "message": "key_input",
        "data": this.keyInputs,
        "screenshot_path": path
      }
      this.sendPayload(payload);
    }
    else if (event.keycode === 31) {
      await this.systemController.takeScreenshot();
    }
    else if (event.keycode === 16) { // 16 is the keycode for q
      await this.systemController.openDefaultBrowser("https://www.google.com");
    }
    else if (event.keycode === 61000) { // Up arrow key
      console.log('Up arrow key pressed');
      this.avatars[0].move('up');
    } else if (event.keycode === 61008) { // Down arrow key
      console.log('Down arrow key pressed');
      this.avatars[0].move('down');
    } else if (event.keycode === 61003) { // Left arrow key
      console.log('Left arrow key pressed');
      this.avatars[0].move('left');
    } else if (event.keycode === 61005) { // Right arrow key
      console.log('Right arrow key pressed');
      this.avatars[0].move('right');
    } else if (event.keycode === 30) { // 30 is the keycode for 'a'
      this.isTrackingMouse = true; // Start tracking mouse
      console.log(this.isTrackingMouse);
    }
  }

  onKeyUp(event) {
    if (event.keycode === 30) { // 30 is the keycode for 'a'
      this.isTrackingMouse = false; // Stop tracking mouse
      console.log(this.isTrackingMouse);
    }
  }

}

module.exports = EventListener;