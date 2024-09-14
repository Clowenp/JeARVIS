// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    };
  
    replaceText('welcome', process.versions.electron);
  });

contextBridge.exposeInMainWorld('electronAPI', {
  onMousePressed: (callback) => ipcRenderer.on('mouse-pressed', callback),
  // You can expose other APIs as needed
});
  
