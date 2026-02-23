/**
 * src/components/Product/ProductCard.jsx
 *
 * Shows every product including admin-added ones.
 * Uses CartContext + WishlistContext.
 *
 * CSS → src/components/Product/ProductCard.css
 */

import { useState, useContext } from "react";
import { useNavigate }          from "react-router-dom";
import { CartContext }           from "../../context/CartContext";
import { WishlistContext }       from "../../context/WishlistContext";
import QuickViewModal            from "../QuickView/QuickViewModal";
import "./ProductCard.css";

/* ─── Icons ─── */
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CartPlusSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const EyeSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StarSvg = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#c9a96e" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function ProductCard({ product, onAddToCart, onQuickView }) {

  const navigate = useNavigate();

  const { addToCart }                                        = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useContext(WishlistContext);

  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0] || "");
  const [showQuickView, setShowQuickView] = useState(false);
  const [cartDone,      setCartDone]      = useState(false);

  /* Discount % */
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  /* ── Handlers ── */
  const handleAddToCart = (e) => {
    e?.stopPropagation();
    addToCart({ ...product, size: selectedSize });

    /* Flash done state */
    setCartDone(true);
    setTimeout(() => setCartDone(false), 1800);

    /* Also call parent handler if provided (for AddToCartModal) */
    onAddToCart?.(product);
  };

  const handleWishlist = (e) => {
    e?.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e?.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setShowQuickView(true);
    }
  };

  const goToDetails = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const wishlisted = isWishlisted(product.id);

  /* ════════════════════════════
     RENDER
  ════════════════════════════ */
  return (
    <>
      <article className={`pc-card${isOutOfStock ? " out-of-stock" : ""}`}>

        {/* ── Image area ── */}
        <div
          className="pc-img-wrap"
          onClick={goToDetails}
          role="button"
          tabIndex={0}
          aria-label={`View ${product.name}`}
          onKeyDown={(e) => e.key === "Enter" && goToDetails()}
        >
          {/* Main image */}
          <img
            src={product.image}
            alt={product.name}
            className="pc-img pc-img-main"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x370?text=No+Image";
            }}
          />

          {/* Hover image (if exists) */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              className="pc-img pc-img-hover"
              loading="lazy"
              aria-hidden="true"
            />
          )}

          {/* Badges */}
          {discount > 0 && (
            <span className="pc-badge pc-badge-discount">−{discount}%</span>
          )}
          {isLowStock && (
            <span className="pc-badge pc-badge-low">⚡ {product.stock} left</span>
          )}
          {isOutOfStock && (
            <div className="pc-sold-out-overlay">Sold Out</div>
          )}
          {product.rating >= 4.8 && !isOutOfStock && (
            <span className="pc-badge pc-badge-top">★ Top Rated</span>
          )}

          {/* Wishlist heart */}
          <button
            className={`pc-wishlist-btn${wishlisted ? " active" : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={wishlisted} />
          </button>

          {/* Quick view (shows on hover) */}
          <button
            className="pc-quickview-btn"
            onClick={handleQuickView}
            aria-label="Quick view"
          >
            <EyeSvg /> Quick View
          </button>
        </div>

        {/* ── Info area ── */}
        <div className="pc-info">

          {/* Category */}
          <span className="pc-category">
            {product.category?.replace(/-/g, " ")}
          </span>

          {/* Name */}
          <h3 className="pc-name" onClick={goToDetails} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goToDetails()}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="pc-rating">
              <StarSvg />
              <span>{product.rating}</span>
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
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  className={`pc-size-btn${selectedSize === sz ? " active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(sz); }}
                  aria-pressed={selectedSize === sz}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          {/* Add to cart */}
          <button
            className={`pc-cart-btn${cartDone ? " done" : ""}${isOutOfStock ? " disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {cartDone ? (
              "Added ✓"
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <><CartPlusSvg /> Add to Cart</>
            )}
          </button>

        </div>
      </article>

      {/* Quick View Modal (internal — when no onQuickView prop) */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}

export default ProductCard;