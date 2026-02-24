/**
 * src/pages/CartPage.jsx
 * ✅ Full cart functionality — view, update qty, remove items
 * ✅ Order summary with total
 * ✅ WhatsApp checkout
 * ✅ Fully mobile responsive
 */

import { useContext, useState } from "react";
import { useNavigate, Link }    from "react-router-dom";
import { CartContext }           from "../context/CartContext";
import { useAuth }              from "../context/AuthContext";
import "./CartPage.css";

/* ── Icons ── */
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const CartEmptyIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c9a96e"
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function CartPage() {
  const navigate                   = useNavigate();
  const { currentUser }            = useAuth();
  const { cartItems, updateQty, removeFromCart, clearCart } = useContext(CartContext);

  const [coupon,    setCoupon]    = useState("");
  const [discount,  setDiscount]  = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  /* ── Totals ── */
  const subtotal  = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const shipping  = subtotal >= 999 ? 0 : 99;
  const discAmt   = Math.round(subtotal * discount);
  const total     = subtotal + shipping - discAmt;

  /* ── Coupon ── */
  const applyCoupon = () => {
    const COUPONS = { "VAAKYA10": 0.10, "FESTIVE20": 0.20, "SAVE15": 0.15 };
    const pct = COUPONS[coupon.toUpperCase().trim()];
    if (pct) {
      setDiscount(pct);
      setCouponMsg(`✅ Coupon applied! ${pct * 100}% off`);
    } else {
      setDiscount(0);
      setCouponMsg("❌ Invalid coupon code");
    }
  };

  /* ── WhatsApp Checkout ── */
  const checkoutWhatsApp = () => {
    const itemLines = cartItems
      .map((i) => `• ${i.name}${i.size ? ` (${i.size})` : ""} × ${i.qty} = ₹${(Number(i.price) * i.qty).toLocaleString()}`)
      .join("\n");

    const msg = encodeURIComponent(
      `🛍️ *New Order from Vaakya Creations*\n\n` +
      `${itemLines}\n\n` +
      `━━━━━━━━━━━━━━\n` +
      `Subtotal: ₹${subtotal.toLocaleString()}\n` +
      `Shipping: ${shipping === 0 ? "FREE" : `₹${shipping}`}\n` +
      (discAmt > 0 ? `Discount: -₹${discAmt.toLocaleString()}\n` : "") +
      `*Total: ₹${total.toLocaleString()}*\n\n` +
      (currentUser ? `👤 ${currentUser.name}\n📧 ${currentUser.email}\n📱 ${currentUser.whatsapp}` : "")
    );

    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
    clearCart();
    navigate("/order-success");
  };

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <CartEmptyIcon />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet. Explore our beautiful collection!</p>
          <button className="cart-empty-btn" onClick={() => navigate("/category/all")}>
            Shop Now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* ── Header ── */}
        <div className="cart-head">
          <div>
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="cart-clear-btn" onClick={clearCart}>Clear All</button>
        </div>

        <div className="cart-layout">

          {/* ── Left: Items ── */}
          <div className="cart-items-col">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item">

                {/* Image */}
                <div className="cart-item-img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = "https://placehold.co/120x140/f5ead8/7a4f20?text=?"; }}
                  />
                  {item.stock <= 5 && item.stock > 0 && (
                    <span className="cart-item-low">Only {item.stock} left</span>
                  )}
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-meta">
                    {item.size && <span className="cart-item-badge">Size: {item.size}</span>}
                    <span className="cart-item-badge">{item.category?.replace(/-/g, " ")}</span>
                  </div>

                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{Number(item.price).toLocaleString()}</span>
                    {item.oldPrice && (
                      <span className="cart-item-old">₹{Number(item.oldPrice).toLocaleString()}</span>
                    )}
                  </div>

                  {/* Qty + Remove */}
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="cart-qty-num">{item.qty}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                        disabled={item.qty >= (item.stock || 99)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id, item.size)}
                      aria-label="Remove item"
                    >
                      <TrashIcon /> Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="cart-item-total">
                  ₹{(Number(item.price) * item.qty).toLocaleString()}
                </div>

              </div>
            ))}

            {/* Continue shopping */}
            <button className="cart-continue" onClick={() => navigate("/category/all")}>
              ← Continue Shopping
            </button>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>

              {/* Coupon */}
              <div className="cart-coupon">
                <input
                  type="text"
                  className="cart-coupon-input"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponMsg(""); }}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button className="cart-coupon-btn" onClick={applyCoupon}>Apply</button>
              </div>
              {couponMsg && (
                <p className={`cart-coupon-msg ${couponMsg.startsWith("✅") ? "ok" : "err"}`}>
                  {couponMsg}
                </p>
              )}

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "cart-free" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {discAmt > 0 && (
                  <div className="cart-summary-row cart-discount-row">
                    <span>Discount ({discount * 100}%)</span>
                    <span>−₹{discAmt.toLocaleString()}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <p className="cart-shipping-note">
                    🚚 Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              {/* Checkout button */}
              <button className="cart-checkout-btn" onClick={checkoutWhatsApp}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </button>

              <p className="cart-secure-note">
                🔒 Secure · COD available · 7-day returns
              </p>

              {/* Trust badges */}
              <div className="cart-trust">
                <span>🚚 Free delivery ₹999+</span>
                <span>↩️ Easy returns</span>
                <span>✨ 100% authentic</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}