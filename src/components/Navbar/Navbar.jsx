// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsername, logout } from "../../Services/authService";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

const Navbar = ({ toggleCart, onSearchChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const username = getUsername();

    const handleLogout = () => {
        logout();
        setShowDropdown(false); // Close dropdown after logout
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className='navbar'>
            <div className='navbar-brand'>eShop</div>
            <div className='navbar-button'>Categories</div>
            <form className="form-inline my-2 my-lg-0">
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={onSearchChange}
                />
                <Link to="/" className="btn btn-outline-success my-2 my-sm-0">Search</Link>
            </form>
            <div className='navbar-button' onClick={toggleCart}><i className="fa fa-shopping-cart"></i></div>
            {username ?
                <div className="navbar-dropdown">
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
                    <Login />
                    <Signup />
                </div>
            }
        </div>
    );
};

export default Navbar;
