const { app } = require('electron');
const EventListener = require('./objects/EventListener');
const Avatar = require('./objects/Window');
const iohook = require('iohook');

let avatar1 = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

iohook.on('keydown', (event) => {
  if (event.keycode === 61000) { // Up arrow key
    console.log('Up arrow key pressed');
    avatar1.move('up');
  } else if (event.keycode === 61008) { // Down arrow key
    console.log('Down arrow key pressed');
    avatar1.move('down');
  } else if (event.keycode === 61003) { // Left arrow key
    console.log('Left arrow key pressed');
    avatar1.move('left');
  } else if (event.keycode === 61005) { // Right arrow key
    console.log('Right arrow key pressed');
    avatar1.move('right');
  }
});

iohook.start();



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('Initalizing avatars');
  avatar1 = new Avatar();
  avatar1.make();
  console.log('Avatar created');

  console.log('Starting event listener');
  const eventListener = new EventListener();
  eventListener.start();
  console.log('Event listener started');

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      avatar1.make();
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
