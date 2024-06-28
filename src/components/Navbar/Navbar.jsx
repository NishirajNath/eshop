import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUsername, logout } from "../../Services/authService";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import './Navbar.css';

const Navbar = ({ toggleCart, onSearchChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [username, setUsername] = useState(getUsername());
    const dropdownRef = useRef(null); // Ref for dropdown menu

    useEffect(() => {
        // Close dropdown and login/signup on click outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setShowLogin(false);
                setShowSignup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUsername(null); // Update username state after logout
        setShowDropdown(false); // Close dropdown after logout
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        setShowLogin(false); // Close login if open
        setShowSignup(false); // Close signup if open
    };

    const toggleLogin = () => {
        setShowLogin(!showLogin); // Toggle login form visibility
        setShowSignup(false); // Close signup if open
        setShowDropdown(false); // Close dropdown if open
    };

    const toggleSignup = () => {
        setShowSignup(!showSignup); // Toggle signup form visibility
        setShowLogin(false); // Close login if open
        setShowDropdown(false); // Close dropdown if open
    };

    const handleLoginSuccess = () => {
        setUsername(getUsername()); // Update username state upon successful login
        setShowLogin(false); // Close the login form
    };

    return (
        <div className='navbar'>
            <div className='navbar-brand'>eShop</div>
            <div className='navbar-button'>Categories</div>
            <form className="form1">
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={onSearchChange}
                />
                <Link to="/" className="btn btn-outline-success">Search</Link>
            </form>
            <div className='navbar-button' onClick={toggleCart}><i className="fa fa-shopping-cart"></i></div>
            {username ?
                <div className="navbar-dropdown" ref={dropdownRef}>
                    <div className="navbar-button" onClick={toggleDropdown}>
                        {username} <i className="fa fa-caret-down"></i>
                    </div>
                    {showDropdown &&
                        <div className="dropdown-menu">
                            <Link to="/account">Account</Link>
                            <Link to="/address">Address</Link>
                            <Link to="/orders">Orders</Link>
                            <Link to="/coupons">Coupons</Link>
                            <div onClick={handleLogout}>Logout</div>
                        </div>
                    }
                </div>
                :
                <div className="navbar-button">
                    {showLogin ? <Login onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} /> : <button className="btn btn-primary" onClick={toggleLogin}>Login</button>}
                    {showSignup ? <Signup onClose={() => setShowSignup(false)} /> : <button className="btn btn-success" onClick={toggleSignup}>Signup</button>}
                </div>
            }
        </div>
    );
};

export default Navbar;
