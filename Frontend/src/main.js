const { app, BrowserWindow } = require('electron');
const EventListener = require('./objects/EventListener');
const Avatar = require('./objects/Avatar');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('Initalizing avatars');
  let avatar1 = new Avatar();
  avatar1.make();
  console.log('Avatar created');

  console.log('Starting event listener');
  const eventListener = new EventListener([avatar1]);
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
