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
        <form onSubmit={handleSubmit}>
            <label htmlFor='email'>Email:</label>
            <input 
                id='email' 
                type='email' 
                placeholder='Input email here...' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />

            <label htmlFor='password'>Password:</label>
            <input 
                id='password' 
                type='password' 
                placeholder='Input password here...' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />

            <button type='submit'>Login</button>

            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default Login;
