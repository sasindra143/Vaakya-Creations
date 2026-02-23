/**
 * src/context/WishlistContext.jsx
 * Persists wishlist to localStorage("vc_wishlist")
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LS_KEY = "vc_wishlist";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(wishlist)); } catch (_) {}
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) =>
      prev.find((p) => String(p.id) === String(product.id))
        ? prev
        : [...prev, { ...product, addedAt: new Date().toISOString() }]
    );
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.some((p) => String(p.id) === String(id)),
    [wishlist]
  );

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
};

export default WishlistContext;