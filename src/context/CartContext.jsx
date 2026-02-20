import { createContext, useState, useMemo, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  /* ===============================
     LOAD FROM LOCAL STORAGE
  =============================== */

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("vaakya_cart");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===============================
     SYNC TO LOCAL STORAGE
  =============================== */

  useEffect(() => {
    localStorage.setItem("vaakya_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ===============================
     ADD TO CART
  =============================== */

  const addToCart = (product) => {
    setCartItems(prev => {

      const productId = String(product.id);

      const exist = prev.find(
        item => String(item.id) === productId
      );

      if (exist) {
        return prev.map(item =>
          String(item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
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
  };

  /* ===============================
     REMOVE
  =============================== */

  const removeFromCart = (id) => {
    const productId = String(id);

    setCartItems(prev =>
      prev.filter(
        item => String(item.id) !== productId
      )
    );
  };

  /* ===============================
     UPDATE QUANTITY
  =============================== */

  const updateQuantity = (id, qty) => {

    if (qty < 1) return;

    const productId = String(id);

    setCartItems(prev =>
      prev.map(item =>
        String(item.id) === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  /* ===============================
     TOGGLE SELECT
  =============================== */

  const toggleSelect = (id) => {

    const productId = String(id);

    setCartItems(prev =>
      prev.map(item =>
        String(item.id) === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  /* ===============================
     SUBTOTAL
  =============================== */

  const subtotal = useMemo(() => {
    return cartItems
      .filter(item => item.selected)
      .reduce(
        (acc, item) =>
          acc + Number(item.price) * item.quantity,
        0
      );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};