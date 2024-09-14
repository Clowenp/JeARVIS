const { app, BrowserWindow, Tray, Menu, screen } = require('electron'); // Add screen module
const path = require('path');
const iohook = require('iohook'); // Add iohook

let tray = null;
let agentWindow = null;

app.on('ready', () => {
  // Create the tray icon
  tray = new Tray(path.join(__dirname, 'public/trayIcon.png')); // Make sure to have an icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Agent', click: () => showAgentWindow() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Electron Agent');
  tray.setContextMenu(contextMenu);

  // Create the agent window (hidden at startup)
  createAgentWindow();

  // Capture mouse clicks
  captureMouseClicks();
});

function createAgentWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen dimensions

  agentWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false, // No frame around the window
    alwaysOnTop: true, // Always on top of other windows
    skipTaskbar: true, // Don't show in taskbar
    webPreferences: {
      nodeIntegration: true
    },
    show: true, // Show at first
    transparent: true, // Transparent background if needed
    x: 0, // Set x position to 0 (left)
    y: height - 400, // Set y position to bottom
  });

  agentWindow.loadFile(path.join(__dirname, 'agent.html'));

  agentWindow.on('closed', () => {
    agentWindow = null;
  });
}

function showAgentWindow() {
  if (agentWindow) {
    agentWindow.isVisible() ? agentWindow.hide() : agentWindow.show();
  }
}

function captureMouseClicks() {
  iohook.on('mousedown', event => {
    if (event.button === 1) { // Check if the left mouse button is clicked
      console.log(`Mouse clicked at x:${event.x} y:${event.y}`);
    }
  });

  iohook.start();
}

app.on('window-all-closed', () => {
  // Keep the app running even if all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
