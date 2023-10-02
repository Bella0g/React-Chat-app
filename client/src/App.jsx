import './App.css';
import io from "socket.io-client";
import { useState } from "react";
import { BrowserRouter as Router, Route, link } from 'react-router-dom';
import Chat from "./Chat";
// add routing to switch between join and chat and context by adding a theme
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div class="container" className="joinChatContainer">
          <div className='img-container'>
            <img src="./chat-logo.png" alt="" />
          </div>
          <h3>Chat Lounge</h3>
          <input
            type="text"
            placeholder="User name.."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
