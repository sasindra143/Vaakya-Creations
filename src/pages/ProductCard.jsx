import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import QuickViewModal from "../QuickView/QuickViewModal";
import "./ProductCard.css";

function ProductCard({ product }) {

  const navigate = useNavigate();

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

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart({
      ...product,
      size: selectedSize
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const goToDetails = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="product-card">

        {/* IMAGE CLICKABLE */}
        <div
          className="product-image-wrapper"
          onClick={goToDetails}
        >
          <img
            src={product.image}
            alt={product.name}
            className="product-image main-img"
          />

          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt="hover"
              className="product-image hover-img"
            />
          )}

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

          <button
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickView(true);
            }}
          >
            Quick View
          </button>
        </div>

        {/* INFO */}
        <div className="product-info">

          <h3
            className="product-title clickable"
            onClick={goToDetails}
          >
            {product.name}
          </h3>

          <div className="product-price">
            ₹{product.price}
          </div>

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

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

        </div>
      </div>

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