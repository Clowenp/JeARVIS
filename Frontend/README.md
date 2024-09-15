# Frontend Setup Guide

## Installation

1. Install dependencies:
    ```sh
    npm install
    ```

2. Start the application:
    ```sh
    npm start
    ```

3. If you encounter a module error with `iohook`, rebuild the module:a
    ```sh
    npx electron-rebuild -f -w iohook
    ```

4. If you encounter a module error with `robotjs`, rebuild the module:
    ```sh
    npx electron-rebuild -f -w robotjs
    ```

5. If you encounter further errors, ensure that you have `node-gyp` installed:
    ```sh
    npm install -g node-gyp
    ```

6. For Windows users, make sure you have `windows-build-tools` installed:
    ```sh
    npm install --global --production windows-build-tools
    ```

