import styles from '../css/Register.module.css';
import ErrorMessage from '../components/ErrorMessage.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const registerForm = {
            email,
            password,
            passwordConfirm,
            firstName,
            lastName,
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', registerForm);
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
                <div className={styles.main_text_group}>
                    {step === 2 && (
                        <i className={`fa-solid fa-arrow-left ${styles.back_icon}`} onClick={() => setStep(1)} ></i>
                    )}
                    <h1 className={styles.main_text}>Ready to join?</h1>
                </div>

                {step === 1 && (
                    <form className={styles.input_form} onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <label className={styles.input_label} htmlFor="firstName">First Name</label>
                    <input
                        className={styles.input_field}
                        id="firstName"
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label className={styles.input_label} htmlFor="lastName">Last Name</label>
                    <input
                        className={styles.input_field}
                        id="lastName"
                        type="text"
                        placeholder="Your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <button type="submit" className={styles.input_button}>Continue</button>
                    </form>
                )}

                {step === 2 && (
                    <>
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
                            <label className={styles.input_label} htmlFor='passwordConf'>Password confirm</label>
                            <input 
                                className={styles.input_field}
                                id='passwordConf' 
                                type='password' 
                                placeholder='Input password confirm here...' 
                                value={passwordConfirm} 
                                onChange={(e) => setPasswordConfirm(e.target.value)} 
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
                                <button type='submit' className={styles.input_button}>Logup</button>
                            )}
                        </form>
                    </>
                )}
                <div className={styles.button_group}>
                    <button className={styles.button} onClick={() => navigate('/login')}>Sign-in</button>
                    <button className={`${styles.button} ${styles.active}`}>Sign-up</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
