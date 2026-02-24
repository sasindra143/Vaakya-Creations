/**
 * src/context/ProductContext.jsx
 *
 * ✅ SINGLE SOURCE OF TRUTH for all products
 * ✅ localStorage key: "vc_admin_products"
 * ✅ Real-time sync: add/edit/delete triggers re-render everywhere instantly
 * ✅ Cross-tab sync via storage events
 * ✅ Double-persist pattern: persist inside setState + useEffect (bulletproof)
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export const LS_KEY = "vc_admin_products"; // exported so AdminProducts can verify

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[ProductContext] Failed to load from localStorage:", err);
    return [];
  }
};

const persist = (arr) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  } catch (err) {
    console.error("[ProductContext] Failed to persist to localStorage:", err);
  }
};

/* ══════════════════════════════════════════
   CONTEXT
══════════════════════════════════════════ */
export const ProductContext = createContext(null);

/* ══════════════════════════════════════════
   PROVIDER
══════════════════════════════════════════ */
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const initial = load();
    console.log(`[ProductContext] Initialized with ${initial.length} products`);
    return initial;
  });

  /* ── Sync to localStorage whenever state changes ── */
  useEffect(() => {
    persist(products);
    console.log(`[ProductContext] Persisted ${products.length} products`);
  }, [products]);

  /* ── Cross-tab sync (storage event fires in OTHER tabs) ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === LS_KEY) {
        console.log("[ProductContext] Cross-tab sync triggered");
        setProducts(load());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* ══════════════════════════════════════════
     ADD
  ══════════════════════════════════════════ */
  const addProduct = useCallback((data) => {
    const product = {
      ...data,
      id:        Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => {
      const next = [product, ...prev];
      persist(next); /* double-persist: inside setState for immediate effect */
      console.log(`[ProductContext] addProduct → total: ${next.length}`, product);
      return next;
    });

    return product;
  }, []);

  /* ══════════════════════════════════════════
     UPDATE
  ══════════════════════════════════════════ */
  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => {
      const next = prev.map((p) =>
        String(p.id) === String(id)
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      );
      persist(next);
      console.log(`[ProductContext] updateProduct id=${id}`);
      return next;
    });
  }, []);

  /* ══════════════════════════════════════════
     DELETE
  ══════════════════════════════════════════ */
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => {
      const next = prev.filter((p) => String(p.id) !== String(id));
      persist(next);
      console.log(`[ProductContext] deleteProduct id=${id} → total: ${next.length}`);
      return next;
    });
  }, []);

  /* ══════════════════════════════════════════
     GETTERS
  ══════════════════════════════════════════ */
  const getById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)) ?? null,
    [products]
  );

  const getByCategory = useCallback(
    (cat) =>
      !cat || cat === "all"
        ? products
        : products.filter(
            (p) => p.category?.toLowerCase() === cat.toLowerCase()
          ),
    [products]
  );

  /* ── Memoize context value to prevent unnecessary re-renders ── */
  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getById,
      getByCategory,
      productCount: products.length,
    }),
    [products, addProduct, updateProduct, deleteProduct, getById, getByCategory]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

/* ══════════════════════════════════════════
   HOOK
══════════════════════════════════════════ */
export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductProvider>");
  return ctx;
};