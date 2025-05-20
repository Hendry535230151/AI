import styles from "../css/Chat.module.css";
import fetchIdFromToken from "../utils/jwt-decoder";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatText from "../utils/formatText";
import ReactMarkdown from "react-markdown";

function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const bottomRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

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

  useEffect(() => {
    let dragCounter = 0;
    let dragLeaveTimeout;

    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please login.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/ai/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const chats = res.data.data.map((chat) => ({
          sender: chat.sender,
          text: chat.text,
        }));
        setChatHistory(chats);
      } catch (err) {
        setError("Failed to load chat history");
      }
    };

    const handleWindowDragOver = (e) => {
      e.preventDefault();
      dragCounter++;
      clearTimeout(dragLeaveTimeout);
      setIsDragging(true);
    };

    const handleWindowDrop = (e) => {
      e.preventDefault();
      dragCounter = 0;
      clearTimeout(dragLeaveTimeout);
      setIsDragging(false);
      handleDrop(e);
    };

    const handleWindowDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragLeaveTimeout = setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }
    };

    fetchHistory();

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    window.addEventListener("dragleave", handleWindowDragLeave);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      clearTimeout(dragLeaveTimeout);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !droppedFile) {
      setError("Please enter a message or drop a file.");
      return;
    }

    const userId = fetchIdFromToken();
    if (!userId) {
      setError("User not authenticated. Please login.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }

    const userMessage = droppedFile
      ? `📎 ${droppedFile.name} — ${trimmedMessage}`
      : trimmedMessage;

    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      if (droppedFile) {
        const formData = new FormData();
        formData.append("file", droppedFile);
        formData.append("description", trimmedMessage);
        formData.append("userId", userId);
        formData.append("directoryId", 1);

        const response = await axios.post(
          "http://localhost:3000/files/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
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
        const response = await axios.post(
          "http://localhost:3000/ai/chat",
          {
            message: trimmedMessage,
            userId,
          },
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

  return (
    <div className={styles.chat_container}>
      <div className={styles.sidebar}>asdf</div>
      <div className={styles.chat_area}>
        <h1 className={styles.main_text}>AInizer</h1>
        <div className={styles.chat_box_wrapper}>
          <div className={styles.chat_box}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={
                  chat.sender === "user"
                    ? styles.user_message
                    : chat.sender === "ai"
                    ? styles.ai_message
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
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  <ReactMarkdown>{formatText(chat.text)}</ReactMarkdown>
                </pre>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {isDragging && (
          <div
            className={styles.drop_zone}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p>
              {droppedFile
                ? `File ready: ${droppedFile.name}`
                : "Drop your file here"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.chat_form}>
          <div className={styles.input_wrapper}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                droppedFile
                  ? "Enter a description for the file..."
                  : "Type your message..."
              }
              className={styles.chat_input}
              required
            />
            <button type="submit" className={styles.chat_button}></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
