import styles from '../css/Chat.module.css';
import fetchIdFromToken from '../utils/jwt-decoder';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [droppedFile, setDroppedFile] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setDroppedFile(file);
            setChatHistory(prev => [...prev, {
                sender: 'user',
                text: `📎 File ready to send: ${file.name}`
            }]);
            e.dataTransfer.clearData();
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:3000/ai/history');
                const chats = res.data.data.map(chat => ({
                    sender: chat.sender,
                    text: chat.text
                }));
                setChatHistory(chats);
            } catch (err) {
                setError('Failed to load chat history');
            }
        };

        fetchHistory();

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

        window.addEventListener('dragover', handleWindowDragOver);
        window.addEventListener('drop', handleWindowDrop);
        window.addEventListener('dragleave', handleWindowDragLeave);

        return () => {
            window.removeEventListener('dragover', handleWindowDragOver);
            window.removeEventListener('drop', handleWindowDrop);
            window.removeEventListener('dragleave', handleWindowDragLeave);
            clearTimeout(dragLeaveTimeout);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = fetchIdFromToken();
        const userMessage = droppedFile
            ? `📎 ${droppedFile.name} — ${message}`
            : message;

        setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);

        try {
            if (droppedFile) {
                const formData = new FormData();
                formData.append('file', droppedFile);
                formData.append('description', message);
                formData.append('userId', userId);
                formData.append('directoryId', 1);

                const response = await axios.post('http://localhost:3000/files/create', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    text: `✅ File uploaded: ${response.data.message || droppedFile.name}`
                }]);
                setDroppedFile(null);
            } else {
                const response = await axios.post('http://localhost:3000/ai/chat', {
                    message,
                    userId
                });

                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    text: response.data.message || 'No reply'
                }]);
            }

            setMessage('');
            setError('');
        } catch (err) {
            let errMsg = '';
            if (err.response) {
                errMsg = `Error: ${err.response.data.message || 'Request failed'}`;
            } else if (err.request) {
                errMsg = 'No response from server.';
            } else {
                errMsg = `Error: ${err.message}`;
            }

            setError(errMsg);
            setChatHistory(prev => [...prev, { sender: 'error', text: errMsg }]);
        }
    };

    return (
        <div className={styles.chat_container}>
            <div className={styles.sidebar}>
                asdf
            </div>
            <div className={styles.chat_area}>
                <h1 className={styles.main_text}>AInizer</h1>
                <div className={styles.chat_box_wrapper}>
                    <div className={styles.chat_box}>
                        {chatHistory.map((chat, index) => (
                            <div
                            key={index}
                            className={
                                chat.sender === 'user' ? styles.user_message :
                                chat.sender === 'ai' ? styles.ai_message :
                                styles.errorMessage
                            }
                            >
                                <strong>{chat.sender === 'user' ? 'You' : chat.sender === 'ai' ? 'AI' : 'Error'}:</strong> {chat.text}
                            </div>
                        ))}
                    </div>
                </div>

                {isDragging && (
                    <div
                        className={styles.drop_zone}
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <p>{droppedFile ? `File ready: ${droppedFile.name}` : 'Drop your file here'}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.chat_form}>
                    <div className={styles.input_wrapper}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={droppedFile ? 'Enter a description for the file...' : 'Type your message...'}
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
