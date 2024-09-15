// renderer.js
// This script can handle communication between the Electron app and the Unity WebGL content

// Ensure unityInstance is accessible
const unityFrame = document.getElementById('unity-frame');

// Wait for the Unity content to load
window.addEventListener('DOMContentLoaded', () => {
  // Listen for mouse-pressed events from the main process
  window.electronAPI.onMousePressed((event, data) => {
    console.log('Mouse pressed event received in renderer:', data);
    // Send message to Unity
    sendMessageToUnity('SportyGranny', 'ChangeAnimation', 'Reaction');
  });
  window.addEventListener('keydown', (event) => {
    console.log('Key down event detected! ');
    // You can send a message to Unity here when a key is pressed
    sendMessageToUnity('SportyGranny', 'ChangeAnimation', 'Dying');
  });
});

// Function to send messages to Unity
function sendMessageToUnity(objectName, methodName, parameter) {
  if (unityFrame && unityFrame.contentWindow.unityInstance) {
    unityFrame.contentWindow.unityInstance.SendMessage(objectName, methodName, parameter);
  } else {
    console.error('Unity instance is not available.');
  }
}

  