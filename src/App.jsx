import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getProducts, addToCart, removeFromCart, registerUser as registerUserService, loginUser as loginUserService, fetchCartItemsForUser, updateCartItemQuantity as updateCartItemQuantityService } from './Services/apiService';
import Cookies from 'universal-cookie';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import ProductList from './components/ProductList/ProductList';
import Checkout from './components/Checkout/Checkout';
import Login from './components/Login/Login';
import Register from './components/Signup/Signup';

const cookies = new Cookies();

export default function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [username, setUsername] = useState(cookies.get('username') || '');
    const [cartItems, setCartItems] = useState({ items: [] });

    useEffect(() => {
        fetchProducts(); 
    }, []);

    useEffect(() => {
        if (username) {
            fetchCartItems(); 
        }
    }, [username]);

    const fetchProducts = async () => {
        try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCartItems = async () => {
        try {
            const fetchedCartItems = await fetchCartItemsForUser();
            setCartItems(fetchedCartItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleAddToCart = async (product) => {
        try {
            if (username) {
                await addToCart(product);
                const existingItem = cartItems.items.find(item => item.id === product.product_id);

                if (existingItem) {
                    setCartItems({
                        items: cartItems.items.map(item => 
                            item.id === product.product_id 
                            ? { ...item, quantity: item.quantity + 1 } 
                            : item
                        )
                    });
                } else {
                    setCartItems({
                        items: [...cartItems.items, { ...product, quantity: 1 }]
                    });
                }
            } else {
                alert('Please log in to add items to your cart.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleUpdateCartItemQuantity = async (productId, quantityChange) => {
        try {
            if (username) {
                // Calculate the new quantity
                const existingItem = cartItems.items.find(item => item.id === productId);
                const newQuantity = (existingItem ? existingItem.quantity : 0) + quantityChange;

                // Check if quantity is valid and update cart item quantity
                if (newQuantity >= 0) {
                    await updateCartItemQuantityService(productId, newQuantity);

                    // Update cart items state
                    const updatedCartItems = cartItems.items
                        .map(item => 
                            item.id === productId 
                            ? { ...item, quantity: newQuantity } 
                            : item
                        )
                        .filter(item => item.quantity > 0); // Remove items with non-positive quantity

                    setCartItems({ items: updatedCartItems });

                    // If the new quantity is zero, remove the item from the server as well
                    if (newQuantity === 0) {
                        await removeFromCart(productId);
                    }
                }
            } else {
                alert('Please log in to update cart items.');
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRegister = async (userData) => {
        try {
            await registerUserService(userData);
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await loginUserService({ email, password });
            const { token, email: userEmail } = response;
            cookies.set('authToken', token, { path: '/' });
            cookies.set('username', userEmail, { path: '/' });
            setUsername(userEmail); // Update the state with the username
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = () => {
        cookies.remove('authToken');
        cookies.remove('username');
        setUsername('');
    };

    return (
        <Router>
            <div className="App">
                <Navbar 
                    toggleCart={toggleCart} 
                    onSearchChange={handleSearchChange} 
                    username={username} 
                    setUsername={setUsername} 
                    onLogout={handleLogout}
                    cartItems={cartItems}
                />

                <main>  
                    {isCartOpen && <Cart 
                        cartItems={cartItems} 
                        setCartItems={setCartItems} 
                        toggleCart={toggleCart}
                        handleUpdateCartItemQuantity={handleUpdateCartItemQuantity}
                    />}
                    <Routes>
                        <Route path="/cart" element={<Cart 
                            cartItems={cartItems}
                            setCartItems={setCartItems}
                            toggleCart={toggleCart}
                            handleUpdateCartItemQuantity={handleUpdateCartItemQuantity}
                        />} />
                        <Route 
                            path="/" 
                            element={<ProductList 
                                products={products} 
                                cartItems={cartItems} 
                                addToCart={handleAddToCart} 
                                updateCartItemQuantity={handleUpdateCartItemQuantity}
                                searchQuery={searchQuery}
                            />} 
                        />                        
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    </Routes>                    
                </main>
            </div>
        </Router>
    );
}
