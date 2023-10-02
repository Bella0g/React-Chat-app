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
            setMessageList((list) => [...list, messageData]);
            
        }
    };

    // Listen for incoming messages from the socket and update the message list
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // socket event listener when the component unmounts
        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent) => {
                    return (
                        <div
                            className="message"
                            id={username === messageContent.author ? "you" : "other"}
                        >
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onkeydown={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div >
    )
}

export default Chat
