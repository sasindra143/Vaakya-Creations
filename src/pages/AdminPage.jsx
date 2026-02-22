import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  editProduct,
  removeProduct,
} from "../api/productApi";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "",
    rating: "",
    stock: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await fetchProducts();
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await editProduct(editId, form);
      setEditId(null);
    } else {
      await createProduct(form);
    }

    setForm({
      name: "",
      price: "",
      oldPrice: "",
      image: "",
      category: "",
      rating: "",
      stock: "",
      description: "",
    });

    loadProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    await removeProduct(id);
    loadProducts();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Panel</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="oldPrice" placeholder="Old Price" value={form.oldPrice} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;