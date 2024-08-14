import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { loginUser as loginUserService } from '../../Services/apiService'; // Import loginUser service
import './Login.css'; // Ensure you have a CSS file for styling

const cookies = new Cookies(); // Initialize cookies instance

const Login = ({ onClose, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await loginUserService(formData); // Call the login API
            const token = response.token; // Assuming the backend returns a JWT token
            const username = response.email; // Assuming the backend returns the username

            // Save token and username in cookies for later use
            cookies.set('authToken', token, { path: '/' });
            cookies.set('username', username, { path: '/' });

            // Callback function to notify parent component of successful login
            if (onLoginSuccess) onLoginSuccess(username); // Pass username to the parent

            navigate('/'); // Redirect to home page on successful login
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Redirect to forgot password page
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="login-form">
                    <form onSubmit={handleSubmit}>
                        <label>Email Address:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="forgot-password-link" onClick={handleForgotPassword}>
                            <span>Forgot Password?</span>
                        </div>

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </form>

                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
