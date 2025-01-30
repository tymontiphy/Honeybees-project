// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { fetchProducts } from '../api';
// // import './ProductList.css';

// const ProductList = () => {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const loadProducts = async () => {
//             try {
//                 const response = await fetchProducts();
//                 setProducts(response.data);
//             } catch (error) {
//                 console.error('Error fetching products', error);
//             }
//         };
//         loadProducts();
//     }, []);

//     return (
//         <div className="product-list-container">
//             <h2>Product List</h2>
//             <div className="product-list">
//                 {products.map(product => (
//                     <div className="product-card" key={product.id}>
//                         <h3>{product.name}</h3>
//                         <p>Price: ${product.price}</p>
//                         <p>Stock: {product.stock}</p>
//                         <div className="product-actions">
//                             <Link to={`/edit-product/${product.id}`} className="btn btn-edit">Edit</Link>
//                             <Link to={`/delete-product/${product.id}`} className="btn btn-delete">Delete</Link>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <Link to="/add-product" className="btn btn-add">Add New Product</Link>
//         </div>
//     );
// };

// export default ProductList;
