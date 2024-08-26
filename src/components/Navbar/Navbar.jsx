import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import './Navbar.css';
import { useCart } from '../Cart/CartContext'; // Import useCart from CartContext

const Navbar = ({ toggleCart, onSearchChange, username, setUsername }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();

    const { cartItems } = useCart(); // Use CartContext to get cartItems

    const handleLogout = () => {
        cookies.remove('authToken', { path: '/' });
        cookies.remove('username', { path: '/' });
        setUsername(null);
        setShowDropdown(false);
        navigate('/');
    };

    const handleLoginSuccess = (username) => {
        setShowLogin(false);
        setUsername(username);
        cookies.set('username', username, { path: '/' });
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        setShowLogin(false);
        setShowSignup(false);
    };

    const toggleLogin = () => {
        setShowLogin(!showLogin);
        setShowSignup(false);
        setShowDropdown(false);
    };

    const toggleSignup = () => {
        setShowSignup(!showSignup);
        setShowLogin(false);
        setShowDropdown(false);
    };

    // Calculate the total number of items in the cart
    const totalCartItems = cartItems?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <div className='navbar'>
            <div className='navbar-brand'>eShop</div>
            <div className='navbar-button'>Categories</div>
            <form className="form1" onSubmit={(e) => e.preventDefault()}>
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={onSearchChange}
                />
                <button type="submit" className="btn btn-outline-success">Search</button>
            </form>
            <div className='navbar-button' onClick={toggleCart}>
                <i className="fa fa-shopping-cart"></i>
                {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
            </div>
            {username ? (
                <div className="navbar-dropdown">
                    <div className="navbar-button" onClick={toggleDropdown}>
                        {username} <i className="fa fa-caret-down"></i>
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <Link to="/account">Account</Link>
                            <Link to="/address">Address</Link>
                            <Link to="/orders">Orders</Link>
                            <Link to="/coupons">Coupons</Link>
                            <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="navbar-button">
                    <button className="btn btn-primary" onClick={toggleLogin}>Login</button>
                    <button className="btn btn-success" onClick={toggleSignup}>Signup</button>
                </div>
            )}
            {showLogin && <Login onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
        </div>
    );
};

export default Navbar;
