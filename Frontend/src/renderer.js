// renderer.js
// This script can handle communication between the Electron app and the Unity WebGL content

// Example: Send a message to Unity when an event occurs
function sendMessageToUnity(objectName, methodName, message) {
    const unityFrame = document.getElementById('unity-frame');
    unityFrame.contentWindow.unityInstance.SendMessage(objectName, methodName, message);
  }
  
  // Example usage:
  // sendMessageToUnity('GameObjectName', 'MethodName', 'Hello from Electron');
  