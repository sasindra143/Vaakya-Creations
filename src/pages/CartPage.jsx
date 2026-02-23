/**
 * src/pages/CartPage.jsx
 *
 * ✅ Two-column layout — LEFT: cart items | RIGHT: address + order summary
 * ✅ Size displayed on every item
 * ✅ Product image URL sent to WhatsApp
 * ✅ Full address, customer name, mobile sent to admin
 * ✅ WhatsApp order to +91 9959732476
 * ✅ Order saved to localStorage for Admin panel
 * ✅ Free delivery progress bar
 * ✅ Field-level validation with inline errors
 * ✅ Fully mobile responsive
 */

import { useContext, useState, useMemo } from "react";
import { useNavigate }                   from "react-router-dom";
import { CartContext }                   from "../context/CartContext";
import "./CartPage.css";

/* ─── Config ─── */
const WA_NUMBER  = "919959732476";
const FREE_ABOVE = 999;

const STATES = [
  "Andhra Pradesh", "Telangana", "Tamil Nadu",
  "Karnataka", "Maharashtra", "Kerala",
  "Odisha", "Goa", "Other",
];

const DELIVERY = {
  "Andhra Pradesh": 0,
  "Telangana":      40,
  "Tamil Nadu":     60,
  "Karnataka":      70,
  "Maharashtra":    80,
  "Kerala":         70,
  "Odisha":         90,
  "Goa":            90,
  "Other":          120,
};

/* ─── Icons ─── */
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const WAIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Tick = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ════════════════════════════════════════
   CART PAGE
