import styles from "../css/Chat.module.css";
import fetchIdFromToken from "../utils/jwt-decoder";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import formatText from "../utils/formatText";
import ReactMarkdown from "react-markdown";
import ClearSetting from "../components/setting_component/ClearSetting";
import ChangeTheme from "../components/setting_component/ChangeTheme";
import ChangeProfile from "../components/setting_component/BasicSetting";

function Chat() {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [directoryList, setDirectoryList] = useState([]);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [activeSetting, setActiveSetting] = useState("basic");
  const [droppedFile, setDroppedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosedSidebar, setIsClosedSidebar] = useState(false);
  const [isClosedDirectory, setIsClosedDirectory] = useState(false);
  const [isClosedHistory, setIsClosedHistory] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isActiveConfirmPanel, setActiveConfirmPanel] = useState(false);
  const [chatHistoryId, setChatHistoryId] = useState(null);
  const [clearDesition, setClearDesition] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDirectories, setSearchDirectories] = useState([]);
  const [searchHistories, setSearchHistories] = useState([]);
  const [isOpenNewSeach, setIsOpenNewSearch] = useState(false);
  const queryFieldRef = useRef(null);
  const bottomRef = useRef(null);
  const bottomButton = useRef(null);
  const token = localStorage.getItem("token");
  const userId = fetchIdFromToken();

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    try {
      const [dirRes, historyRes] = await Promise.all([
        axios.get(`/directories/name/${userId}`, {
          params: {
            searchQuery: searchKeyword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`/chat-history/search/${userId}`, {
          params: {
            searchQuery: searchKeyword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setSearchDirectories(dirRes.data.data || []);
      setSearchHistories(historyRes.data.data || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const fetchDirectory = async () => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/directories/find-user-directory/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDirectoryList(res.data.data);
    } catch (err) {
      setError("Failed to load directory");
    }
  };

  const clearHistoryByUserId = async () => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/chat-history/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory([]);
      setChatHistoryList([]);
    } catch (err) {
      setError("Failed to clear chat history");
    }
  };

  const clearFileByUserId = async () => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/files/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDirectoryList([]);
      const res = await axios.get(
        `http://localhost:3000/directories/find-user-directory/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDirectoryList(res.data.data);
    } catch (err) {
      setError("Failed to clear file");
    }
  };

  const clearDirectoryByUserId = async () => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/directories/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await updateTotalFiles();
    } catch (err) {
      setError("Failed to clear directory");
    }
  };

  const updateTotalFiles = async () => {
    if (!token || !userId) {
      setError("User not authenticated. Please login.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/directories/update-total-file/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDirectory();
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
      console.error("Error update total file:", errMsg);
    }
  };

  useEffect(() => {
    const fetchTheme = async () => {
      if (!token) {
        setError("User not authenticated. Please login.");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/users/find-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const themeFromDb = res.data.data.theme;
        setIsDarkMode(themeFromDb === "dark");
      } catch (err) {
        setError("Failed to fetch theme");
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove(styles.light_mode);
    } else {
      document.body.classList.add(styles.light_mode);
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!chatHistoryId) {
      setError("Please create or select a chat topic first.");
      return;
    }

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

  const fetchChatHistory = async () => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/chat-history/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = res.data.data;
      setChatHistoryList(
        Array.isArray(responseData) ? responseData : [responseData]
      );
    } catch (err) {
      setError("Failed to load History");
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    let dragCounter = 0;
    let dragLeaveTimeout;

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

    fetchDirectory();
    fetchChatHistory();

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
    if (chatHistoryId) {
      setError("");
    }
  }, [chatHistoryId]);

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

    if (!chatHistoryId) {
      setError("Please create or select a chat topic first.");
      return;
    }

    if (!userId) {
      setError("User not authenticated. Please login.");
      return;
    }

    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }

    const userMessage = droppedFile
      ? `📎 ${droppedFile.name} \n\n ${trimmedMessage}`
      : trimmedMessage;

    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);

    const updateFileCount = async () => {
      if (!token) {
        setError("User not authenticated. Please login.");
        return;
      }

      try {
        const res = await axios.put(
          `http://localhost:3000/directories/update-total-file/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDirectoryList(res.data.data);
      } catch (err) {
        setError("Failed to load directory");
      }
    };

    try {
      if (droppedFile) {
        const formData = new FormData();
        formData.append("file", droppedFile);
        formData.append("description", trimmedMessage);
        formData.append("userId", userId);
        formData.append("chatHistoryId", chatHistoryId);

        const response = await axios.post(
          "http://localhost:3000/ai/chat-insert-file",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await updateTotalFiles();

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: ` ${response.data.message}`,
          },
        ]);
        setDroppedFile(null);
      } else {
        const response = await axios.post(
          "http://localhost:3000/ai/chat",
          {
            message: trimmedMessage,
            userId,
            chatHistoryId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await updateTotalFiles();

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: response.data.message || "No reply",
          },
        ]);
      }

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

  const directoryTree = useMemo(
    () => (directoryList ? buildDirectoryTree(directoryList) : []),
    [directoryList]
  );

  const renderDirectoryTree = (nodes, level = 0) => {
    return (
      <ul
        style={{
          listStyleType: "none",
          paddingLeft: level === 0 ? 0 : level * 10,
        }}
      >
        {nodes.map((node) => (
          <li
            key={node.id}
            className={styles.dropdown_item}
            style={{
              paddingLeft: level * 10,
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-folder"></i> {node.directory_name}{" "}
            <span style={{ color: "gray", fontSize: "0.9em" }}>
              ({node.total_files ?? 0} files)
            </span>
            {node.children &&
              node.children.length > 0 &&
              renderDirectoryTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const updateTheme = async (checked) => {
    if (!token) {
      setError("User not authenticated. Please login.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:3000/users/theme/${userId}`,
        {
          theme: checked ? "dark" : "light",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      setError("Failed post theme");
    }
  };

  //supaya gak ngelag
  const MAX_MESSAGES = 100;

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
              <button
                className={styles.sidebar_button}
                onClick={() => {
                  setIsOpenSearch(true);
                }}
              >
                <i
                  className={`fa-solid fa-magnifying-glass ${styles.sidebar_icon}`}
                  onClick={() => setIsOpenSearch(true)}
                ></i>
              </button>
              <button className={styles.sidebar_button}>
                <i
                  className={`fa-solid fa-pen-to-square ${styles.sidebar_icon}`}
                  onClick={() => setIsOpenNewSearch(true)}
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
              <div
                className={`${styles.dropdown_area} ${
                  isClosedDirectory ? styles.close_dropdown : ""
                }`}
              >
                <button
                  className={styles.dropdown}
                  onClick={() => setIsClosedDirectory((prev) => !prev)}
                >
                  <p className={styles.dropdown_text}>Directory</p>
                  <i
                    className={`fa-solid fa-caret-down ${styles.dropdown_icon}`}
                  ></i>
                </button>
                {!isClosedDirectory && (
                  <ul className={styles.dropdown_list}>
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
                {!isClosedHistory && (
                  <>
                    <ul className={styles.dropdown_list}>
                      {chatHistoryList.map((his, idx) => (
                        <li
                          key={idx}
                          className={styles.dropdown_item}
                          onClick={async () => {
                            if (editingId) return;
                            setChatHistoryId(his.id);
                            setChatTitle(his.title);
                            setChatHistory([]);
                            await fetchChatHistory();
                            try {
                              const res = await axios.get(
                                `http://localhost:3000/ai/history/${his.id}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              const data = res.data.data;
                              const chats = Array.isArray(data)
                                ? data.map((chat) => ({
                                    sender: chat.sender,
                                    text: chat.text,
                                  }))
                                : [];
                              setChatHistory(chats);
                            } catch {
                              setError(
                                "Failed to load chat history for selected topic"
                              );
                            }
                          }}
                        >
                          {editingId === his.id ? (
                            <>
                              <div className={styles.rename_container}>
                                <input
                                  className={styles.rename_input}
                                  value={editingTitle}
                                  onChange={(e) =>
                                    setEditingTitle(e.target.value)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className={styles.rename_button_group}>
                                  <button
                                    className={styles.rename_button}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        await axios.put(
                                          `http://localhost:3000/chat-history/${his.id}`,
                                          { title: editingTitle, userId },
                                          {
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          }
                                        );
                                        const updatedList = [
                                          ...chatHistoryList,
                                        ];
                                        updatedList[idx].title = editingTitle;
                                        setChatHistoryList(updatedList);
                                        setEditingId(null);
                                      } catch {
                                        setError("Failed to update title");
                                      }
                                    }}
                                  >
                                    <i className="fa-solid fa-floppy-disk"></i>
                                  </button>
                                  <button
                                    className={styles.rename_button}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(null);
                                    }}
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {his.title}
                              <button
                                className={styles.rename_button}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(his.id);
                                  setEditingTitle(his.title);
                                }}
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                className={styles.rename_button}
                                onClick={async () => {
                                  try {
                                    await axios.delete(
                                      `http://localhost:3000/chat-history/${his.id}`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    const updatedList = chatHistoryList.filter(
                                      (_, i) => i !== idx
                                    );
                                    setChatHistoryList(updatedList);
                                    if (chatHistoryId === his.id) {
                                      setChatHistoryId(null);
                                      setChatHistory([]);
                                      setChatTitle("");
                                    }
                                  } catch (err) {
                                    setError("Failed to delete history");
                                  }
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className={styles.profile_container}>
          <button
            className={styles.profile_group}
            onClick={() => setIsOpenSetting(true)}
          >
            <div className={styles.profile_circle}>
              <i className={`fa-solid fa-user ${styles.profile_icon}`}></i>
            </div>
            {isClosedSidebar ? (
              <></>
            ) : (
              <p className={styles.profile_name}>User</p>
            )}
          </button>
        </div>
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
              {chat.sender !== "user" && chat.sender !== "ai" ? (
                <i
                  className={`${styles.error_icon} fa-solid fa-circle-exclamation`}
                ></i>
              ) : (
                <></>
              )}
              <strong className={styles.user}>
                {chat.sender === "user"
                  ? "You"
                  : chat.sender === "ai"
                  ? "AI"
                  : "Error"}{" "}
              </strong>{" "}
              <div className={styles.markdown_container}>
                <ReactMarkdown>{formatText(chat.text)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.query_area}>
          {!chatHistoryId && (
            <div className={styles.warning_text}>
              Please create a new chat topic or select a topic.
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.query_form}>
            <textarea
              ref={queryFieldRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder={
                droppedFile
                  ? "Enter a description for the file..."
                  : "Type your message..."
              }
              className={styles.query_field}
              required
              disabled={!chatHistoryId}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                  setMessage("");
                }
              }}
            />
            <button
              type="submit"
              disabled={!chatHistoryId}
              title={
                !chatHistoryId
                  ? "Please create or select a chat topic first"
                  : ""
              }
              required={!droppedFile}
            />
            <button
              type="submit"
              ref={bottomButton}
              className={`${styles.query_button} ${styles.typing}`}
            >
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
        {/* New chat area */}
        {isOpenNewSeach && (
          <div className={styles.new_history_container}>
            <div className={styles.new_history_card}>
              <h1 className={styles.new_history_title}>
                Enter your chat title
              </h1>
              <form
                className={styles.new_history_form}
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!chatTitle || !userId) return;

                  try {
                    const response = await axios.post(
                      "http://localhost:3000/chat-history/",
                      {
                        title: chatTitle,
                        userId: userId,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    setChatHistoryId(response.data.data.id);
                    setChatHistory([]);
                    setChatTitle("");
                    await fetchChatHistory();
                    setIsOpenNewSearch(false);
                  } catch (err) {
                    console.error("Failed to create chat history", err);
                  }
                }}
              >
                <input
                  className={styles.new_history_input}
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder="Enter new chat topic title..."
                  required
                />
                <div className={styles.new_history_button_group}>
                  <button type="submit" className={styles.new_history_button}>
                    Add
                  </button>
                  <button
                    type="button"
                    className={styles.new_history_button}
                    onClick={() => setIsOpenNewSearch(false)} // misalnya untuk cancel
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Search area */}
        {isOpenSearch && (
          <div className={styles.search_wrapper}>
            <div className={styles.search_card}>
              <div className={styles.search_area}>
                <form
                  className={styles.search_form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <input
                    className={styles.search_bar}
                    type="text"
                    placeholder="Input what you want to search ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button type="button">
                    <i
                      className={`fa-solid fa-magnifying-glass ${styles.search_icon}`}
                    ></i>
                  </button>
                </form>
                <i
                  className={`fa-solid fa-xmark ${styles.close_setting_icon}`}
                  onClick={() => setIsOpenSearch(false)}
                ></i>
              </div>
              <div className={styles.search_result_group}>
                <div className={styles.result_area}>
                  <h3 className={styles.sub_text}>Directory</h3>
                  {searchDirectories.length === 0 ? (
                    <p className={styles.result_text}>No directory found</p>
                  ) : (
                    searchDirectories.map((dir) => (
                      <div className={styles.result_text} key={dir.id}>
                        {dir.directory_name}
                      </div> // atau dir.directory_name
                    ))
                  )}
                </div>
                <div className={styles.result_area}>
                  <h3 className={styles.sub_text}>History</h3>
                  {searchHistories.length === 0 ? (
                    <p className={styles.result_text}>No history found</p>
                  ) : (
                    searchHistories.map((history) => (
                      <div className={styles.result_text} key={history.id}>
                        {history.title}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setting area */}
        {isActiveConfirmPanel && (
          <div className={styles.confirm_container}>
            <div className={styles.confirm_card}>
              <h1 className={styles.confirm_title}>
                {clearDesition === "history"
                  ? "Clear History"
                  : clearDesition === "directory"
                  ? "Clear Directory"
                  : "Clear File"}
              </h1>
              <p className={styles.confirm_description}>
                {clearDesition === "history"
                  ? "Are you sure you want to clear all of your chat history?"
                  : clearDesition === "directory"
                  ? "Are you sure you want to clear all of your saved directories?"
                  : "Are you sure you want to clear all of your files?"}
              </p>
              <div className={styles.confirm_button_group}>
                <button
                  className={styles.confirm_button}
                  onClick={async () => {
                    if (clearDesition === "history") {
                      await clearHistoryByUserId();
                    } else if (clearDesition === "directory") {
                      await clearFileByUserId();
                      await clearDirectoryByUserId();
                    } else if (clearDesition === "file") {
                      await clearFileByUserId();
                    }
                    setActiveConfirmPanel(false);
                    window.location.reload();
                  }}
                >
                  Yes
                </button>
                <button
                  className={styles.confirm_button}
                  onClick={() => setActiveConfirmPanel(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {isOpenSetting ? (
          <div className={styles.setting_wrapper}>
            <div className={styles.setting_card}>
              <div className={styles.setting_circle}>
                <i className={`fa-solid fa-user ${styles.big_profile}`}></i>
              </div>
              <div className={styles.setting_profile}>
                <h1 className={styles.setting_title}>Hello, Human</h1>
                <p className={styles.setting_description}>lorem</p>
              </div>
              <div className={styles.setting_container}>
                <div className={styles.setting_selection}>
                  <ul className={styles.setting_group}>
                    <li
                      onClick={() => setActiveSetting("basic")}
                      className={
                        activeSetting === "basic" ? styles.setting_active : ""
                      }
                    >
                      Basic Setting
                    </li>
                    <li
                      onClick={() => setActiveSetting("theme")}
                      className={
                        activeSetting === "theme" ? styles.setting_active : ""
                      }
                    >
                      Theme Setting
                    </li>
                    <li
                      onClick={() => setActiveSetting("clear")}
                      className={
                        activeSetting === "clear" ? styles.setting_active : ""
                      }
                    >
                      Clear Setting
                    </li>
                    {/* <li
                      onClick={() => setActiveSetting("collaboration")}
                      className={
                        activeSetting === "collaboration"
                          ? styles.setting_active
                          : ""
                      }
                    >
                      Collaboration setting
                    </li> */}
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              </div>
              <div className={styles.setting_content}>
                {activeSetting === "basic" && (
                  <ChangeProfile></ChangeProfile>
                )}
                {activeSetting === "theme" && (
                  <ChangeTheme 
                    setIsDarkMode={setIsDarkMode}
                    updateTheme={updateTheme}
                  />
                )}
                {activeSetting === "clear" && (
                  <ClearSetting
                    setClearDesition={setClearDesition}
                    setActiveConfirmPanel={setActiveConfirmPanel}
                  />
                )}
              </div>
              <i
                className={`fa-solid fa-xmark ${styles.close_setting_icon}`}
                onClick={() => setIsOpenSetting(false)}
              ></i>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Chat;
