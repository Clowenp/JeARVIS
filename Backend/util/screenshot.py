import pyautogui
import os
from PIL import Image
import io

class Screenshot:

    @staticmethod
    def capture_screenshot():
        print("capture screenshot")
        # Capture the screen
        screenshot = pyautogui.screenshot()
        
        img_byte_arr = io.BytesIO() # convert screenshot to Byte
        screenshot.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return img_byte_arr

    @staticmethod
    def save_screenshot(img_bytes, filename='Screenshots/screenshot.png'):
        print("save screenshot")
        img = Image.open(io.BytesIO(img_bytes))
        img.save(filename) # save
        print(f"Screenshot saved as {filename}")

    @staticmethod
    def capture_and_save():
        screenshot_bytes = Screenshot.capture_screenshot()
        Screenshot.save_screenshot(screenshot_bytes)
        return screenshot_bytes
    

def main():
    Screenshot.capture_and_save()

if __name__ == "__main__":
    main()
