import '../css/Login.css';
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
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
        <div className='card_wrap'>
            <div className='card_container'>
                <div className="card_input">
                    <h1 className='main_text'>Hello User</h1>
                    <form onSubmit={handleSubmit}>
                        <label className='input_label' htmlFor='email'>Email:</label>
                        <input 
                            className='input_field'
                            id='email' 
                            type='email' 
                            placeholder='Input email here...' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            />

                        <label className='input_label' htmlFor='password'>Password:</label>
                        <input 
                            className='input_field'
                            id='password' 
                            type='password' 
                            placeholder='Input password here...' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            />
                        
                        <a className="forgot_password" href='_'>Forgot password</a>

                        <button className='submit_button' type='submit'>Login</button>

                        {error && <div className="error">{error}</div>}
                        
                    </form>

                    <div className='or_line'>
                        <span className='or_text'>OR</span>    
                    </div>
                        <span className='content_text'>Bergabunglah bersama komunitas kami dan nikmati berbagai fitur eksklusif.</span>
                    <div className='button_card'>
                        <div className='button_container'>
                            <button className='button active'>Sign in</button>
                            <button className='button'>Sign up</button>
                        </div>
                    </div>
                </div>
                <div className='card_image'>
                    {/* <img className='main_image' src='/Main_Image.png' alt='Main' /> */}
                </div>
            </div>
        </div>
    );
}

export default Login;
