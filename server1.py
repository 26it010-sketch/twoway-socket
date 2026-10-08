import socket
import json

from fastapi import FastAPI, WebSocket

app = FastAPI()


# Connect Server 1 to Server 2
server2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server2.connect(("127.0.0.1", 5000))

print("Server 1 connected to Server 2")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    print("Frontend connected")

    while True:

        # Receive JSON message from React
        data = await websocket.receive_text()

        data = json.loads(data)

        target = data["target"]
        message = data["message"]

        print("Target:", target)
        print("Message:", message)


        # Send everything to Server 2 for now
        server2.send(
            json.dumps({
                "target": target,
                "message": message
            }).encode()
        )


        # Receive response from Server 2
        response = server2.recv(1024).decode()

        response = json.loads(response)

        print("Server 2:", response)


        # Send response back to React
        await websocket.send_text(
            json.dumps(response)
        )