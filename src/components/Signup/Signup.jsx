import React, { useState } from 'react';
import { registerUser as registerUserService, loginUser as loginUserService } from '../../Services/apiService'; // Import registration and login services
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        pinCode: '',
        gender: '',
        dob: '',
        termsChecked: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const { email, password, confirmPassword, address, pinCode, gender, dob, termsChecked } = formData;
        const newErrors = {};

        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!address) newErrors.address = 'Address is required';
        if (!pinCode) newErrors.pinCode = 'Pin Code is required';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!dob) newErrors.dob = 'Date of Birth is required';
        if (!termsChecked) newErrors.termsChecked = 'You must agree to the Terms and Conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const { email, password, address, pinCode, gender, dob } = formData;

        try {
            // Register user
            await registerUserService({ email, password, address, pinCode, gender, dob });

            // Attempt to log in user after successful registration
            const loginResponse = await loginUserService({ email, password });
            const { token } = loginResponse;

            // Store token and username in cookies
            cookies.set('authToken', token, { path: '/' });
            cookies.set('username', email, { path: '/' });

            alert('User Signup Successful');
            onClose(); // Close the SignupForm component after successful signup
        } catch (error) {
            console.error('Signup error:', error);
            alert('User Signup Failed');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="signup-form">
                    <form className="inform" onSubmit={handleSubmit}>
                        <label>Email Address:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}

                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        {errors.address && <p className="error-text">{errors.address}</p>}

                        <label>Pin Code:</label>
                        <input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleChange}
                            required
                        />
                        {errors.pinCode && <p className="error-text">{errors.pinCode}</p>}

                        <label>Gender:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="error-text">{errors.gender}</p>}

                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                        {errors.dob && <p className="error-text">{errors.dob}</p>}

                        <label>
                            <input
                                type="checkbox"
                                name="termsChecked"
                                checked={formData.termsChecked}
                                onChange={handleChange}
                                required
                            />
                            I agree to the Terms and Conditions
                        </label>
                        {errors.termsChecked && <p className="error-text">{errors.termsChecked}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
