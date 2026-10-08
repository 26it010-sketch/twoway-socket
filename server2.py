import socket
import json

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server.bind(("127.0.0.1", 5000))

server.listen(1)

print("Server 2 waiting for Server 1...")

conn, address = server.accept()

print("Server 1 connected")


while True:

    data = conn.recv(1024).decode()

    if not data:
        break

    data = json.loads(data)

    target = data["target"]
    message = data["message"]

    print("Target:", target)
    print("Message:", message)


    if target == "server2":

        response = {
            "server": "server2",
            "message": "Message processed by Server 2: " + message
        }


    elif target == "server1":

        response = {
            "server": "server1",
            "message": "Message processed by Server 1: " + message
        }


    conn.send(
        json.dumps(response).encode()
    )