import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import ProductList from "./components/ProductList/ProductList";
import Checkout from "./components/Checkout/Checkout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getProducts, addToCart } from "./Services/apiService";
import { getUsername } from "./Services/authService";

export default function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchProducts();
        setUsername(getUsername()); // Initialize username state
    }, []); // Fetch products and username on component mount

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

    const handleAddToCart = async (product) => {
        try {
            await addToCart({ productId: product.id, quantity: 1 });
            // Optionally, update UI or show feedback on successful add to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Router>
            <div className="App">
                <Navbar toggleCart={toggleCart} onSearchChange={handleSearchChange} username={username} />
                <main>
                    <Routes>
                        <Route path="/" element={<ProductList products={filteredProducts} addToCart={handleAddToCart} />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                    {isCartOpen && <Cart />}
                </main>
            </div>
        </Router>
    );
}
