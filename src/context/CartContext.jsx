/**
 * src/context/CartContext.jsx
 *
 * ✅ Add to cart
 * ✅ Remove from cart
 * ✅ Update quantity (max 10)
 * ✅ Toggle select
 * ✅ Clear cart
 * ✅ Cart count (for badge)
 * ✅ Subtotal (selected items only)
 * ✅ Persisted in localStorage
 * ✅ Optimized with useCallback + useMemo
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";

export const CartContext = createContext(null);

/* ===============================
   LOAD CART SAFELY
================================ */

function loadCart() {
  try {
    const raw = localStorage.getItem("vaakya_cart");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  /* ===============================
     SYNC TO LOCAL STORAGE
  =============================== */

  useEffect(() => {
    localStorage.setItem("vaakya_cart", JSON.stringify(cart));
  }, [cart]);

  /* ===============================
     ADD TO CART
  =============================== */

  const addToCart = useCallback((product) => {
    if (!product || !product.id) return;

    const productId = String(product.id);

    setCart((prev) => {
      const existing = prev.find(
        (item) => String(item.id) === productId
      );

      if (existing) {
        return prev.map((item) =>
          String(item.id) === productId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, 10)
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          id: productId,
          quantity: 1,
          selected: true
        }
      ];
    });
  }, []);

  /* ===============================
     REMOVE FROM CART
  =============================== */

  const removeFromCart = useCallback((id) => {
    const productId = String(id);

    setCart((prev) =>
      prev.filter(
        (item) => String(item.id) !== productId
      )
    );
  }, []);

  /* ===============================
     UPDATE QUANTITY
  =============================== */

  const updateQuantity = useCallback((id, qty) => {
    const productId = String(id);

    if (qty <= 0) {
      // remove if quantity becomes 0
      setCart((prev) =>
        prev.filter(
          (item) => String(item.id) !== productId
        )
      );
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === productId
          ? {
              ...item,
              quantity: Math.min(qty, 10)
            }
          : item
      )
    );
  }, []);

  /* ===============================
     TOGGLE SELECT
  =============================== */

  const toggleSelect = useCallback((id) => {
    const productId = String(id);

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  }, []);

  /* ===============================
     CLEAR CART
  =============================== */

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /* ===============================
     CART COUNT (Badge)
  =============================== */

  const cartCount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  /* ===============================
     SUBTOTAL (Selected Only)
  =============================== */

  const subtotal = useMemo(() => {
    return cart
      .filter((item) => item.selected)
      .reduce(
        (acc, item) =>
          acc + Number(item.price) * item.quantity,
        0
      );
  }, [cart]);

  /* ===============================
     CONTEXT VALUE
  =============================== */

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelect,
      clearCart
    }),
    [
      cart,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelect,
      clearCart
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}