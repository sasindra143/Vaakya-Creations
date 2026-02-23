/**
 * productApi.js
 * localStorage-based CRUD for products.
 * Mirrors an async API so you can swap it for a real backend later.
 */

import defaultProducts from "../data/products";

const STORAGE_KEY = "products";

/* ── Seed on first load ── */
const seedIfEmpty = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  }
};

/* ── Read all ── */
export const fetchProducts = async () => {
  seedIfEmpty();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return { data };
};

/* ── Create ── */
export const createProduct = async (product) => {
  const { data } = await fetchProducts();
  const newProduct = {
    ...product,
    _id: Date.now().toString(),
    id: Date.now(),
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    stock: Number(product.stock),
    rating: product.rating ? Number(product.rating) : 4.0,
  };
  const updated = [...data, newProduct];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { data: newProduct };
};

/* ── Update ── */
export const editProduct = async (id, product) => {
  const { data } = await fetchProducts();
  const updated = data.map((p) =>
    (p._id === id || p.id === Number(id))
      ? {
          ...p,
          ...product,
          price: Number(product.price),
          oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
          stock: Number(product.stock),
          rating: product.rating ? Number(product.rating) : p.rating,
        }
      : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { data: updated.find((p) => p._id === id || p.id === Number(id)) };
};

/* ── Delete ── */
export const removeProduct = async (id) => {
  const { data } = await fetchProducts();
  const updated = data.filter((p) => p._id !== id && p.id !== Number(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { success: true };
};