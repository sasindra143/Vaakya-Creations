/**
 * src/context/ProductContext.jsx
 *
 * ✅ ADMIN-ONLY — stores ONLY products added through Admin panel
 * ✅ localStorage key: "vc_admin_products" (separate from any seed data)
 * ✅ Real-time sync: every add/edit/delete triggers React re-render everywhere
 * ✅ Cross-tab sync via storage events
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LS_KEY = "vc_admin_products";

export const ProductContext = createContext(null);

/* ── helpers ── */
const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (arr) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch {}
};

/* ════════════════════════════════
   PROVIDER
════════════════════════════════ */
export function ProductProvider({ children }) {
  /* Initialize from localStorage — empty if nothing yet */
  const [products, setProducts] = useState(load);

  /* Sync to localStorage on every change */
  useEffect(() => { persist(products); }, [products]);

  /* Cross-tab sync */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === LS_KEY) setProducts(load());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* ── ADD ── */
  const addProduct = useCallback((data) => {
    const product = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => {
      const next = [product, ...prev];
      persist(next);
      return next;
    });
    return product;
  }, []);

  /* ── UPDATE ── */
  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => {
      const next = prev.map((p) =>
        String(p.id) === String(id)
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      );
      persist(next);
      return next;
    });
  }, []);

  /* ── DELETE ── */
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => {
      const next = prev.filter((p) => String(p.id) !== String(id));
      persist(next);
      return next;
    });
  }, []);

  /* ── GETTERS ── */
  const getById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)) ?? null,
    [products]
  );

  const getByCategory = useCallback(
    (cat) =>
      !cat || cat === "all"
        ? products
        : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()),
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getById,
        getByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/* ── Hook ── */
export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be inside <ProductProvider>");
  return ctx;
};