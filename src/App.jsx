import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getProducts } from './Services/apiService';
import Cookies from 'universal-cookie';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import ProductList from './components/ProductList/ProductList';
import Checkout from './components/Checkout/Checkout';
import Login from './components/Login/Login';
import Register from './components/Signup/Signup';
import { CartProvider, useCart } from './components/Cart/CartContext';

const cookies = new Cookies();

const App = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [username, setUsername] = useState(cookies.get('username') || '');

    useEffect(() => {
        fetchProducts(); 
    }, []);

    const fetchProducts = async () => {
        try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <CartProvider> 
            <Router>
                <div className="App">
                    <Navbar 
                        toggleCart={toggleCart} 
                        onSearchChange={handleSearchChange} 
                        username={username} 
                        setUsername={setUsername} 
                        onLogout={() => {
                            cookies.remove('authToken');
                            cookies.remove('username');
                            setUsername('');
                        }}
                    />

                    <main>  
                        {isCartOpen && <Cart toggleCart={toggleCart} />}
                        <Routes>
                            <Route 
                                path="/" 
                                element={<ProductList 
                                    products={products} 
                                    searchQuery={searchQuery}
                                />} 
                            />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>                    
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
};

export default App;
