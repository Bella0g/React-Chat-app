import './App.css';
import Chat from "./Chat";
import io from "socket.io-client";
import {  createContext, useState } from "react";
import ReactSwitch from "react-switch";
import { BrowserRouter as Router, Route, link } from 'react-router-dom';

// add routing to switch between join and chat
// add global state and context with theme
const socket = io.connect("http://localhost:3001");

export const ThemeContext = createContext(null);

function App() {

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="App" id={theme}>
        <div className="switch">
          <label> {theme === "light" ? "Light" : "Dark"}</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
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
    </ThemeContext.Provider>
  );
}

export default App;
