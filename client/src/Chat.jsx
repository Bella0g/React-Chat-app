import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState(""); // State to hold the current message being composed
    const [messageList, setMessageList] = useState([]); // State to hold the list of messages in the chat
    
    const sendMessage = async () => {
        // Check if the message is not empty
        if (currentMessage !== "") {
             // Create a message data object
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
             // Send the message data to the server
            await socket.emit("send_message", messageData);
        }
    };

    // Listen for incoming messages from the socket and update the message list
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">

            </div>
            <div className="chat-footer">
                <input type='text' placeholder='hey..' onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div >
    )
}

export default Chat
