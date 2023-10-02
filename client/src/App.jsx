import './App.css';
import Chat from "./Chat";
import io from "socket.io-client";
import {  createContext, useState } from "react";
import ReactSwitch from "react-switch";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

// Create a socket connection
const socket = io.connect("http://localhost:3001");

// Create a context to manage the theme globally
export const ThemeContext = createContext(null);

function JoinChat() {
  // State for managing username and room
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  // Function to join a chat room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="joinChatContainer">
      {/* UI for joining a chat room */}
      <div className='img-container'>
        <img src="./chat-logo.png" alt="Chat lounge logo" />
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
      <Link to={`/chat/${username}/${room}`}>
        <button onClick={joinRoom}>Join A Room</button>
      </Link>
    </div>
  );
}


function App() {
  // State for managing the theme
  const [theme, setTheme] = useState("dark");

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="App" id={theme}>
        <div className="switch">
          <label> {theme === "light" ? "Light" : "Dark"}</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
        
        {/* Routes */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<JoinChat />} />
            <Route path="/chat/:username/:room" element={<Chat socket={socket} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
