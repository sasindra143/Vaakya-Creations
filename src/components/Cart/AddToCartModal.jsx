/**
 * src/components/Cart/AddToCartModal.jsx
 * ✅ Shows product name, image, size | ✅ View Cart + Checkout actions
 * ✅ Continue shopping | ✅ Beautiful design | ✅ Mobile responsive
 */

import { useNavigate } from "react-router-dom";
import "./AddToCartModal.css";

function AddToCartModal({ product, subtotal, itemCount = 1, onClose }) {
  const navigate = useNavigate();

  if (!product) return null;

  const handleViewCart = () => { onClose(); navigate("/cart"); };
  const handleCheckout = () => { onClose(); navigate("/cart"); };

  return (
    <div className="atc-overlay" onClick={onClose}>
      <div className="atc-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="atc-header">
          <div className="atc-success-badge">
            <span className="atc-check">✓</span>
            <span>Added to your cart!</span>
          </div>
          <button className="atc-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="atc-body">

          {/* Product preview */}
          <div className="atc-product">
            <div className="atc-img-wrap">
              <img
                src={product.image}
                alt={product.name}
                onError={e => { e.target.src = "https://placehold.co/80x100/f5ead8/7a4f20?text=?"; }}
              />
            </div>
            <div className="atc-product-info">
              <h4 className="atc-prod-name">{product.name}</h4>
              {product.size && (
                <span className="atc-size-tag">Size: <strong>{product.size}</strong></span>
              )}
              {product.category && (
                <span className="atc-cat">{product.category.replace(/-/g, " ")}</span>
              )}
              <span className="atc-price">₹{Number(product.price).toLocaleString()}</span>
            </div>
          </div>

          {/* Subtotal */}
          <div className="atc-subtotal-bar">
            <span>Cart Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
            <span className="atc-sub-val">₹{subtotal?.toLocaleString?.() || product.price.toLocaleString()}</span>
          </div>

          {/* Actions */}
          <div className="atc-actions">
            <button className="atc-btn-cart" onClick={handleViewCart}>
              🛒 View Cart
            </button>
            <button className="atc-btn-checkout" onClick={handleCheckout}>
              ⚡ Checkout
            </button>
          </div>

          <button className="atc-continue" onClick={onClose}>
            ← Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddToCartModal;