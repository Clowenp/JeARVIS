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

3. If you encounter a module error with `iohook`, rebuild the module:
    ```sh
    npx electron-rebuild -f -w iohook
    ```

4. If you encounter a module error with `robotjs`, rebuild the module:
    ```sh
    npx electron-rebuild -f -w robotjs
    ```

