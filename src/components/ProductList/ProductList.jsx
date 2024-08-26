import React from 'react';
import './ProductList.css';
import PropTypes from 'prop-types';
import { useCart } from '../Cart/CartContext';

const ProductList = ({ products, searchQuery }) => {
  const { cartItems, handleAddToCart, handleUpdateCartItemQuantity } = useCart();

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products
          .filter(product => product.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(product => {
            const cartItem = cartItems.items.find(item => item.id === product.product_id);
            const inCart = cartItem !== undefined;
            const quantity = inCart ? cartItem.quantity : 0;

            return (
              <div key={product.product_id} className="product-card">
                <img 
                  src={product.product_imageUrl} 
                  alt={product.product_name} 
                  className="product-image" 
                />
                <h3>{product.product_name}</h3>
                <p>Price: ₹{product.product_unitPrice.toFixed(2)}</p>
                <p>Unit: {product.product_unitOfMeasurement}</p>
                <p>Offers: {product.product_promotion}</p>
                {inCart ? (
                  <div className="quantity-controls">
                    <button 
                      className="quantity-button" 
                      onClick={() => handleUpdateCartItemQuantity(product.product_id, -1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      className="quantity-button" 
                      onClick={() => handleUpdateCartItemQuantity(product.product_id, 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart-button" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

ProductList.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

export default ProductList;
