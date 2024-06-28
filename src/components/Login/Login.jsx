import React, { useState } from "react";
import { login } from "../../Services/authService";
import "./Login.css";
import { useHistory } from "react-router-dom"; 

const Login = ({ onClose, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false); // State to manage loading state of the button
    const [error, setError] = useState(null); // State to manage login errors
    const history = useHistory(); // Use useHistory hook to access history

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Enable loading state

        try {
            const loginResponse = await login(formData.email, formData.password);
            console.log("Login successful:", loginResponse);
            onLoginSuccess(); // Notify parent component of successful login
            history.push("/"); // Redirect to home page on successful login
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid credentials. Please try again."); // Set error message
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password link clicked");
        // Implement forgot password functionality (e.g., redirect to password reset page)
    };

    React.useEffect(() => {
        // Add 'modal-open' class to body when component mounts
        document.body.classList.add("modal-open");
        return () => {
            // Remove 'modal-open' class from body when component unmounts
            document.body.classList.remove("modal-open");
        };
    }, []);

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
                            {isLoading ? "Logging in..." : "Login"}
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
                    {/* Close button */}
                </div>
            </div>
        </div>
    );
};

export default Login;
