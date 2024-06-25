import React, { useState, useEffect } from 'react';
//import { getCart } from '../services/apiService';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        async function fetchCart() {
            const customerId = '12345'; // replace with actual customer ID
            const cartItems = await getCart(customerId);
            setCart(cartItems);
        }
        fetchCart();
    }, []);

    return (
        <div>
            <h2>Your Cart</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        <h3>{item.productName}</h3>
                        <p>Quantity: {item.quantity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;