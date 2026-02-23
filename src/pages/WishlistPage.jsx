/**
 * src/components/Wishlist/WishlistPage.jsx
 *
 * ✅ Shows all wishlisted products
 * ✅ Remove individual items or clear all
 * ✅ Add to cart from wishlist
 * ✅ Connected to WishlistContext + CartContext
 */

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext }     from "../../context/CartContext";
import "./WishlistPage.css";

/* ── Icons ── */
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const HeartEmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e0d0c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const StarSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#c9a96e" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function WishlistPage() {
  const navigate                                   = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart }                              = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart({ ...product, qty: 1 });
  };

  const discount = (p) =>
    p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  /* ── Empty state ── */
  if (wishlist.length === 0) {
    return (
      <div className="wl-empty">
        <HeartEmptyIcon />
        <h2 className="wl-empty-title">Your Wishlist is Empty</h2>
        <p className="wl-empty-sub">Save your favourite pieces and come back to them anytime.</p>
        <button className="wl-empty-btn" onClick={() => navigate("/category/all")}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="wl-page">

      {/* Header */}
      <div className="wl-header">
        <div>
          <h1 className="wl-title">My Wishlist</h1>
          <p className="wl-count">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="wl-header-actions">
          <button className="wl-clear-btn" onClick={clearWishlist}>
            <TrashIcon /> Clear All
          </button>
          <button className="wl-shop-btn" onClick={() => navigate("/category/all")}>
            Continue Shopping →
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="wl-grid">
        {wishlist.map((product) => {
          const disc = discount(product);
          return (
            <div key={product.id} className="wl-card">

              {/* Image */}
              <div
                className="wl-img-wrap"
                onClick={() => navigate(`/product/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.id}`)}
                aria-label={`View ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="wl-img"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x380?text=No+Image"; }}
                />
                {disc > 0 && <span className="wl-badge">−{disc}%</span>}
                {product.stock === 0 && <div className="wl-sold-out">Sold Out</div>}
              </div>

              {/* Info */}
              <div className="wl-info">
                <span className="wl-category">{product.category?.replace(/-/g, " ")}</span>

                <h3
                  className="wl-name"
                  onClick={() => navigate(`/product/${product.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  {product.name}
                </h3>

                {product.rating > 0 && (
                  <div className="wl-rating">
                    <StarSvg /> <span>{Number(product.rating).toFixed(1)}</span>
                  </div>
                )}

                <div className="wl-price-row">
                  <span className="wl-price">₹{Number(product.price).toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="wl-old-price">₹{Number(product.oldPrice).toLocaleString()}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="wl-actions">
                  <button
                    className="wl-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <CartIcon />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    className="wl-remove-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}