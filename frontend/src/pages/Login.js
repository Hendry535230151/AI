import styles from '../css/Login.module.css';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginForm = { email, password };

        try {
            const response = await axios.post('http://localhost:3000/auth/login', loginForm);
            console.log('Login successful:', response.data);

            const token = response.data.token;
            localStorage.setItem('token', token);

            setTimeout(() => {
                navigate('/chat');
            }, 5000);
        } catch (err) {
            setTimeout(() => {
                setIsLoading(false);
                if (err.response) {
                    setError(err.response.data.message);
                } else if (err.request) {
                    setError('No response from server.');
                } else {
                    setError(err.message);
                }
            }, 3000);
        }
    };

    return (
        <div className={styles.main_container}>
            <header className={styles.header}>
                <h1 className={styles.logo}>AInizer</h1>
            </header>
            <div className={styles.card_container}>
                <h1 className={styles.main_text}>Hello again</h1>

                <form onSubmit={handleSubmit} className={styles.input_form}>
                    <label className={styles.input_label} htmlFor='email'>Email</label>
                    <input 
                        className={styles.input_field}
                        id='email' 
                        type='text' 
                        placeholder='Input email here...' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />

                    <label className={styles.input_label} htmlFor='password'>Password</label>
                    <input 
                        className={styles.input_field}
                        id='password' 
                        type='password' 
                        placeholder='Input password here...' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />   
                    { error ? (
                        <>
                            <span className={styles.error_message}>
                                <i className={`${styles.error_icon} fa-solid fa-circle-exclamation`}></i>
                                {error}
                            </span>
                        </>
                    ) : (
                        <></>
                    )}  

                    { isLoading ? (
                        <div className={styles.input_button}>
                            <div className={styles.spinner}></div>
                        </div>
                    ) : (
                        <button type='submit' className={styles.input_button} disabled={isLoading}>Login</button>
                    )}
                </form>

                <span className={styles.sub_text}>
                    Forgot your password? <a className={styles.forgot_password}>forgot password</a>
                </span>

                <div className={styles.button_group}>
                    <button className={`${styles.button} ${styles.active}`}>Sign-in</button>
                    <button className={styles.button} onClick={() => navigate('/register')} disabled={isLoading}>Sign-up</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