════════════════════════════════════════ */
export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, addToCart, decreaseQty } = useContext(CartContext);

  /* form state */
  const [form, setForm] = useState({
    fullName:"", mobile:"", house:"", area:"",
    landmark:"", city:"", state:"", pincode:"",
    payMode:"COD",
  });
  const [errs,    setErrs]    = useState({});
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  /* ── derived ── */
  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + Number(i.price) * (i.quantity || 1), 0),
    [cartItems]
  );
  const savings = useMemo(
    () => cartItems.reduce(
      (s, i) => s + ((Number(i.oldPrice) || 0) - Number(i.price)) * (i.quantity || 1), 0
    ), [cartItems]
  );
  const deliveryCharge = subtotal >= FREE_ABOVE ? 0 : (DELIVERY[form.state] ?? 0);
  const total = subtotal + deliveryCharge;

  /* ── handlers ── */
  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrs(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (cartItems.length === 0)             e._gen     = "Your cart is empty.";
    if (!form.fullName.trim())              e.fullName = "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile   = "Enter valid 10-digit mobile.";
    if (!form.house.trim())                 e.house    = "House / Flat is required.";
    if (!form.area.trim())                  e.area     = "Area / Street is required.";
    if (!form.city.trim())                  e.city     = "City is required.";
    if (!STATES.includes(form.state))       e.state    = "Please select your state.";
    if (!/^\d{6}$/.test(form.pincode))      e.pincode  = "Enter valid 6-digit pincode.";
    return e;
  };

  const saveOrder = () => {
    const prev  = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = {
      id:       `TC-${Date.now()}`,
      customer: form.fullName,
      mobile:   form.mobile,
      address:  { ...form },
      items:    cartItems,
      subtotal, delivery: deliveryCharge,
      total, payMode: form.payMode,
      status: "Pending",
      date:   new Date().toISOString(),
    };
    localStorage.setItem("orders", JSON.stringify([order, ...prev]));
  };

  /* ── Build WhatsApp message ── */
  const buildMessage = () => {
    const lines = [];
    lines.push("🛍️ *NEW ORDER — Tarang Collections*");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("📦 *ORDER ITEMS:*");
    lines.push("");

    cartItems.forEach((item, i) => {
      const qty = item.quantity || 1;
      lines.push(`*${i + 1}. ${item.name}*`);
      if (item.category) lines.push(`   🏷️ Category : ${item.category.replace(/-/g, " ")}`);
      if (item.size)     lines.push(`   📐 Size     : ${item.size}`);
      lines.push(`   🔢 Qty      : ${qty}`);
      lines.push(`   💵 Price    : ₹${Number(item.price).toLocaleString()} × ${qty} = ₹${(Number(item.price) * qty).toLocaleString()}`);
      if (item.image && item.image.startsWith("http")) {
        lines.push(`   🖼️ Image    : ${item.image}`);
      }
      lines.push("");
    });

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("💰 *PRICE SUMMARY:*");
    lines.push(`   • Subtotal : ₹${subtotal.toLocaleString()}`);
    if (savings > 0) lines.push(`   • Savings  : ₹${savings.toLocaleString()}`);
    lines.push(`   • Delivery : ${deliveryCharge === 0 ? "FREE 🎉" : "₹" + deliveryCharge}`);
    lines.push(`   • *TOTAL   : ₹${total.toLocaleString()}*`);
    lines.push(`   • Payment  : ${form.payMode}`);
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("📍 *DELIVERY ADDRESS:*");
    lines.push(`   👤 Name    : ${form.fullName}`);
    lines.push(`   📞 Mobile  : +91 ${form.mobile}`);
    lines.push(`   🏠 House   : ${form.house}`);
    lines.push(`   🗺️ Area    : ${form.area}`);
    if (form.landmark.trim()) lines.push(`   📌 Landmark: ${form.landmark}`);
    lines.push(`   🏙️ City   : ${form.city}`);
    lines.push(`   📍 State   : ${form.state}`);
    lines.push(`   📮 Pincode : ${form.pincode}`);
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("✅ Please confirm order & share payment details.");
    lines.push("🙏 Thank you for choosing *Tarang Collections*!");
    return lines.join("\n");
  };

  const handleOrder = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrs(e);
      setTimeout(() => {
        document.querySelector(".cp-gen-err, .cp-field-err")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setErrs({});
    setSending(true);
    saveOrder();
    const msg = encodeURIComponent(buildMessage());
    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener");
      setSending(false);
      setSent(true);
      setTimeout(() => {
        cartItems.forEach(i => removeFromCart(i.id));
        navigate("/order-success", {
          state: { address: form, items: cartItems, subtotal, delivery: deliveryCharge, total }
        });
      }, 1400);
    }, 600);
  };

  /* ════ EMPTY CART ════ */
  if (cartItems.length === 0 && !sent) {
    return (
      <div className="cp-empty">
        <div className="cp-empty-icon">🛒</div>
        <h2 className="cp-empty-h2">Your cart is empty</h2>
        <p className="cp-empty-p">Explore our beautiful sarees, kurtis &amp; jewellery!</p>
        <button className="cp-empty-btn" onClick={() => navigate("/")}>
          ✨ Browse Collections
        </button>
      </div>
    );
  }

  /* ════ MAIN RENDER ════ */
  return (
    <div className="cp-page">

      {/* ══════════════════════════════
          LEFT — Cart Items
      ══════════════════════════════ */}
      <div className="cp-left">

        <div className="cp-left-header">
          <h1 className="cp-left-title">Shopping Cart</h1>
          <span className="cp-left-count">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
        </div>

        {errs._gen && <div className="cp-gen-err">⚠ {errs._gen}</div>}

        {/* Items */}
        <div className="cp-items-list">
          {cartItems.map(item => {
            const qty      = item.quantity || 1;
            const lineAmt  = Number(item.price) * qty;
            const disc     = item.oldPrice
              ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
              : 0;
            return (
              <div key={`${item.id}-${item.size || ""}`} className="cp-item">

                {/* Image */}
                <div className="cp-item-img-col">
                  <div className="cp-item-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cp-item-img"
                      loading="lazy"
                      onError={e => { e.target.src = "https://placehold.co/100x125/f5ead8/7a4f20?text=No+Image"; }}
                    />
                    {disc > 0 && <span className="cp-disc-badge">−{disc}%</span>}
                  </div>
                </div>

                {/* Details */}
                <div className="cp-item-body">

                  {/* Row 1: name + remove */}
                  <div className="cp-item-row-top">
                    <div className="cp-item-name-wrap">
                      <h4 className="cp-item-name">{item.name}</h4>
                      <div className="cp-item-tags">
                        {item.category && (
                          <span className="cp-tag-cat">{item.category.replace(/-/g, " ")}</span>
                        )}
                        {item.size && (
                          <span className="cp-tag-size">📐 {item.size}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="cp-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {/* Row 2: price + qty + total */}
                  <div className="cp-item-row-bot">
                    <div className="cp-item-prices">
                      <span className="cp-item-price">₹{Number(item.price).toLocaleString()}</span>
                      {item.oldPrice && (
                        <span className="cp-item-old">₹{Number(item.oldPrice).toLocaleString()}</span>
                      )}
                    </div>

                    <div className="cp-qty-wrap">
                      <button
                        className="cp-qty-btn"
                        onClick={() => decreaseQty(item.id)}
                        disabled={qty <= 1}
                        aria-label="Decrease"
                      >−</button>
                      <span className="cp-qty-num">{qty}</span>
                      <button
                        className="cp-qty-btn"
                        onClick={() => addToCart({ ...item })}
                        disabled={qty >= (item.stock || 99)}
                        aria-label="Increase"
                      >+</button>
                    </div>

                    <span className="cp-line-total">
                      ₹{lineAmt.toLocaleString()}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && subtotal < FREE_ABOVE && (
          <div className="cp-free-bar">
            <span className="cp-free-emoji">🚚</span>
            <div className="cp-free-text-wrap">
              <span className="cp-free-text">
                Add <strong>₹{(FREE_ABOVE - subtotal).toLocaleString()}</strong> more for <strong>FREE delivery!</strong>
              </span>
              <div className="cp-free-track">
                <div className="cp-free-fill" style={{ width: `${(subtotal / FREE_ABOVE) * 100}%` }} />
              </div>
            </div>
          </div>
        )}
        {subtotal >= FREE_ABOVE && (
          <div className="cp-free-bar cp-free-earned">
            🎉 <strong>FREE delivery unlocked!</strong> Your order qualifies for free shipping.
          </div>
        )}

      </div>

      {/* ══════════════════════════════
          RIGHT — Address + Summary
      ══════════════════════════════ */}
      <div className="cp-right">
        <div className="cp-right-card">

          {/* Price Summary */}
          <div className="cp-summary-block">
            <h3 className="cp-block-title">Price Summary</h3>
            <div className="cp-sum-rows">
              <div className="cp-sum-row">
                <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="cp-sum-row cp-sum-savings">
                  <span>You Save</span>
                  <span>−₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="cp-sum-row">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 && subtotal > 0 ? "cp-free-tag" : ""}>
                  {deliveryCharge === 0 && subtotal > 0 ? "🆓 FREE" : deliveryCharge === 0 ? "—" : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>
            <div className="cp-divider" />
            <div className="cp-total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className="cp-savings-pill">🎊 Saving ₹{savings.toLocaleString()} on this order!</div>
            )}
          </div>

          <div className="cp-section-divider" />

          {/* Address Form */}
          <h3 className="cp-block-title">📍 Delivery Address</h3>

          <div className="cp-form">

            {/* Full Name */}
            <div className="cp-field">
              <label className="cp-label">Full Name <span className="cp-req">*</span></label>
              <input
                className={`cp-input${errs.fullName ? " cp-input-err" : ""}`}
                type="text" name="fullName" placeholder="Your full name"
                value={form.fullName} onChange={e => set("fullName", e.target.value)}
                autoComplete="name"
              />
              {errs.fullName && <span className="cp-field-err">{errs.fullName}</span>}
            </div>

            {/* Mobile */}
            <div className="cp-field">
              <label className="cp-label">Mobile Number <span className="cp-req">*</span></label>
              <input
                className={`cp-input${errs.mobile ? " cp-input-err" : ""}`}
                type="tel" name="mobile" placeholder="10-digit mobile number"
                maxLength={10} value={form.mobile} onChange={e => set("mobile", e.target.value)}
                autoComplete="tel"
              />
              {errs.mobile && <span className="cp-field-err">{errs.mobile}</span>}
            </div>

            {/* House */}
            <div className="cp-field">
              <label className="cp-label">House / Flat / Apartment <span className="cp-req">*</span></label>
              <input
                className={`cp-input${errs.house ? " cp-input-err" : ""}`}
                type="text" name="house" placeholder="e.g. H.No 42, Sri Sai Residency"
                value={form.house} onChange={e => set("house", e.target.value)}
              />
              {errs.house && <span className="cp-field-err">{errs.house}</span>}
            </div>

            {/* Area */}
            <div className="cp-field">
              <label className="cp-label">Area / Street / Colony <span className="cp-req">*</span></label>
              <input
                className={`cp-input${errs.area ? " cp-input-err" : ""}`}
                type="text" name="area" placeholder="Area, Road, Colony"
                value={form.area} onChange={e => set("area", e.target.value)}
              />
              {errs.area && <span className="cp-field-err">{errs.area}</span>}
            </div>

            {/* Landmark */}
            <div className="cp-field">
              <label className="cp-label">Landmark <span className="cp-opt">(optional)</span></label>
              <input
                className="cp-input" type="text" name="landmark"
                placeholder="Near temple, school, bus stop…"
                value={form.landmark} onChange={e => set("landmark", e.target.value)}
              />
            </div>

            {/* City + State */}
            <div className="cp-field-row2">
              <div className="cp-field">
                <label className="cp-label">City <span className="cp-req">*</span></label>
                <input
                  className={`cp-input${errs.city ? " cp-input-err" : ""}`}
                  type="text" name="city" placeholder="Your city"
                  value={form.city} onChange={e => set("city", e.target.value)}
                />
                {errs.city && <span className="cp-field-err">{errs.city}</span>}
              </div>

              <div className="cp-field">
                <label className="cp-label">State <span className="cp-req">*</span></label>
                <select
                  className={`cp-select${errs.state ? " cp-input-err" : ""}`}
                  name="state" value={form.state}
                  onChange={e => set("state", e.target.value)}
                >
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errs.state && <span className="cp-field-err">{errs.state}</span>}
              </div>
            </div>

            {/* Pincode */}
            <div className="cp-field">
              <label className="cp-label">Pincode <span className="cp-req">*</span></label>
              <input
                className={`cp-input${errs.pincode ? " cp-input-err" : ""}`}
                type="text" name="pincode" placeholder="6-digit pincode"
                maxLength={6} value={form.pincode}
                onChange={e => set("pincode", e.target.value)}
              />
              {errs.pincode && <span className="cp-field-err">{errs.pincode}</span>}
            </div>

            {/* Delivery hint */}
            {form.state && (
              <div className={`cp-delivery-hint${deliveryCharge === 0 ? " free" : ""}`}>
                {deliveryCharge === 0
                  ? "🎉 FREE delivery to your state!"
                  : `🚚 Delivery to ${form.state}: ₹${deliveryCharge}`}
              </div>
            )}

            {/* Payment mode */}
            <div className="cp-field">
              <label className="cp-label">Payment Method</label>
              <div className="cp-pay-chips">
                {["COD", "UPI", "Bank Transfer"].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    className={`cp-pay-chip${form.payMode === mode ? " active" : ""}`}
                    onClick={() => set("payMode", mode)}
                  >
                    {mode === "COD" && "💵 "}
                    {mode === "UPI" && "📱 "}
                    {mode === "Bank Transfer" && "🏦 "}
                    {mode}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Confirm Button */}
          <button
            className={`cp-confirm-btn${sending ? " sending" : ""}${sent ? " sent" : ""}`}
            onClick={handleOrder}
            disabled={sending || sent || cartItems.length === 0}
          >
            {sending ? (
              <><span className="cp-spinner" /> Opening WhatsApp…</>
            ) : sent ? (
              <><Tick /> Order Sent!</>
            ) : (
              <><WAIcon /> Confirm Order via WhatsApp</>
            )}
          </button>

          <p className="cp-wa-note">
            🔒 Your order details will be sent securely to our WhatsApp (+91&nbsp;9959732476). Our team will confirm &amp; process your order.
          </p>

        </div>
      </div>

    </div>
  );
}