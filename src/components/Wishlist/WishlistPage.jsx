/**
 * src/pages/WishlistPage.jsx
 * ✅ Shows wishlist items with sizes | ✅ Move to Cart | ✅ Remove
 * ✅ Social media links | ✅ Beautiful design | ✅ Fully mobile responsive
 */

import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wl-empty-wrap">
        <div className="wl-empty">
          <div className="wl-empty-icon">🤍</div>
          <h2 className="wl-empty-title">Your Wishlist is Empty</h2>
          <p className="wl-empty-sub">Save your favourite sarees, kurtis and jewellery here. Come back to them anytime!</p>
          <button className="wl-shop-btn" onClick={() => navigate("/")}>
            ✨ Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-page">

      {/* Header */}
      <div className="wl-header">
        <div className="wl-header-left">
          <h1 className="wl-title">My Wishlist</h1>
          <span className="wl-count">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</span>
        </div>
        <button className="wl-continue-btn" onClick={() => navigate("/")}>
          ← Continue Shopping
        </button>
      </div>

      {/* Grid */}
      <div className="wl-grid">
        {wishlist.map(item => {
          const discount = item.oldPrice
            ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
            : 0;

          return (
            <div key={item.id} className="wl-card">

              {/* Image */}
              <div className="wl-img-wrap" onClick={() => navigate(`/product/${item.id}`)}>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={e => { e.target.src = "https://placehold.co/300x380/f5ead8/7a4f20?text=No+Image"; }}
                />
                {discount > 0 && <span className="wl-disc">−{discount}%</span>}
                <div className="wl-hover-overlay">
                  <span>View Product</span>
                </div>
              </div>

              {/* Info */}
              <div className="wl-info">

                {item.category && (
                  <span className="wl-cat">{item.category.replace(/-/g, " ")}</span>
                )}

                <h3 className="wl-name">{item.name}</h3>

                {/* Rating */}
                {item.rating && (
                  <div className="wl-rating">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`wl-star${i <= Math.round(item.rating) ? " on" : ""}`}>★</span>
                    ))}
                    <span className="wl-rating-num">({Number(item.rating).toFixed(1)})</span>
                  </div>
                )}

                {/* Price */}
                <div className="wl-price-row">
                  <span className="wl-price">₹{Number(item.price).toLocaleString()}</span>
                  {item.oldPrice && (
                    <span className="wl-old">₹{Number(item.oldPrice).toLocaleString()}</span>
                  )}
                </div>

                {/* Sizes */}
                {item.sizes?.length > 0 && (
                  <div className="wl-sizes">
                    {item.sizes.map(s => (
                      <span key={s} className="wl-size-chip">{s}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="wl-actions">
                  <button
                    className="wl-cart-btn"
                    onClick={() => {
                      addToCart({ ...item, size: item.size || item.sizes?.[0] || "" });
                      removeFromWishlist(item.id);
                    }}
                  >
                    🛒 Move to Cart
                  </button>
                  <button
                    className="wl-remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    🗑️
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

export default WishlistPage;