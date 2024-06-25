import React from 'react';
//import { checkout } from '../services/apiService';

const Checkout = () => {
    const handleCheckout = async () => {
        const order = {
            customerId: '12345', // replace with actual customer ID
            items: [/* items to be checked out */],
            totalAmount: 100, // replace with actual amount
        };
        await checkout(order);
    };

    return (
        <div>
            <h2>Checkout</h2>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
    );
};

export default Checkout;