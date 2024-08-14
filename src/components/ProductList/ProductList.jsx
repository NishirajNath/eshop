import React from 'react';
import './ProductList.css';
import PropTypes from 'prop-types';

const ProductList = ({ products, cartItems, addToCart, updateCartItemQuantity, searchQuery }) => {

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      await updateCartItemQuantity(productId, 1); // Increase quantity by 1
    } catch (error) {
      console.error('Error increasing quantity:', error);
      alert('Failed to update product quantity. Please try again.');
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      await updateCartItemQuantity(productId, -1); // Decrease quantity by 1
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      alert('Failed to update product quantity. Please try again.');
    }
  };

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
                      onClick={() => handleDecreaseQuantity(product.product_id)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      className="quantity-button" 
                      onClick={() => handleIncreaseQuantity(product.product_id)}
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

// Add prop types for better validation
ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    product_imageUrl: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    product_unitPrice: PropTypes.number.isRequired,
    product_unitOfMeasurement: PropTypes.string.isRequired,
    product_promotion: PropTypes.string,
  })).isRequired,
  cartItems: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  updateCartItemQuantity: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default ProductList;
