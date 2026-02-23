/**
 * src/components/ProductCard/ProductCard.jsx
 * ✅ Image hover swap | ✅ Wishlist toggle | ✅ Size selector (M/L/S etc)
 * ✅ Quick View modal | ✅ Add to Cart with feedback | ✅ Fully responsive
 */

import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import QuickViewModal from "../QuickView/QuickViewModal";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart }              = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useContext(WishlistContext);

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [showQuickView, setShowQuickView] = useState(false);
  const [cartState, setCartState] = useState("idle"); // idle | adding | added

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const outOfStock = !product.stock || Number(product.stock) === 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    if (outOfStock || cartState !== "idle") return;
    addToCart({ ...product, size: selectedSize });
    setCartState("adding");
    setTimeout(() => setCartState("added"), 300);
    setTimeout(() => setCartState("idle"), 1800);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <article className={`pc-card${outOfStock ? " pc-out" : ""}`}>

        {/* ── IMAGE WRAPPER ── */}
        <div className="pc-image-wrap">

          {/* Main image */}
          <img
            src={product.image}
            alt={product.name}
            className="pc-img pc-img-main"
            onError={e => { e.target.src = "https://placehold.co/400x500/f5ead8/7a4f20?text=No+Image"; }}
            loading="lazy"
          />

          {/* Hover swap image */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={`${product.name} alternate view`}
              className="pc-img pc-img-hover"
              loading="lazy"
            />
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="pc-out-overlay">Out of Stock</div>
          )}

          {/* Discount badge */}
          {discount > 0 && !outOfStock && (
            <div className="pc-badge-discount">−{discount}%</div>
          )}

          {/* Wishlist */}
          <button
            className={`pc-wishlist${wishlisted ? " active" : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? "♥" : "♡"}
          </button>

          {/* Quick View */}
          <button className="pc-quick-view" onClick={handleQuickView}>
            👁 Quick View
          </button>

        </div>

        {/* ── INFO ── */}
        <div className="pc-info">

          {/* Category */}
          {product.category && (
            <span className="pc-category">{product.category.replace(/-/g, " ")}</span>
          )}

          {/* Name */}
          <h3 className="pc-name">{product.name}</h3>

          {/* Rating */}
          {product.rating && (
            <div className="pc-rating">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`pc-star${i <= Math.round(product.rating) ? " on" : ""}`}>★</span>
              ))}
              <span className="pc-rating-val">({Number(product.rating).toFixed(1)})</span>
            </div>
          )}

          {/* Price */}
          <div className="pc-price-row">
            <span className="pc-price">₹{Number(product.price).toLocaleString()}</span>
            {product.oldPrice && (
              <span className="pc-old-price">₹{Number(product.oldPrice).toLocaleString()}</span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="pc-sizes">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`pc-size-btn${selectedSize === size ? " active" : ""}`}
                  onClick={e => { e.stopPropagation(); setSelectedSize(size); }}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <button
            className={`pc-cart-btn${cartState === "added" ? " added" : ""}${cartState === "adding" ? " adding" : ""}`}
            onClick={handleAddToCart}
            disabled={outOfStock || cartState !== "idle"}
          >
            {outOfStock
              ? "Out of Stock"
              : cartState === "adding"
              ? "Adding…"
              : cartState === "added"
              ? "✓ Added to Cart!"
              : "Add to Cart"}
          </button>

        </div>
      </article>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}

export default ProductCard;