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

/*
//send message to Unity directly
function fromNumbersendMessageToUnity(isTalk, productivity){
  const animationKey = getAnimationKeywordFromNumber(isTalk, productivity);
  sendMessageToUnity(animationKey[0], 'ChangeAnimation', animationKey[1]);
}

function getAnimationKeywordFromNumber(isTalk, productivity) {
  let grannyAnimations, jimmyAnimations;
  
  if (isTalk) {
    // Step 1: create lists
    grannyAnimations = [
      ["Yelling", "Rapping"],
      ["Yelling", "Rapping"],
      ["Talking", "Yelling"],
      ["Talking"],
      ["Talking1", "Talking2"],
      ["Talking", "Talking2"],
      ["Talking", "Talking1"],
      ["Rapping", "Talking1"],
      ["Rapping", "Talking"],
      ["Rapping", "Talking1"]
    ];
    
    jimmyAnimations = [
      ["Talking3"],
      ["Talking2"],
      ["Talking3", "Talking1"],
      ["Talking1", "Talking2"],
      ["Singing"],
      ["Talking", "Talking3"],
      ["Singing", "Talking1"],
      ["Singing", "Talking1"],
      ["Talking1"],
      ["Talking3", "Talking2"]
    ];
  } else {
    // Step 1: create lists
    grannyAnimations = [
      ["Angry", "Dying", "Yelling"],
      ["AngryGesture", "Angry"],
      ["AngryGesture", "Disappointed"],
      ["Rejected", "Reaction"],
      ["Moonwalk", "Talking1"],
      ["Talking", "Talking2"],
      ["Rapping", "Talking1"],
      ["CatWalk", "Rapping"],
      ["BreakDance", "CatWalk"],
      ["BreakDance"]
    ];

    jimmyAnimations = [
      ["Angry", "BrutalAss"],
      ["LookOver", "BrutalAss"],
      ["CrouchAndStandUp", "Angry"],
      ["NervousLooking"],
      ["LookOver", "Acknowledge"],
      ["Acknowledge", "HappyIdle"],
      ["Singing", "HappyIdle"],
      ["SwingDance", "Cancan"],
      ["Uprock", "SillyDancing", "ChickenDance"],
      ["Ymca", "SillyDancing", "JoyfulJump"]
    ];
  }

  // Step 2: Parse the productivity string and get the index (1-10)
  const index = parseInt(productivity, 10); // Assumes input like "1", "2", ..., "10"
  
  // Validate index is in the range 1-10
  if (isNaN(index) || index < 1 || index > 10) {
    return "Invalid index. Provide a number between 1 and 10.";
  }

  // Step 3: Retrieve the corresponding list at index - 1
  const grannyList = grannyAnimations[index - 1];
  const jimmyList = jimmyAnimations[index - 1];

  // Step 4: Select two random strings from the selected list
  function getRandomElement(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  const grannyString = getRandomElement(grannyList);
  const jimmyString = getRandomElement(jimmyList);

  // Generate a random number between 0 and 1 to decide which character's animation to return
  const randomNum = Math.floor(Math.random() * 2);

  // Step 5: Return the selected animation based on the random number
  if (randomNum === 0) {
    return ['SportyGranny', grannyString];
  }

  return ['Jimmy', jimmyString];
}

*/
