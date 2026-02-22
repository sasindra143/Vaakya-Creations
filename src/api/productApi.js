import axios from "axios";

const API = "http://localhost:5000/api/products";

export const fetchProducts = () => axios.get(API);
export const createProduct = (data) => axios.post(API, data);
export const editProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const removeProduct = (id) => axios.delete(`${API}/${id}`);