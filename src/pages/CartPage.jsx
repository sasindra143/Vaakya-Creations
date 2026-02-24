/**
 * src/pages/CartPage.jsx
 * ✅ Full mobile responsive
 * ✅ Quantity controls
 * ✅ Remove items
 * ✅ Order summary with GST + Shipping
 * ✅ WhatsApp checkout
 * ✅ Free shipping progress bar
 * ✅ Sticky bottom bar on mobile
 * ✅ Coupon input placeholder
 */

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./CartPage.css";

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ArrowLeft = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const WAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.304A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.522 2 12 2z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.44"/>
  </svg>
);

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const gst      = Math.round(subtotal * 0.05);
  const total    = subtotal + shipping + gst;

  const handleWhatsApp = () => {
    const lines = cart.map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ""} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`
    );
    const msg =
      `🛍️ *Order from Vaakya Creations*\n\n` +
      lines.join("\n") +
      `\n\nSubtotal: ₹${subtotal.toLocaleString("en-IN")}` +
      `\nShipping: ${shipping === 0 ? "FREE 🎉" : "₹" + shipping}` +
      `\nGST (5%): ₹${gst.toLocaleString("en-IN")}` +
      `\n*Total: ₹${total.toLocaleString("en-IN")}*` +
      (currentUser ? `\n\nName: ${currentUser.name}\nWhatsApp: ${currentUser.whatsapp}` : "");
    window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(msg)}`, "_blank");
  };

  /* ── EMPTY STATE ── */
  if (cart.length === 0) {
    return (
      <div className="cp-page">
        <div className="cp-empty">
          <div className="cp-empty-icon">🛍️</div>
          <h2 className="cp-empty-title">Your cart is empty</h2>
          <p className="cp-empty-sub">
            Explore our exclusive Indian textile collection<br />and add something beautiful.
          </p>
          <button className="cp-empty-btn" onClick={() => navigate("/")}>
            ✨ Start Shopping
          </button>
          <button className="cp-empty-link" onClick={() => navigate("/wishlist")}>
            ♥ View Wishlist
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.min((subtotal / 999) * 100, 100);

  return (
    <div className="cp-page">

      {/* ── Page Header ── */}
      <div className="cp-header">
        <button className="cp-back" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Continue Shopping</span>
        </button>
        <div className="cp-header-mid">
          <h1 className="cp-title">Shopping Cart</h1>
          <span className="cp-badge">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
        </div>
        <button className="cp-clear-all" onClick={clearCart}>Clear All</button>
      </div>

      <div className="cp-layout">

        {/* ════ LEFT: Items ════ */}
        <div className="cp-items-col">

          {/* Free shipping progress */}
          <div className={`cp-ship-bar${subtotal >= 999 ? " cp-ship-done" : ""}`}>
            <div className="cp-ship-bar-text">
              <TruckIcon />
              {subtotal >= 999
                ? <span>🎉 You unlocked <strong>FREE shipping!</strong></span>
                : <span>Add <strong>₹{(999 - subtotal).toLocaleString("en-IN")}</strong> more for FREE delivery</span>
              }
            </div>
            <div className="cp-ship-track">
              <div className="cp-ship-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Items */}
          <div className="cp-items-list">
            {cart.map((item) => (
              <div className="cp-card" key={item.id}>

                {/* Image */}
                <div className="cp-card-img-wrap">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="cp-card-img" loading="lazy" />
                    : <div className="cp-card-img-ph"><span>🥻</span></div>
                  }
                </div>

                {/* Details */}
                <div className="cp-card-body">
                  <div className="cp-card-top">
                    <div className="cp-card-info">
                      {item.category && <span className="cp-card-cat">{item.category}</span>}
                      <h3 className="cp-card-name">{item.name}</h3>
                      {item.variant && <span className="cp-card-variant">Variant: {item.variant}</span>}
                    </div>
                    <button
                      className="cp-card-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="cp-card-bottom">
                    {/* Qty control */}
                    <div className="cp-qty">
                      <button
                        className="cp-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease"
                      >
                        <MinusIcon />
                      </button>
                      <span className="cp-qty-num">{item.quantity}</span>
                      <button
                        className="cp-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        aria-label="Increase"
                      >
                        <PlusIcon />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="cp-card-prices">
                      {item.quantity > 1 && (
                        <span className="cp-unit-price">
                          ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                        </span>
                      )}
                      <span className="cp-item-total">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Trust badges — desktop only */}
          <div className="cp-trust cp-trust-desktop">
            <div className="cp-trust-item"><ShieldIcon /><span>Secure Checkout</span></div>
            <div className="cp-trust-item"><TruckIcon /><span>COD Available</span></div>
            <div className="cp-trust-item"><ReturnIcon /><span>Easy Returns</span></div>
          </div>
        </div>

        {/* ════ RIGHT: Summary ════ */}
        <div className="cp-summary-col">
          <div className="cp-summary">

            <h2 className="cp-summary-heading">Order Summary</h2>

            {/* Coupon */}
            <div className="cp-coupon">
              <input
                className="cp-coupon-input"
                type="text"
                placeholder="Coupon code"
                aria-label="Coupon code"
              />
              <button className="cp-coupon-btn">Apply</button>
            </div>

            {/* Rows */}
            <div className="cp-summary-rows">
              <div className="cp-sum-row">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="cp-sum-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "cp-free-tag" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="cp-sum-row">
                <span>GST (5%)</span>
                <span>₹{gst.toLocaleString("en-IN")}</span>
              </div>
              {shipping === 0 && (
                <div className="cp-sum-row cp-saved-row">
                  <span>🎉 You saved</span>
                  <span className="cp-saved-val">₹99</span>
                </div>
              )}
            </div>

            <div className="cp-sum-divider" />

            <div className="cp-sum-total-row">
              <span>Total</span>
              <span className="cp-grand-total">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <p className="cp-tax-note">Inclusive of all taxes · Prices in INR</p>

            {/* WhatsApp CTA */}
            <button className="cp-wa-btn" onClick={handleWhatsApp}>
              <WAIcon />
              Order via WhatsApp
            </button>

            {!currentUser && (
              <p className="cp-login-nudge">
                <button className="cp-login-link" onClick={() => navigate("/signin")}>
                  Sign in
                </button>{" "}
                for faster checkout &amp; order tracking
              </p>
            )}

            {/* Trust — mobile inside summary */}
            <div className="cp-trust cp-trust-summary">
              <div className="cp-trust-item"><ShieldIcon /><span>Secure</span></div>
              <div className="cp-trust-item"><TruckIcon /><span>COD</span></div>
              <div className="cp-trust-item"><ReturnIcon /><span>Returns</span></div>
            </div>

          </div>
        </div>

      </div>

      {/* ════ MOBILE STICKY BOTTOM BAR ════ */}
      <div className="cp-mob-bar">
        <div className="cp-mob-bar-left">
          <span className="cp-mob-bar-lbl">Total</span>
          <span className="cp-mob-bar-amt">₹{total.toLocaleString("en-IN")}</span>
        </div>
        <button className="cp-mob-bar-btn" onClick={handleWhatsApp}>
          <WAIcon />
          Checkout
        </button>
      </div>

    </div>
  );
}