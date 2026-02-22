import { useState } from "react";

const categories = [
  "pattu-sarees",
  "dresses",
  "kurtis",
  "handmade-jewellery"
];

function AdminProductForm({ onAddProduct }) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "",
    rating: "",
    stock: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Please fill required fields");
      return;
    }

    onAddProduct({
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice),
      rating: Number(form.rating),
      stock: Number(form.stock)
    });

    setForm({
      name: "",
      price: "",
      oldPrice: "",
      image: "",
      category: "",
      rating: "",
      stock: "",
      description: ""
    });
  };

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit}
    >
      <h3>Add New Product</h3>

      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        name="oldPrice"
        placeholder="Old Price"
        type="number"
        value={form.oldPrice}
        onChange={handleChange}
      />

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        name="rating"
        placeholder="Rating (4.5)"
        type="number"
        step="0.1"
        value={form.rating}
        onChange={handleChange}
      />

      <input
        name="stock"
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <button type="submit">
        Add Product
      </button>

    </form>
  );
}

export default AdminProductForm;