import styles from "../css/Chat.module.css";
import fetchIdFromToken from "../utils/jwt-decoder";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatText from "../utils/formatText";
import ReactMarkdown from "react-markdown";
import useAuth from "../utils/auth";
import LogoutButton from "../utils/logoutButton";

function Chat() {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [directoryList, setDirectoryList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [error, setError] = useState("");
  const [droppedFile, setDroppedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosedSidebar, setIsClosedSidebar] = useState(false);
  const [isClosedDirectory, setIsClosedDirectory] = useState(false);
  const [isClosedHistory, setIsClosedHistory] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [chatHistoryId, setChatHistoryId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const queryFieldRef = useRef(null);
  const bottomRef = useRef(null);
  const bottomButton = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
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
        if (err.response && err.response.status === 401) {
          setError("Token is invalid/expired");
          localStorage.removeItem("token");
        }
        setError("Failed to load chat history");
      }
    };

    const fetchDirectory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please login.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/directories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDirectoryList(res.data.data);
      } catch (err) {
        setError("Failed to load directory");
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
    fetchDirectory();

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
            chatHistoryId
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
        errMsg = `${err.response.data.message || "Request failed"}`;
      } else if (err.request) {
        errMsg = "No response from server.";
      } else {
        errMsg = err.message;
      }

      setError(errMsg);
      setChatHistory((prev) => [...prev, { sender: "error", text: errMsg }]);
    }
  };



  const buildDirectoryTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    list.forEach((item) => {
      if (item.parent_directory && map[item.parent_directory]) {
        map[item.parent_directory].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  const directoryTree = useMemo(() => buildDirectoryTree(directoryList), [directoryList]);
  
  const renderDirectoryTree = (nodes, level = 0) => {
    return (
      <ul style={{ listStyleType: "none", paddingLeft: level === 0 ? 0 : 10 }}>
        {nodes.map((node) => (
          <li
            key={node.id}
            className={styles.dropdown_item}
            style={{ paddingLeft: level }}
          >
            <i className="fa-solid fa-folder"></i> {node.directory_name}{" "}
            <span style={{ color: "gray", fontSize: "0.9em" }}>
              ({node.file_count ?? 0} files)
            </span>
            {node.children && node.children.length > 0 && renderDirectoryTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  //supaya gak ngelag
  const MAX_MESSAGES = 25;

  const recentMessages = useMemo(() => {
    return chatHistory.slice(-MAX_MESSAGES);
  }, [chatHistory]);

  return (
    <div
      className={`${styles.main_container} ${
        isClosedSidebar ? styles.close : ""
      }`}
    >
      <div className={styles.sidebar}>
        <div className={styles.sidebar_button_group}>
          <button
            onClick={() => setIsClosedSidebar(!isClosedSidebar)}
            className={styles.sidebar_button}
          >
            {isClosedSidebar ? (
              <i
                className={`fa-solid fa-align-left ${styles.sidebar_icon}`}
              ></i>
            ) : (
              <>
                <i className={`fa-solid fa-x ${styles.sidebar_icon}`}></i>
              </>
            )}
          </button>
          {isClosedSidebar ? (
            <></>
          ) : (
            <>
              <button className={styles.sidebar_button}>
                <i
                  className={`fa-solid fa-magnifying-glass ${styles.sidebar_icon}`}
                ></i>
              </button>
              <button className={styles.sidebar_button}>
                <i
                  className={`fa-solid fa-pen-to-square ${styles.sidebar_icon}`}
                ></i>
              </button>
            </>
          )}
        </div>
        <div className={styles.dropdown_group}>
          {isClosedSidebar ? (
            <></>
          ) : (
            <>
              <div className={`${styles.dropdown_area} ${isClosedDirectory ? styles.close_dropdown : ''}`}>
                <button className={styles.dropdown} onClick={() => setIsClosedDirectory((prev) => !prev)}>
                  <p className={styles.dropdown_text}>Directory</p>
                  <i className={`fa-solid fa-caret-down ${styles.dropdown_icon}`}></i>
                </button>
                {!isClosedDirectory && (
                <ul className={styles.dropdown_list}>
                  {/* {directoryList.length > 0 ? (
                    directoryList.map((dir, idx) => (
                      <li
                        key={idx}
                        className={styles.dropdown_item}
                        style={{ paddingLeft: `${dir.level * 20}px` }}
                      >
                        <i className="fa-solid fa-folder"></i>{' '}
                        {dir.directory_name}
                      </li>
                    ))
                  ) : (
                    <li className={styles.dropdown_item}>
                      No directories found
                    </li>
                  )} */}
                  {directoryTree.length > 0 ? (
                    renderDirectoryTree(directoryTree)
                  ) : (
                    <li className={styles.dropdown_item}>
                      No directories found
                    </li>
                  )}
                </ul>
                )}

              </div>
              <div
                className={`${styles.dropdown_area} ${
                  isClosedHistory ? styles.close_dropdown : ""
                }`}
              >
                <button
                  className={styles.dropdown}
                  onClick={() => setIsClosedHistory((prev) => !prev)}
                >
                  <p className={styles.dropdown_text}>History</p>
                  <i
                    className={`fa-solid fa-caret-down ${styles.dropdown_icon}`}
                  ></i>
                </button>
              </div>
              <div
                className={`${styles.container3} ${
                  isClosedDirectory && isClosedHistory
                    ? styles.dropdown_area
                    : styles.close_dropdown
                }`}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const token = localStorage.getItem('token');
                    const userId = fetchIdFromToken();
                    if (!chatTitle || !userId) return;

                    try {
                      const response = await axios.post(
                        'http://localhost:3000/chat-history/',
                        {
                          title: chatTitle,
                          userId: userId
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        }
                      );
                      setChatHistoryId(response.data.data.id);
                      setChatHistory([]); 
                      setChatTitle('');
                    } catch (err) {
                      console.error('Failed to create chat history', err);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    placeholder="Enter new chat topic title..."
                    required
                  />
                  <button type="submit">Start New Chat</button>
                </form>
              </div>
            </>
          )}
        </div>
        <button className={styles.profile_group}>
          <div className={styles.profile_circle}></div>
          {isClosedSidebar ? (
            <></>
          ) : (
            <p className={styles.profile_name}>User</p>
          )}
        </button>
        <LogoutButton />
      </div>
      <div className={styles.main_area}>
        <header className={styles.header}>
          <h1 className={styles.logo}>AInizer</h1>
        </header>
        <div className={styles.chat_area}>
          {recentMessages.map((chat, index) => (
            <div
              key={index}
              className={
                chat.sender === "user"
                  ? styles.user_message
                  : chat.sender === "ai"
                  ? styles.ai_message
                  : styles.error_message
              }
            >
              {chat.sender !== 'user' && chat.sender !== 'ai' ? (
                <i className={`${styles.error_icon} fa-solid fa-circle-exclamation`}></i>
              ) : (
                <></>
              )}
              <strong className={styles.user}>
                {chat.sender === 'user'
                  ? 'You'
                  : chat.sender === 'ai'
                  ? 'AI'
                  : 'Error'}{' '}
              </strong>{' '}
              <div className={styles.markdown_container}>
                <ReactMarkdown>{formatText(chat.text)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.query_area}>
          <form onSubmit={handleSubmit} className={styles.query_form}>
            <textarea
              ref={queryFieldRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder={
                droppedFile
                  ? 'Enter a description for the file...'
                  : 'Type your message...'
                }
              className={styles.query_field}
              required={!droppedFile}
            />
            <button type="submit" ref={bottomButton} className={`${styles.query_button} ${styles.typing}`}>
              <i className={`fa-solid fa-file-import ${styles.query_icon}`}></i>
            </button>
          </form>
        </div>
        {isDragging && (
          <div
            className={styles.drop_zone}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p>
              {droppedFile ? (
                `File ready: ${droppedFile.name}`
              ) : (
                <div className={styles.drop_zone_group}>
                  <i
                    className={`fa-solid fa-droplet ${styles.drop_zone_icon}`}
                  ></i>
                  <h1 className={styles.drop_zone_file}>Drop file here</h1>
                </div>
              )}
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default Chat;
