const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: true, // Hide window frame
    transparent: false, // Make window transparent
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index1.html'));
};

// WebSocket Class 
class WebSocketClient {
  constructor(url, messageParser) {
    const WebSocketClient = require('./WebSocketClient');
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
    this.ws = new WebSocketClient('ws://localhost:8080', this.onMessage.bind(this));
  }

  start() {
    this.iohook.on('mousemove', this.onMouseMove);
    this.iohook.on('mousedown', this.onMouseDown);
    this.iohook.on('keydown', this.onKeyDown.bind(this));
    this.iohook.on('keyup', this.onKeyUp);
    this.iohook.start();
  }

  // Define the onMessage method
  onMessage(message) {
    console.log('Received message:', message);
  }

  async onMouseMove(event) {
    console.log('Mouse move event:', event);
  }

  async onMouseDown(event) {
    console.log('Mouse down event:', event);
  }

  async onKeyDown(event) {
    console.log('Key down event:', event);
    // Convert keycode to character and append to keyInputs
    const char = String.fromCharCode(event.rawcode);
    this.keyInputs += char;

    // On enter, send the message to the backend and clear the key inputs
    if (event.keycode === 28) { // 28 is the keycode for Enter
      console.log('Key inputs before Enter:', this.keyInputs);
      this.ws.sendMessage(this.keyInputs);
      this.keyInputs = ''; // Clear the key inputs
    }

    if (event.keycode === 31) {
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

    const filePath = this.path.join(__dirname, `../screenshots/screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}.png`);
    png.pack().pipe(this.fs.createWriteStream(filePath))
      .on('finish', () => {
        console.log(`Screenshot saved to ${filePath}`);
      })
      .on('error', (err) => {
        console.error('Error saving screenshot:', err);
      });
  }
}

// Start iohook to begin capturing events

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.whenReady().then(() => {
  console.log('Initalizing window');
  createWindow();
  console.log('Window created');

  console.log('Starting event listener');
  const eventListener = new EventListener();
  eventListener.start();
  console.log('Event listener started');

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
