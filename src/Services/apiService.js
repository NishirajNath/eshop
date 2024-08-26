import Cookies from 'universal-cookie';

const cookies = new Cookies();
const baseURL = "https://fd8e7104-4b5a-480d-9d0f-376e42f9d735-00-t5d9o4q0p0b.pike.replit.dev:3000/";

// Get token from cookies
const getTokenFromCookies = () => cookies.get('authToken');

// Function to handle fetch requests with optional authentication
const fetchWithAuth = async (url, options = {}) => {
    const token = getTokenFromCookies();

    // Add token to headers if available
    options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined,
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 401) {
                // Handle unauthorized access (e.g., re-login)
                console.error('Unauthorized access. Please log in.');
                cookies.remove('authToken');
                cookies.remove('username');
                // You can also redirect to the login page or perform other actions here.
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// API Functions

export const getProducts = async () => {
    try {
        const response = await fetch(`${baseURL}products/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const addToCart = async (product) => {
    try {
        const userEmail = cookies.get('username'); // Get the user email from cookies

        if (!userEmail) {
            throw new Error('User email is not found in cookies.');
        }

        const response = await fetch(`${baseURL}carts/add-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userEmail, item: product }), // Use userEmail as userId
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // The response might contain a success message or the updated cart; handle accordingly
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
};

export const removeFromCart = async (productId) => {
    try {
        const userEmail = cookies.get('username'); // Get the user email from cookies

        if (!userEmail) {
            throw new Error('User email is not found in cookies.');
        }

        const response = await fetch(`${baseURL}carts/remove-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userEmail, productId }), // Send userEmail and productId
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // The response might contain a success message or the updated cart; handle accordingly
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
    }
};

// Update item quantity in the cart
export const updateCartItemQuantity = async (productId, quantityChange) => {
    const userId = cookies.get('username');
    try {
        const response = await fetch(`${baseURL}carts/update-item/${productId}`, {
            method: 'PATCH', // Use PATCH to partially update the resource
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, quantityChange }), // Include userId with the request
        });

        if (!response.ok) {
            throw new Error('Failed to update cart item quantity');
        }

        const data = await response.json(); // Retrieve the response data

        // Process the updated cart details as needed
        return data; // Return the updated cart data or status if needed
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
};


export const checkout = async (order) => {
    try {
        return fetchWithAuth(`${baseURL}orders/create`, {
            method: 'POST',
            body: JSON.stringify(order),
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${baseURL}users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || `Registration failed with status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await fetch(`${baseURL}users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || `Login failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const userEmail = cookies.get('username');
        if (!userEmail) {
            throw new Error('No user email found in cookies.');
        }

        return fetchWithAuth(`${baseURL}users/${userEmail}`);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const fetchCartItemsForUser = async () => {
    try {
        // Get the user's email from cookies
        const userEmail = cookies.get('username');
        if (!userEmail) {
            throw new Error('No user email found in cookies.');
        }

        // Construct the URL to fetch the cart items for the user
        const response = await fetch(`${baseURL}carts/${userEmail}`);

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        // Parse the response JSON to get the cart items
        const cartItems = await response.json();
        return cartItems;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const getCart = async () => {
    try {
        const userEmail = cookies.get('username');

        if (!userEmail) {
            throw new Error('No user email found in cookies.');
        }
        
        const response = await fetch(`${baseURL}carts/${userEmail}`);

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();
        return cartItems; // Ensure this matches the shape of cart data expected in Cart component
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
};

export const applyCoupon = async (couponCode) => {
    try {
        const response = await fetch('https://your-api-url/coupons/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('authToken')}`
            },
            body: JSON.stringify({ couponCode })
        });

        if (!response.ok) {
            throw new Error('Failed to apply coupon');
        }

        const { discount } = await response.json();
        return discount;
    } catch (error) {
        console.error('Error applying coupon:', error);
        return 0;
    }
};

