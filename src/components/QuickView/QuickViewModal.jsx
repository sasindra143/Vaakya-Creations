/**
 * src/components/QuickView/QuickViewModal.jsx
 * ✅ Beautiful modal | ✅ Size selector (M/L/S/XL etc) | ✅ Qty control
 * ✅ Add to Cart + Buy Now | ✅ Stock bar | ✅ Fully mobile responsive
 */

import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./QuickView.css";

function QuickViewModal({ product, onClose }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const sizes = product?.sizes?.length ? product.sizes : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  /* Lock scroll */
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position  = "fixed";
    document.body.style.top       = `-${scrollY}px`;
    document.body.style.width     = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.width    = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  /* Keyboard close */
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const increaseQty = () => setQuantity(p => p + 1);
  const decreaseQty = () => setQuantity(p => (p > 1 ? p - 1 : 1));

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize, quantity });
    setAddedAnim(true);
    setTimeout(() => { setAddedAnim(false); onClose(); }, 900);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, size: selectedSize, quantity });
    navigate("/cart");
    onClose();
  };

  const stockQty = Number(product.stock) || 15;
  const stockPct = Math.min((stockQty / 50) * 100, 100);
  const stockColor = stockQty === 0 ? "#e53935" : stockQty <= 5 ? "#e65100" : "#2e7d32";

  return (
    <div className="qv-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qv-modal" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="qv-close" onClick={onClose} aria-label="Close">×</button>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="qv-discount-badge">−{discount}% OFF</div>
        )}

        <div className="qv-container">

          {/* ── LEFT: IMAGE ── */}
          <div className="qv-left">
            <div className="qv-img-wrap">
              <img src={product.image} alt={product.name}
                onError={e => { e.target.src = "https://placehold.co/400x500/f5ead8/7a4f20?text=No+Image"; }} />
            </div>
          </div>

          {/* ── RIGHT: CONTENT ── */}
          <div className="qv-right">

            {/* Category */}
            {product.category && (
              <span className="qv-category">
                {product.category.replace(/-/g, " ")}
              </span>
            )}

            {/* Title */}
            <h2 className="qv-title">{product.name}</h2>

            {/* Rating */}
            {product.rating && (
              <div className="qv-rating">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`qv-star${i <= Math.round(product.rating) ? " filled" : ""}`}>★</span>
                ))}
                <span className="qv-rating-num">{Number(product.rating).toFixed(1)}</span>
              </div>
            )}

            {/* Price */}
            <div className="qv-price-row">
              <span className="qv-price">₹{Number(product.price).toLocaleString()}</span>
              {product.oldPrice && (
                <span className="qv-old">₹{Number(product.oldPrice).toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="qv-save-tag">You save ₹{(product.oldPrice - product.price).toLocaleString()}</span>
              )}
            </div>

            <p className="qv-tax">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

            {/* Divider */}
            <div className="qv-divider" />

            {/* SIZE SELECTOR */}
            {sizes.length > 0 && (
              <div className="qv-size-section">
                <div className="qv-size-header">
                  <span className="qv-size-label">Size</span>
                  <span className="qv-selected-size">{selectedSize}</span>
                </div>
                <div className="qv-size-options">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`qv-size-btn${selectedSize === size ? " active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STOCK */}
            <div className="qv-stock-section">
              <div className="qv-stock-row">
                <span className="qv-stock-dot" style={{ background: stockColor }} />
                <span className="qv-stock-text" style={{ color: stockColor }}>
                  {stockQty === 0
                    ? "Out of Stock"
                    : stockQty <= 5
                    ? `Only ${stockQty} left — order soon!`
                    : `In Stock (${stockQty} units)`}
                </span>
              </div>
              <div className="qv-stock-bar">
                <div className="qv-stock-fill" style={{ width: `${stockPct}%`, background: stockColor }} />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="qv-qty-section">
              <span className="qv-qty-label">Quantity</span>
              <div className="qv-qty-row">
                <div className="qv-qty-box">
                  <button className="qv-qty-btn" onClick={decreaseQty} aria-label="Decrease">−</button>
                  <span className="qv-qty-num">{quantity}</span>
                  <button className="qv-qty-btn" onClick={increaseQty} aria-label="Increase">+</button>
                </div>
                <span className="qv-qty-hint">Max 10 per order</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="qv-buttons">
              <button
                className={`qv-add${addedAnim ? " added" : ""}`}
                onClick={handleAddToCart}
                disabled={stockQty === 0}
              >
                {addedAnim ? "✓ Added!" : "🛒 Add To Cart"}
              </button>
              <button
                className="qv-buy"
                onClick={handleBuyNow}
                disabled={stockQty === 0}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* DESCRIPTION */}
            {(product.description) && (
              <>
                <div className="qv-divider" />
                <div className="qv-desc-section">
                  <span className="qv-desc-label">Description</span>
                  <p className="qv-description">{product.description}</p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;