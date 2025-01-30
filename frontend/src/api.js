import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const registerUser = async (data) => {
    return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data) => {
    return axios.post(`${API_URL}/login`, data);
};

export const fetchProducts = async () => {
    return axios.get(`${API_URL}/products`);
};
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/products';  // Change this URL to your backend URL

// // Function to fetch all products from the backend
// export const fetchProducts = async () => {
//     try {
//         const response = await axios.get(API_URL);  // Send a GET request to the backend to fetch products
//         return response;  // Return the API response (which contains the list of products)
//     } catch (error) {
//         console.error('Error fetching products from backend:', error);
//         throw error;  // Re-throw the error to be handled by the calling component
//     }
// };
// export const registerUser = async (data) => {
//     return axios.post(`${API_URL}/register`, data);
// };

// export const loginUser = async (data) => {
//     return axios.post(`${API_URL}/login`, data);
// };