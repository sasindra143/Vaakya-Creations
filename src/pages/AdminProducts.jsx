import { useState, useEffect } from "react";

const categories = [
  "pattu-sarees",
  "fancy-sarees",
  "sarees",
  "kurtis",
  "dresses",
  "tops",
  "blouses",
  "handmade-jewellery"
];

function AdminProducts() {

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  const [preview, setPreview] = useState(null);

  /* ===============================
     LOAD PRODUCTS
  =============================== */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  /* ===============================
     SAVE PRODUCTS
  =============================== */
  const saveProducts = (updated) => {
    localStorage.setItem(
      "products",
      JSON.stringify(updated)
    );
    setProducts(updated);
  };

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ===============================
     HANDLE IMAGE UPLOAD
  =============================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setForm({
        ...form,
        image: reader.result
      });
    };

    reader.readAsDataURL(file);
  };

  /* ===============================
     ADD PRODUCT
  =============================== */
  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select category");
      return;
    }

    if (!form.image) {
      alert("Please upload image");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    const updated = [...products, newProduct];
    saveProducts(updated);

    setForm({
      name: "",
      price: "",
      category: "",
      stock: "",
      image: ""
    });

    setPreview(null);
  };

  /* ===============================
     DELETE PRODUCT
  =============================== */
  const handleDelete = (id) => {
    const updated =
      products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Manage Products
      </h1>

      {/* ================= ADD FORM ================= */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 shadow rounded mb-8 grid gap-4"
      >

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="border p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="border p-2"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2"
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Add Product
        </button>

      </form>

      {/* ================= PRODUCT TABLE ================= */}
      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">

              <td className="p-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>

              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>

              <td>
                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default AdminProducts;