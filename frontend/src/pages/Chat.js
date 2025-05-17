import styles from '../css/Chat.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');

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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUserMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, newUserMessage]);

        try {
            const response = await axios.post('http://localhost:3000/ai/chat', { message });
            const aiReply = { sender: 'ai', text: response.data.message || 'No reply' };

            setChatHistory(prev => [...prev, aiReply]);
            setMessage('');
            setError('');
        } catch (err) {
            let errMsg = '';
            if (err.response) {
                errMsg = `Error: ${err.response.data.message || 'Chat failed'}`;
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
        <div className={styles.chatContainer}>
            <h1>Welcome to the Chat Page!</h1>
            <div className={styles.chatBox}>
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={
                            chat.sender === 'user' ? styles.userMessage :
                            chat.sender === 'ai' ? styles.aiMessage :
                            styles.errorMessage
                        }
                    >
                        <strong>{chat.sender === 'user' ? 'You' : chat.sender === 'ai' ? 'AI' : 'Error'}:</strong> {chat.text}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.chatForm}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.chatInput}
                    required
                />
                <button type="submit" className={styles.chatButton}>Send</button>
            </form>
        </div>
    );
}

export default Chat;
