const { BrowserWindow } = require('electron');
const path = require('path');

// Window Class
class Avatar{
  constructor(
    width = 400,
    height = 400,
    frame = false,
    transparent = true,
    alwaysOnTop = true,
    skipTaskbar = false,
    icon = path.join(__dirname, '../assets/icon.png')
  ) {
    this.options = {
      width,
      height,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, '../preload.js'),
      },
      frame,
      transparent,
      alwaysOnTop,
      skipTaskbar,
      icon,
    };
    this.window = null;
  }

  // Make the window
  make() {
    this.window = new BrowserWindow(this.options);

    // Load the index.html file
    this.window.loadFile(path.join(__dirname, '../index.html'));

    // Open DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools();
    }
  }

  // Move the window
  move(direction, distance = 5) {
    const bounds = this.getBounds();
    if (!bounds) return;

    const step = 5;
    const targetDistance = distance * 10;
    let currentDistance = 0;

    const animate = () => {
      switch (direction) {
        case 'up':
          bounds.y -= step;
          break;
        case 'down':
          bounds.y += step;
          break;
        case 'left':
          bounds.x -= step;
          break;
        case 'right':
          bounds.x += step;
          break;
      }

      this.setBounds(bounds);
      currentDistance += step;

      if (currentDistance < targetDistance) {
        setTimeout(animate, 10); // Roughly 60 frames per second
      }
    };

    animate();
  }

  getBounds() {
    if (this.window) {
      return this.window.getBounds();
    }
    return null;
  }

  setBounds(bounds) {
    if (this.window) {
      this.window.setBounds(bounds);
    }
  }

  // Set the window position
  setPosition(mouseX, mouseY) {
    if (this.window) {
      const { width, height } = this.window.getBounds();
      const x = Math.round(mouseX / 2 - width / 2);
      const y = Math.round(mouseY / 2);
      this.setBounds({ x, y, width, height });
    }
  }

}

module.exports = Avatar;
