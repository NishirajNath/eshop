// Login.jsx
import React from 'react';
import { login } from '../../Services/authService';

const Login = () => {
    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error
        }
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
