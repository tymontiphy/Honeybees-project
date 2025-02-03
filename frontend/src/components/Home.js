import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';  // Import custom CSS

const API_URL = 'http://localhost:5000/products';  // Adjust the backend URL


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
    const [editProductId, setEditProductId] = useState(null);
    const [editProduct, setEditProduct] = useState({ name: '', price: '', stock: '' });
    const [cart, setCart] = useState([]);  // Cart state to store added items

    // Fetch products when the component is mounted
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data); // Update state with the fetched products
            } catch (err) {
                setError('Error fetching products');
                console.error(err);
            } finally {
                setLoading(false);  // Set loading to false after data is fetched
            }
        };

        loadProducts();  // Load products on mount
    }, []);

    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`${API_URL}/${productId}`);
            alert(response.data.message);
            setProducts(products.filter(product => product.id !== productId));
        } catch (err) {
            alert('Error deleting product');
            console.error(err);
        }
    };

    // Add product to the cart
    const addToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }]); // Add product with default quantity 1
    };



    const placeOrder = async () => {
        try {
            const orderData = { user_id: 1 }; // Or get the actual user_id dynamically
            console.log('Placing order with data:', orderData); // Log request data
    
            const orderResponse = await axios.post('http://localhost:5000/orders', orderData);
            console.log("Order placed:", orderResponse.data);
            // Further processing...
        } catch (err) {
            console.error('Error placing order:', err.response ? err.response.data : err.message);
            alert('Error placing order');
        }
    };


    const addItemToOrder = async (orderId, productId, quantity, specialInstructions) => {
        try {
            const orderItemData = {
                order_id: orderId,  // Ensure the correct order_id
                product_id: productId,  // Ensure the correct product_id
                quantity: quantity,  // Ensure the correct quantity
                special_instructions: specialInstructions  // Optional special instructions
            };
    
            const response = await axios.post('http://localhost:5000/order_items', orderItemData);
            console.log('Order item added:', response.data);
            alert('Item added to the order!');
        } catch (err) {
            console.error('Error adding order item:', err.response ? err.response.data : err.message);
            alert('Error adding item to the order');
        }
    };    
    




    // Handle add product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, newProduct);
            alert(response.data.message);  // Notify the user of success
            setProducts([...products, { ...newProduct, id: response.data.id }]); // Update the UI with the new product
            setNewProduct({ name: '', price: '', stock: '' }); // Reset form
        } catch (err) {
            alert('Error adding product');
            console.error(err);
        }
    };

    // Handle edit product form
    const handleEditProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        setEditProductId(productId);
        setEditProduct({ name: product.name, price: product.price, stock: product.stock });
    };

    // Handle save edited product
    const handleSaveEditProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/${editProductId}`, editProduct);
            alert(response.data.message);  // Notify the user of success
            setProducts(products.map(p => p.id === editProductId ? { ...p, ...editProduct } : p)); // Update the product in UI
            setEditProductId(null);
            setEditProduct({ name: '', price: '', stock: '' });
        } catch (err) {
            alert('Error updating product');
            console.error(err);
        }
    };

    return (
        <div className="home-container">
            <h1 className="heading">Explore Our Honey Products</h1>

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="product-list">
                    {products.map(product => (
                        <div className="product-card" key={product.id}>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">${product.price}</p>
                            <p className="product-stock">{product.stock} in stock</p>
                            <button className="buy-button" onClick={() => addToCart(product)}>Add to Cart</button>
                            <button className="edit-button" onClick={() => handleEditProduct(product.id)}>Edit</button>
                            <button className="delete-button" onClick={() => deleteProduct(product.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Cart Summary */}
            <div className="cart-summary">
                <h2>Your Cart</h2>
                {cart.length > 0 ? (
                    <>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index}>{item.name} - Quantity: {item.quantity}</li>
                            ))}
                        </ul>
                        <button className="place-order-button" onClick={placeOrder}>Place Order</button>
                        {/* <button className='add-item-button' onClick={() => addItemToOrder(1, 1, 2, 'Urgent delivery')}>Add Item to Order</button> */}
                        <button className='add-item-button' onClick={() => addItemToOrder(1, 2, 1, 'Special instructions')}>Add Item to Order</button>
                    </>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>

            {/* Add Product Form */}
            <div className="add-product-form">
                <h2>Add a New Product</h2>
                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            {/* Edit Product Form */}
            {editProductId && (
                <div className="edit-product-form">
                    <h2>Edit Product</h2>
                    <form onSubmit={handleSaveEditProduct}>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={editProduct.stock}
                            onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                        />
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Home;
