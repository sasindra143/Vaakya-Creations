import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import QuickViewModal from "../QuickView/QuickViewModal";
import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart } = useContext(CartContext);
  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted
  } = useContext(WishlistContext);

  const [selectedSize, setSelectedSize] =
    useState(product.sizes?.[0] || "");

  const [showQuickView, setShowQuickView] =
    useState(false);

  /* ==========================================
     ADD TO CART
  ========================================== */
  const handleAddToCart = () => {

    addToCart({
      ...product,
      size: selectedSize
    });
  };

  /* ==========================================
     WISHLIST TOGGLE
  ========================================== */
  const handleWishlist = () => {

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <div className="product-card">

        {/* IMAGE WRAPPER */}
        <div className="product-image-wrapper">

          <img
            src={product.image}
            alt={product.name}
            className="product-image main-img"
          />

          {/* Hover image swap */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt="hover"
              className="product-image hover-img"
            />
          )}

          {/* Wishlist */}
          <div
            className={`wishlist-heart ${
              isWishlisted(product.id)
                ? "active"
                : ""
            }`}
            onClick={handleWishlist}
          >
            ♥
          </div>

          {/* Quick View */}
          <button
            className="quick-view-btn"
            onClick={() => setShowQuickView(true)}
          >
            Quick View
          </button>

        </div>

        {/* INFO */}
        <div className="product-info">

          <h3 className="product-title">
            {product.name}
          </h3>

          <div className="product-price">
            ₹{product.price}
          </div>

          {/* Sizes */}
          {product.sizes && (
            <div className="size-selector">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={
                    selectedSize === size
                      ? "size-btn active"
                      : "size-btn"
                  }
                  onClick={() =>
                    setSelectedSize(size)
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Add Cart */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() =>
            setShowQuickView(false)
          }
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}

export default ProductCard;