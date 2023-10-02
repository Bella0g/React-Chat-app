import './App.css';
import Chat from "./Chat";
import io from "socket.io-client";
import {  createContext, useState } from "react";
import ReactSwitch from "react-switch";
// import { BrowserRouter as Router, Route, link } from 'react-router-dom';

// Create a socket connection
const socket = io.connect("http://localhost:3001");

// Create a context to manage the theme globally
export const ThemeContext = createContext(null);

function App() {
  // State for managing the theme
  const [theme, setTheme] = useState("dark");

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

   // State for managing username, room, and chat display
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Function to join a chat room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
     // Provide the theme and theme toggling function to the context
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="App" id={theme}>
        <div className="switch">
          <label> {theme === "light" ? "Light" : "Dark"}</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
        
      {/* Conditional rendering based on whether to show the chat or join screen */}
      {!showChat ? (
        <div class="container" className="joinChatContainer">
            {/* UI for joining a chat room */}
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
         // Render the Chat component with the provided socket, username, and room
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
    </ThemeContext.Provider>
  );
}

export default App;
