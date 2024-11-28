import React, { useState } from "react";
import "./App.css";

const Chatbot = ({ onMessageSubmit }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = { sender: "User", content: message };
    setChatHistory((prev) => [...prev, userMessage]);

    const botResponse = await onMessageSubmit(message);
    const botMessage = { sender: "Bot", content: botResponse };
    setChatHistory((prev) => [...prev, botMessage]);
    setMessage("");
  };

  // Function to format bot responses (handle code and paragraphs separately)
  const formatResponse = (response) => {
    const parts = [];
    let insideCodeBlock = false;
    let code = "";

    const lines = response.split("\n");

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (insideCodeBlock) {
          // End of code block
          parts.push(
            <pre key={idx} className="code-block">
              {code}
            </pre>
          );
          code = "";
        }
        // Toggle the insideCodeBlock state
        insideCodeBlock = !insideCodeBlock;
      } else if (insideCodeBlock) {
        // Add line to code block if inside it
        code += line + "\n";
      } else if (line.trim() !== "") {
        // Regular paragraph
        parts.push(<p key={idx} className="bot-msg">{line}</p>);
      }
    });

    return parts;
  };

  return (
    <div className="chatbot">
      <div className="chat-history">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "User" ? "user-msg" : "bot-msg"}
          >
            <strong>{msg.sender}:</strong>
            {msg.sender === "Bot" ? formatResponse(msg.content) : msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
