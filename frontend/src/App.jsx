import { useEffect, useRef, useState } from "react";

function App() {

  const socket = useRef(null);

  const [message, setMessage] = useState("");

  const [server1Messages, setServer1Messages] = useState([]);
  const [server2Messages, setServer2Messages] = useState([]);


  useEffect(() => {

    socket.current = new WebSocket(
      "ws://127.0.0.1:8000/ws"
    );


    socket.current.onopen = () => {
      console.log("Connected to Server 1");
    };


    socket.current.onmessage = (event) => {

      console.log("Message from backend:", event.data);

      const data = JSON.parse(event.data);

      if (data.server === "server1") {

        setServer1Messages((previous) => [
          ...previous,
          data.message
        ]);

      }


      if (data.server === "server2") {

        setServer2Messages((previous) => [
          ...previous,
          data.message
        ]);

      }

    };


    socket.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };


    socket.current.onclose = () => {
      console.log("WebSocket closed");
    };


    return () => {
      socket.current.close();
    };

  }, []);


  function sendToServer2() {

    if (socket.current.readyState === WebSocket.OPEN) {

      socket.current.send(
        JSON.stringify({
          target: "server2",
          message: message
        })
      );

      setMessage("");

    }

  }


  function sendToServer1() {

    if (socket.current.readyState === WebSocket.OPEN) {

      socket.current.send(
        JSON.stringify({
          target: "server1",
          message: message
        })
      );

      setMessage("");

    }

  }


  return (
    <div>

      <h1>WebSocket Server Communication</h1>


      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />


      <button onClick={sendToServer2}>
        Send to Server 2
      </button>


      <button onClick={sendToServer1}>
        Send to Server 1
      </button>


      <hr />


      <h2>Server 1 Display</h2>

      <div>
        {server1Messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>


      <h2>Server 2 Display</h2>

      <div>
        {server2Messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

    </div>
  );
}

export default App;