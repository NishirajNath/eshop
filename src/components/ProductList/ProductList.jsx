import React from 'react';

const ProductList = ({ products, addToCart }) => {

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product);
            // Optionally, update UI or show feedback on successful add to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <img src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
