const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const iohook = require('iohook');
const robot = require('robotjs');
const fs = require('fs');
const { PNG } = require('pngjs');



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow; //declare outside function so its accesible in even handlers

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1200,
    frame: false, // Hide window frame
    transparent: true, // Make window transparent
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // win.setIgnoreMouseEvents(true, { forward: true });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// Add keypress detection
iohook.on('mousemove', (event) => {
  console.log('Mouse move event:', event);
});

// iohook.on('mousedown', (event) => {
//   console.log('Mouse down event:', event);
  //mainWindow.webContents.send('mouse-pressed', event); // Send IPC message
// });

// Add keypress detection
iohook.on('keydown', (event) => {
  console.log('Key down event:', event);
  if (event.keycode === 31) {
    console.log('Taking screenshot');
    takeScreenshot();
  }
});

iohook.on('keyup', (event) => {
  console.log('Key up event:', event);
});
iohook.on('mousedown', (event) => {
  console.log('Mouse down event detected:', event);
  
  // Trigger 'Move' animation in Unity
  sendMessageToUnity('AnimationController', 'TriggerAnimation', 'Move');
});


// Function to take a screenshot
const takeScreenshot = () => {
  const screenshot = robot.screen.capture();
  const { width, height, image } = screenshot;
  const png = new PNG({ width, height });

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

  const filePath = path.join(__dirname, `screenshot-${Date.now()}.png`);
  png.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
    console.log(`Screenshot saved to ${filePath}`);
  });
};

// Start iohook to begin capturing events

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('Initalizing window');
  createWindow();
  console.log('Window created');

  console.log('Starting iohook');
  iohook.start();
  console.log('iohook started');

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
