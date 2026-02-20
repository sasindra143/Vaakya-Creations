import { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlistItems, setWishlistItems] =
    useState([]);

  const addToWishlist = (product) => {

    const exist = wishlistItems.find(
      item => item.id === product.id
    );

    if (!exist) {
      setWishlistItems(prev => [
        ...prev,
        product
      ]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  const isWishlisted = (id) => {
    return wishlistItems.some(
      item => item.id === id
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};