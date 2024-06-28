import React, { useState } from 'react';

function SignupForm({ onClose }) {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to backend
        console.log(formData);
        onClose(); // Close the SignupForm component after successful signup
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

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                        <label>Pin Code:</label>
                        <input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleChange}
                            required
                        />

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

                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />

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

                        <button type="submit">Sign Up</button>
                    </form>
                    <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
