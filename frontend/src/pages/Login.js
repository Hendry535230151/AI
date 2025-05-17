import styles from '../css/Login.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginForm = {
            email,
            password,
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/login', loginForm);
            console.log('Login successful:', response.data);
            navigate('/chat');
        } catch (err) {
            if (err.response) {
                setError(`Error: ${err.response.data.message || 'Login failed'}`);
            } else if (err.request) {
                setError('No response from server.');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (    
        <div className={styles.card_wrap}>
            <div className={styles.card_container}>
                <div className={styles.card_input}>
                    <h1 className={styles.main_text}>Hello User</h1>
                    <form onSubmit={handleSubmit}>
                        <label className={styles.input_label} htmlFor='email'>Email:</label>
                        <input 
                            className={styles.input_field}
                            id='email' 
                            type='email' 
                            placeholder='Input email here...' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />

                        <label className={styles.input_label} htmlFor='password'>Password:</label>
                        <input 
                            className={styles.input_field}
                            id='password' 
                            type='password' 
                            placeholder='Input password here...' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        
                        <a className={styles.forgot_password} href='_'>Forgot password</a>

                        <button className={styles.submit_button} type='submit'>Login</button>

                        {error && <div className={styles.error}>{error}</div>}
                        
                    </form>

                    <div className={styles.or_line}>
                        <span className={styles.or_text}>OR</span>    
                    </div>
                    <span className={styles.content_text}>Bergabunglah bersama komunitas kami dan nikmati berbagai fitur eksklusif.</span>
                    <div className={styles.button_card}>
                        <div className={styles.button_container}>
                            <button className={`${styles.button} ${styles.active}`}>Sign in</button>
                            <button className={styles.button} onClick={() => navigate('/register')}>Sign up</button>
                        </div>
                    </div>
                </div>
                <div className={styles.card_image}>
                    {/* <img className={styles.main_image} src='/Main_Image.png' alt='Main' /> */}
                </div>
            </div>
        </div>
    );
}

export default Login;
