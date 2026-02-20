import { useState, useEffect } from "react";
import defaultProducts from "../data/products";

const AdminProducts = () => {

  /* ======================================
     STATE
  ====================================== */

  const [form, setForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "dresses",
    stock: "",
    image: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  /* ======================================
     INITIALIZE DATABASE (RUN ONCE)
  ====================================== */

  useEffect(() => {

    const storedProducts =
      JSON.parse(localStorage.getItem("products"));

    if (!storedProducts || storedProducts.length === 0) {

      localStorage.setItem(
        "products",
        JSON.stringify(defaultProducts)
      );

    }

  }, []);

  /* ======================================
     HANDLE INPUT CHANGE
  ====================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  /* ======================================
     HANDLE IMAGE UPLOAD
  ====================================== */

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // Validate file size (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {

      setForm((prev) => ({
        ...prev,
        image: reader.result
      }));

    };

    reader.readAsDataURL(file);

  };

  /* ======================================
     HANDLE SUBMIT
  ====================================== */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Valid price is required");
      return;
    }

    if (!form.stock || Number(form.stock) < 0) {
      alert("Valid stock quantity is required");
      return;
    }

    if (!form.image) {
      alert("Please upload product image");
      return;
    }

    setLoading(true);

    const existingProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    // Prevent duplicate name in same category
    const duplicate = existingProducts.find(
      (p) =>
        p.name.toLowerCase() === form.name.toLowerCase() &&
        p.category === form.category
    );

    if (duplicate) {
      alert("Product already exists in this category");
      setLoading(false);
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || 0,
      category: form.category,
      stock: Number(form.stock),
      image: form.image,
      rating: (Math.random() * (5 - 4) + 4).toFixed(1),
      description: form.description.trim()
    };

    const updatedProducts = [
      ...existingProducts,
      newProduct
    ];

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    /* ======================================
       RESET FORM
    ====================================== */

    setForm({
      name: "",
      price: "",
      oldPrice: "",
      category: "dresses",
      stock: "",
      image: "",
      description: ""
    });

    setLoading(false);

    alert("Product Added Successfully");

  };

  /* ======================================
     RENDER
  ====================================== */

  return (
    <div className="p-10 max-w-2xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">
        Add Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow-md rounded"
      >

        {/* PRODUCT NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

        {/* OLD PRICE */}
        <input
          type="number"
          name="oldPrice"
          placeholder="Old Price"
          value={form.oldPrice}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        >
          <option value="pattu-sarees">Pattu Sarees</option>
          <option value="dresses">Dresses</option>
          <option value="kurtis">Kurtis</option>
          <option value="handmade-jewellery">Jewellery</option>
        </select>

        {/* STOCK */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
          className="border p-3 w-full rounded"
        />

        {form.image && (
          <div className="mt-2">
            <img
              src={form.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded shadow"
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          rows="4"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>
    </div>
  );
};

export default AdminProducts;