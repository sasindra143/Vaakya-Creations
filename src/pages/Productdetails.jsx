/**
 * src/pages/ProductDetails.jsx
 * ✅ Reads from ProductContext — real-time sync with admin changes.
 * ✅ If admin deletes this product, user is redirected automatically.
 */

import { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate }                   from "react-router-dom";
import { CartContext }                               from "../context/CartContext";
import { WishlistContext }                           from "../context/WishlistContext";
import { useProducts }                              from "../context/ProductContext";
import "./Productdetails.css";

/* ── Icons ── */
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CartSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const ShareSvg = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const StarFilled = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#c9a96e">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const StarEmpty = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const BackSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const Stars = ({ rating = 0 }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map((n) =>
      n <= Math.round(rating) ? <StarFilled key={n} /> : <StarEmpty key={n} />
    )}
    <span className="pd-rating-num">{Number(rating).toFixed(1)} / 5</span>
  </div>
);

export default function ProductDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const { addToCart }                                          = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isWishlisted }   = useContext(WishlistContext);

  /* ✅ Real-time product data */
  const { products } = useProducts();

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)) ?? null,
    [products, id]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && String(p.id) !== String(id))
      .slice(0, 4);
  }, [products, product, id]);

  /* ── If admin deletes this product → redirect ── */
  useEffect(() => {
    if (products.length > 0 && !product) {
      navigate("/category/all", { replace: true });
    }
  }, [product, products.length, navigate]);

  /* ── UI state ── */
  const [activeImg,   setActiveImg]   = useState(0);
  const [selectedSz,  setSelectedSz]  = useState("");
  const [qty,         setQty]         = useState(1);
  const [cartDone,    setCartDone]    = useState(false);
  const [toast,       setToast]       = useState("");

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setQty(1);
      setSelectedSz(product.sizes?.[0] || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [product]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleCart = () => {
    if (!product || product.stock === 0) return;
    addToCart({ ...product, size: selectedSz, qty });
    setCartDone(true);
    showToast("Added to cart ✓");
    setTimeout(() => setCartDone(false), 2200);
  };

  const handleWish = () => {
    if (!product) return;
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      showToast("Removed from wishlist");
    } else {
      addToWishlist(product);
      showToast("Saved to wishlist ♥");
    }
  };

  const handleShare = async () => {
    try { await navigator.share({ title: product.name, url: window.location.href }); }
    catch { navigator.clipboard?.writeText(window.location.href); showToast("Link copied!"); }
  };

  /* Null guard — redirect effect handles the actual navigation */
  if (!products.length) return (
    <div className="pd-loading"><div className="pd-spinner" />Loading…</div>
  );

  if (!product) return null;

  const images   = product.images?.length ? product.images : [product.image].filter(Boolean);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="pd-page">

      {/* Toast */}
      {toast && <div className="pd-toast" role="alert">{toast}</div>}

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <button className="pd-crumb" onClick={() => navigate("/")}>Home</button>
        <span className="pd-sep">›</span>
        <button className="pd-crumb" onClick={() => navigate(`/category/${product.category}`)}>
          {product.category?.replace(/-/g, " ")}
        </button>
        <span className="pd-sep">›</span>
        <span className="pd-crumb-current">{product.name}</span>
      </nav>

      {/* Mobile back */}
      <button className="pd-back" onClick={() => navigate(-1)}>
        <BackSvg /> Back
      </button>

      {/* Two-column grid */}
      <div className="pd-grid">

        {/* ── Gallery ── */}
        <div className="pd-gallery">

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb${activeImg === i ? " pd-thumb-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" loading="lazy"
                    onError={(e) => { e.target.style.display = "none"; }} />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="pd-main-wrap">
            {discount > 0 && <span className="pd-disc-badge">−{discount}%</span>}
            {product.stock === 0 && <div className="pd-sold-out">Sold Out</div>}
            {images[activeImg]
              ? <img key={images[activeImg]} src={images[activeImg]} alt={product.name}
                  className="pd-main-img"
                  onError={(e) => { e.target.src = "https://placehold.co/540x640/f5ead8/7a4f20?text=No+Image"; }}
                />
              : <div className="pd-no-img">📦</div>
            }
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pd-info">

          <span className="pd-cat-pill">{product.category?.replace(/-/g, " ")}</span>
          <h1 className="pd-name">{product.name}</h1>
          {product.rating > 0 && <Stars rating={product.rating} />}

          <div className="pd-price-row">
            <span className="pd-price">₹{Number(product.price).toLocaleString()}</span>
            {product.oldPrice && (
              <>
                <span className="pd-old">₹{Number(product.oldPrice).toLocaleString()}</span>
                <span className="pd-save-tag">
                  Save ₹{(product.oldPrice - product.price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          <div className={`pd-stock${product.stock === 0 ? " s-out" : product.stock <= 5 ? " s-low" : " s-ok"}`}>
            {product.stock === 0
              ? "❌ Out of Stock"
              : product.stock <= 5
              ? `⚡ Only ${product.stock} left!`
              : "✅ In Stock"}
          </div>

          <hr className="pd-hr" />

          {product.description && <p className="pd-desc">{product.description}</p>}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="pd-group">
              <div className="pd-group-label">Size — <strong>{selectedSz}</strong></div>
              <div className="pd-sizes">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`pd-size-btn${selectedSz === sz ? " pd-sz-active" : ""}`}
                    onClick={() => setSelectedSz(sz)}
                  >{sz}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="pd-group">
            <div className="pd-group-label">Quantity</div>
            <div className="pd-qty">
              <button className="pd-qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}>−</button>
              <span className="pd-qty-num">{qty}</span>
              <button className="pd-qty-btn"
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                disabled={qty >= (product.stock || 99)}>+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="pd-cta">
            <button
              className={`pd-cart-btn${cartDone ? " pd-cart-done" : ""}${product.stock === 0 ? " pd-cart-out" : ""}`}
              onClick={handleCart}
              disabled={product.stock === 0}
            >
              <CartSvg />
              {cartDone ? "Added ✓" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              className={`pd-icon-btn${wishlisted ? " pd-wish-active" : ""}`}
              onClick={handleWish}
              aria-label="Toggle wishlist"
            >
              <HeartIcon filled={wishlisted} />
            </button>

            <button className="pd-icon-btn" onClick={handleShare} aria-label="Share">
              <ShareSvg />
            </button>
          </div>

          {/* Meta */}
          <div className="pd-meta">
            <div className="pd-meta-row"><span>Category</span><strong>{product.category?.replace(/-/g, " ")}</strong></div>
            {product.stock > 0 && <div className="pd-meta-row"><span>Available</span><strong>{product.stock} units</strong></div>}
            <div className="pd-meta-row"><span>SKU</span><strong>VC-{product.id}</strong></div>
          </div>

          {/* Trust badges */}
          <div className="pd-trust">
            <span>🚚 Free delivery above ₹999</span>
            <span>↩️ 7-day returns</span>
            <span>✨ 100% authentic</span>
            <span>🔒 Secure checkout</span>
          </div>

        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related-title">You May Also Like</h2>
          <div className="pd-related-grid">
            {related.map((rp) => {
              const rd = rp.oldPrice ? Math.round(((rp.oldPrice - rp.price) / rp.oldPrice) * 100) : 0;
              return (
                <div key={rp.id} className="pd-rel-card"
                  onClick={() => { navigate(`/product/${rp.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${rp.id}`)}>
                  <div className="pd-rel-img-wrap">
                    {rd > 0 && <span className="pd-rel-badge">−{rd}%</span>}
                    <img src={rp.image} alt={rp.name} className="pd-rel-img" loading="lazy"
                      onError={(e) => { e.target.src = "https://placehold.co/300x370/f5ead8/7a4f20?text=?"; }} />
                  </div>
                  <div className="pd-rel-info">
                    <span className="pd-rel-name">{rp.name}</span>
                    <div className="pd-rel-prices">
                      <span className="pd-rel-price">₹{Number(rp.price).toLocaleString()}</span>
                      {rp.oldPrice && <span className="pd-rel-old">₹{Number(rp.oldPrice).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}