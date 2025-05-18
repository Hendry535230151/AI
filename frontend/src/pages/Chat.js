import styles from "../css/Chat.module.css";
import fetchIdFromToken from "../utils/jwt-decoder";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");
  const [droppedFile, setDroppedFile] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/ai/history");
        const chats = res.data.data.map((chat) => ({
          sender: chat.sender,
          text: chat.text,
        }));
        setChatHistory(chats);
      } catch (err) {
        setError("Failed to load chat history");
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = fetchIdFromToken();
    const userMessage = droppedFile
      ? `📎 ${droppedFile.name} — ${message}`
      : message;

    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      if (droppedFile) {
        const formData = new FormData();
        formData.append("file", droppedFile);
        formData.append("description", message);
        formData.append("userId", userId);
        formData.append("directoryId", 1);

        const response = await axios.post(
          "http://localhost:3000/files/create",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `✅ File uploaded: ${
              response.data.message || droppedFile.name
            }`,
          },
        ]);
        setDroppedFile(null);
      } else {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:3000/ai/chat",
          { message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: response.data.message || "No reply",
          },
        ]);
      }

      setMessage("");
      setError("");
    } catch (err) {
      let errMsg = "";
      if (err.response) {
        errMsg = `Error: ${err.response.data.message || "Request failed"}`;
      } else if (err.request) {
        errMsg = "No response from server.";
      } else {
        errMsg = `Error: ${err.message}`;
      }

      setError(errMsg);
      setChatHistory((prev) => [...prev, { sender: "error", text: errMsg }]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setDroppedFile(file);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "user",
          text: `📎 File ready to send: ${file.name}`,
        },
      ]);

      e.dataTransfer.clearData();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h1>Welcome to the Chat Page!</h1>

      <div className={styles.chatBox}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={
              chat.sender === "user"
                ? styles.userMessage
                : chat.sender === "ai"
                ? styles.aiMessage
                : styles.errorMessage
            }
          >
            <strong>
              {chat.sender === "user"
                ? "You"
                : chat.sender === "ai"
                ? "AI"
                : "Error"}
              :
            </strong>{" "}
            {chat.text}
          </div>
        ))}
      </div>

      <div
        className={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {droppedFile ? (
          <p>
            File ready: <strong>{droppedFile.name}</strong>
          </p>
        ) : (
          <p>Drag & drop a file here</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            droppedFile
              ? "Enter a description for the file..."
              : "Type your message..."
          }
          className={styles.chatInput}
          required
        />
        <button type="submit" className={styles.chatButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
