import styles from '../css/Register.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerForm = {
            email,
            password,
            passwordConfirm,
            firstName,
            lastName,
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', registerForm);
            console.log('Login successful:', response.data);
        } catch (err) {
            if (err.response) {
                setError(`Error: ${err.response.data.message || 'Register failed'}`);
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
                <div className={styles.card_image}>
                    {/* <img className={styles.main_image} src='/Main_Image.png' alt='Main' /> */}
                </div>
                <div className={styles.card_input}>
                    <h1 className={styles.main_text}>Hey, Join Us</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.input_group}>
                            {/* Row 1 - First and Last Name */}
                            <div className={styles.row}>
                                <div className={styles.column}>
                                    <label className={styles.input_label} htmlFor='firstName'>First name:</label>
                                    <input 
                                        className={styles.input_field}
                                        id='firstName' 
                                        type='text' 
                                        placeholder='First name' 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                    />
                                </div>
                                <div className={styles.column}>
                                    <label className={styles.input_label} htmlFor='lastName'>Last name:</label>
                                    <input 
                                        className={styles.input_field}
                                        id='lastName' 
                                        type='text' 
                                        placeholder='Last name' 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Row 2 - Email */}
                            <div className={styles.row}>
                                <div className={styles.fullWidth}>
                                    <label className={styles.input_label} htmlFor='email'>Email:</label>
                                    <input 
                                        className={styles.input_field}
                                        id='email' 
                                        type='email' 
                                        placeholder='Email' 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Row 3 - Passwords */}
                            <div className={styles.row}>
                                <div className={styles.column}>
                                    <label className={styles.input_label} htmlFor='password'>Password:</label>
                                    <input 
                                        className={styles.input_field}
                                        id='password' 
                                        type='password' 
                                        placeholder='Password' 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </div>
                                <div className={styles.column}>
                                    <label className={styles.input_label} htmlFor='passwordConfirm'>Password confirm:</label>
                                    <input 
                                        className={styles.input_field}
                                        id='passwordConfirm' 
                                        type='password' 
                                        placeholder='Password confirm' 
                                        value={passwordConfirm} 
                                        onChange={(e) => setPasswordConfirm(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <button className={styles.submit_button} type='submit'>Register</button>

                        {error && <div className={styles.error}>{error}</div>}
                    </form>

                    <div className={styles.or_line}>
                        <span className={styles.or_text}>OR</span>    
                    </div>
                    <span className={styles.content_text}>Already have account? Login and work with us</span>
                    <div className={styles.button_card}>
                        <div className={styles.button_container}>
                            <button className={styles.button} onClick={() => navigate('/login')}>Sign in</button>
                            <button className={`${styles.button} ${styles.active}`}>Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
