import React, { useState, useEffect } from 'react';
import './Cart.css';
import { getCart } from '../../Services/apiService';

const Cart = ({ toggleCart }) => {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [tip, setTip] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        async function fetchCart() {
            const cartItems = await getCart(); 
            setCart(cartItems.items);
        }
        fetchCart();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cart, discount, tip]);

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedCart = cart.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0);
        setCart(updatedCart);
    };

    const handleCouponApply = async () => {
        const discountValue = await applyCoupon(coupon); // Implement applyCoupon in your API service
        setDiscount(discountValue);
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = subtotal * 0.18; // 18% GST (9% CGST + 9% SGST)
        const deliveryCharge = subtotal > 100 ? 0 : 35;
        const total = subtotal + tax + deliveryCharge - discount + parseFloat(tip);
        setTotalAmount(total);
    };

    const handlePayment = () => {
        alert('Proceeding to payment');
    };

    return (
        <div className="cart">
            <button className="cart-close" onClick={toggleCart}>×</button>
            <h2>Your Cart</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.product_UPC}>
                        <h5>{item.product_name}</h5>
                        <p>Cost per unit: ₹{item.product_unitPrice}</p>
                        <div>
                            <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}>-</button>
                            <span> Quantity: {item.quantity} </span>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <p>Total: ₹{item.product_unitPrice * item.quantity}</p>
                    </li>
                ))}
            </ul>
            <div>
                <label>
                    Enter Coupon/Offer Code:
                    <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                </label>
                <button onClick={handleCouponApply}>Apply Coupon</button>
            </div>2
            <p>Discount: ₹{discount}</p>
            <p>Tax (18% GST): ₹{(totalAmount * 0.18).toFixed(2)}</p>
            <p>Delivery Charge: ₹{totalAmount > 100 ? 'Free' : '35'}</p>
            <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
            <div>
                <label>
                    Delivery Address:
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                </label>
                <button onClick={() => alert('Locate on Map')}>Locate on Map</button>
            </div>
            <div>
                <label>
                    Tip for Delivery Person:
                    <input
                        type="number"
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handlePayment}>Make Payment</button>
        </div>
    );
};

export default Cart;
