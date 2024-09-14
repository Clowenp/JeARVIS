// WebSocket Class 
class WebSocketClientClass {
  constructor(url, messageParser) {
    const WebSocketClient = require('../../WebSocketClient');
    this.url = url;
    this.ws = new WebSocketClient(url, messageParser);
  }

  sendMessage(message) {
    this.ws.sendMessage(message);
  }
}

// Event Listener Class
class EventListener {
  constructor() {
    this.iohook = require('iohook');
    this.robot = require('robotjs');
    this.fs = require('fs'); // Use promises for async file operations
    this.path = require('path');
    this.PNG = require('pngjs').PNG;
    this.keyInputs = ''; // Initialize an empty string to store key inputs
    this.ws = new WebSocketClientClass('ws://localhost:7890', this.onMessage.bind(this));
    
    // Mapping of keycodes to strings for non-printable characters
    this.keyMap = {
      42: '<shift>', 54: '<shift>', // Left and Right Shift
      29: '<control>', 157: '<control>', // Left and Right Control
      56: '<alt>', 184: '<alt>', // Left and Right Alt
      72: '<down>', 75: '<left>', 77: '<right>', 80: '<up>', // Arrow keys
      28: '<enter>', 14: '<backspace>', 57: ' ', 15: '<tab>', 1: '<esc>' // Other keys
    };
  }

  start() {
    //this.iohook.on('mousemove', this.onMouseMove);
    this.iohook.on('mousedown', this.onMouseDown);
    this.iohook.on('keydown', this.onKeyDown.bind(this));
    //this.iohook.on('keyup', this.onKeyUp);
    this.iohook.start();
  }

  // Define the onMessage method
  async onMessage(message) {
    console.log("Received message from backend")
    console.log(message);
    console.log("Finished message from backend")
  }

  async onMouseMove(event) {
    console.log('Mouse move event:', event);
  }

  async onMouseDown(event) {
    console.log('Mouse down event:', event);
  }

  async onKeyDown(event) {
    let char = "";
    console.log('Key down event:', event);
    // Convert keycode to character and append to keyInputs
    if (event.rawcode >= 32 && event.rawcode <= 126) {
      char = String.fromCharCode(event.rawcode);
    } else {
      char = this.keyMap[event.keycode] || `<key${event.keycode}>`;
    }
    this.keyInputs += char;

    // On enter, send the message to the backend and clear the key inputs
    if (event.keycode === 28) { // 28 is the keycode for Enter
      let path = await this.takeScreenshot();
      let payload = {
        "message": "key_input",
        "data": this.keyInputs,
        "screenshot_path": path
      }
      console.log('Payload:', payload);
      this.ws.sendMessage(JSON.stringify(payload));
      this.keyInputs = ''; // Clear the key inputs
    }
    else if (event.keycode === 31) {
      await this.takeScreenshot();
    }
  }

  onKeyUp(event) {
    console.log('Key up event:', event);
  }

  async takeScreenshot() {
    console.log('Taking screenshot');
    const screenshot = this.robot.screen.capture();
    const { width, height, image } = screenshot;
    const png = new this.PNG({ width, height });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) * 4;
        const r = image[idx];
        const g = image[idx + 1];
        const b = image[idx + 2];
        const a = image[idx + 3];
        const pngIdx = (png.width * y + x) << 2;

        png.data[pngIdx] = r;
        png.data[pngIdx + 1] = g;
        png.data[pngIdx + 2] = b;
        png.data[pngIdx + 3] = a;
      }
    }

    const filePath = this.path.join(__dirname, `../../screenshots/screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}.png`);
    png.pack().pipe(this.fs.createWriteStream(filePath))
      .on('finish', () => {
        console.log(`Screenshot saved to ${filePath}`);
      })
      .on('error', (err) => {
        console.error('Error saving screenshot:', err);
      });
      return filePath;
  }
}

module.exports = EventListener;