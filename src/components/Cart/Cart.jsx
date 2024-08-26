import React, { useState } from 'react';
import './Cart.css';
import { useCart } from './CartContext';

const Cart = ({ toggleCart }) => {
    const { cartItems, handleUpdateCartItemQuantity, handleRemoveFromCart, coupon, setCoupon, applyCoupon, totalAmount, discount, tax, deliveryCharge } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const handleQuantityChange = (itemId, quantityChange) => {
        console.log(`Changing quantity for product ${itemId} by ${quantityChange}`);
        handleUpdateCartItemQuantity(itemId, quantityChange);
    };

    const handleCouponApply = async () => {
        await applyCoupon(coupon);
    };

    const handleCheckout = () => {
        // Logic for checkout
    };

    return (
        <div className="cart-container">
            <button className="close-cart" onClick={toggleCart}>X</button>
            <h2>Shopping Cart</h2>
            <div className="cart-items">
                {cartItems.items.map(item => (
                    <div key={item.product_id} className="cart-item">
                        <h5>{item.product_name}</h5>
                        <div className="item-details">
                            <p>Price: ₹{item.product_unitPrice.toFixed(2)}</p>
                            <p>Unit: {item.product_unitOfMeasurement}</p>
                            <div className="quantity-controls">
                                <button 
                                  className="quantity-button" 
                                  onClick={() => handleQuantityChange(item.product_id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button 
                                  className="quantity-button" 
                                  onClick={() => handleQuantityChange(item.product_id, 1)}
                                >
                                  +
                                </button>
                            </div>
                            <button 
                              className="remove-button" 
                              onClick={() => handleRemoveFromCart(item.product_id)}
                            >
                              Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button onClick={handleCouponApply}>Apply Coupon</button>
                <p>Discount: ₹{discount}</p>
                <p>Sub Total: ₹{cartItems.items.reduce((sum, item) => sum + item.product_unitPrice * item.quantity, 0).toFixed(2)}</p>
                <p>Tax: ₹{tax.toFixed(2)}</p>
                <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
                <p>Total: ₹{totalAmount.toFixed(2)}</p>
                <input 
                  type="text" 
                  placeholder="Enter delivery address" 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />               
            </div>
            <button className='Checkout' onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
