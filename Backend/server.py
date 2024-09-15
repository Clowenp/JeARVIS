import websockets
import asyncio
from dotenv import load_dotenv
import os
from controller import Controller

def begin_server():
    load_dotenv()
    PORT = os.getenv("PORT")
    print("Server listening on Port: " + str(PORT))

    async def listener(websocket, path):
        print("Client Connected!")
        try:
            async for message in websocket:
                message = Controller.parse_message(message)
                await websocket.send(message)
        except websockets.exceptions.ConnectionClosed as e:
            print("Client Disconnected")
            print(e)

    start_server = websockets.serve(listener, "localhost", PORT)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

def main():
    begin_server()

if __name__ == "__main__":
    main()