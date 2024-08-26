import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchCartItemsForUser, addToCart, removeFromCart, updateCartItemQuantity as updateCartItemQuantityService } from '../../Services/apiService';
import Cookies from 'universal-cookie';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const cookies = new Cookies();
    const [cartItems, setCartItems] = useState({ items: [] });
    const [username, setUsername] = useState(cookies.get('username') || '');
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [tax, setTax] = useState(0);

    useEffect(() => {
        if (username) {
            fetchCartItems(); 
        }
    }, [username]);

    useEffect(() => {
        calculateTotalAmount();
    }, [cartItems, discount]);

    const fetchCartItems = async () => {
        try {
            const fetchedCartItems = await fetchCartItemsForUser();
            setCartItems(fetchedCartItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const calculateTotalAmount = () => {
        const subTotal = cartItems.items.reduce((sum, item) => sum + item.product_unitPrice * item.quantity, 0);
        const deliveryCharge = subTotal < 150 ? 100 : 0; // Adjust based on your needs
        const tax = subTotal * 0.18; // Assuming a flat 18% tax rate

        const discountedTotal = subTotal - discount + deliveryCharge + tax;
        setTotalAmount(discountedTotal);
        setDeliveryCharge(deliveryCharge);
        setTax(tax);
    };

    const handleAddToCart = async (product) => {
        try {
            if (username) {
                await addToCart(product);
                const existingItem = cartItems.items.find(item => item.product_id === product.product_id);

                if (existingItem) {
                    setCartItems({
                        items: cartItems.items.map(item => 
                            item.product_id === product.product_id 
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

    const handleUpdateCartItemQuantity = async (product_id, quantityChange) => {
        try {
            if (username) {
                const existingItem = cartItems.items.find(item => item.product_id === product_id);
                const newQuantity = (existingItem ? existingItem.quantity : 0) + quantityChange;

                if (newQuantity >= 0) {
                    await updateCartItemQuantityService(product_id, quantityChange);

                    const updatedCartItems = cartItems.items
                        .map(item => 
                            item.product_id === product_id 
                            ? { ...item, quantity: newQuantity } 
                            : item
                        )
                        .filter(item => item.quantity > 0);

                    setCartItems({ items: updatedCartItems });

                    if (newQuantity === 0) {
                        await removeFromCart(product_id);
                    }
                }
            } else {
                alert('Please log in to update cart items.');
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };

    const handleRemoveFromCart = async (product_id) => {
        try {
            await removeFromCart(product_id);
            setCartItems({
                items: cartItems.items.filter(item => item.product_id !== product_id)
            });
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const applyCoupon = async (couponCode) => {
        // Define your coupon logic
        const discountValue = 10; // For example, a ₹10 discount
        setDiscount(discountValue);
    };

    return (
        <CartContext.Provider value={{ cartItems, handleAddToCart, handleUpdateCartItemQuantity, handleRemoveFromCart, setUsername, coupon, setCoupon, applyCoupon, totalAmount, discount, tax, deliveryCharge }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
