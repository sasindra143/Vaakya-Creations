/**
 * src/components/Header/HeaderTop.jsx
 * ✅ Search icon LEFT on desktop/laptop
 * ✅ Attractive Create/Sign buttons
 * ✅ Shows logged-in user info
 * ✅ Hamburger works on mobile
 * ✅ Full responsive
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountDropdown from "./AccountDropdown";
import "./HeaderTop.css";

/* ── Icons ── */
const SearchIcon = () => (
  <svg className="vc-svg-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const UserIcon = () => (
  <svg className="vc-svg-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BagIcon = () => (
  <svg className="vc-svg-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Component ── */
const HeaderTop = ({ onSearchOpen, onMobileToggle, mobileMenuOpen, cartCount = 0 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setDropdownOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const initials = currentUser
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <>
      {/* ── Announcement Strip ── */}
      <div className="vc-top-strip" role="note" aria-label="Promotions">
        <span className="vc-strip-dot" aria-hidden="true" />
        <span className="vc-strip-text">
          Free shipping on orders above&nbsp;₹999&nbsp;&nbsp;·&nbsp;&nbsp;
          Handcrafted with love&nbsp;&nbsp;·&nbsp;&nbsp;
          Authentic Indian textiles&nbsp;&nbsp;·&nbsp;&nbsp;
          COD available across India
        </span>
        <span className="vc-strip-dot" aria-hidden="true" />
      </div>

      {/* ── Main Header Row ── */}
      <div className="vc-header-top">

        {/* LEFT — Search (desktop) + Hamburger (mobile) */}
        <div className="vc-left-section">
          {/* Hamburger — mobile only */}
          <button
            className={`vc-mobile-menu-btn${mobileMenuOpen ? " active" : ""}`}
            onClick={onMobileToggle}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="vc-bar" />
            <span className="vc-bar" />
            <span className="vc-bar" />
          </button>

          {/* Search — desktop only (left side) */}
          <button
            className="vc-icon-btn vc-search-desktop"
            onClick={onSearchOpen}
            aria-label="Search"
          >
            <SearchIcon />
            <span className="vc-search-label">Search</span>
          </button>
        </div>

        {/* CENTER — Logo */}
        <div
          className="vc-logo-wrapper"
          onClick={() => navigate("/")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          aria-label="Go to homepage"
        >
          <img
            src="https://res.cloudinary.com/dvknx0hpm/image/upload/v1769403850/WhatsApp_Image_2026-01-25_at_08.16.25-removebg-preview_lfe4ye.png"
            alt="Vaakya Creations logo"
            className="vc-logo-img"
          />
          <div className="vc-logo-text">
            <h1 className="vc-logo-name">Vaakya Creations</h1>
            <span className="vc-logo-tagline">Celebrating Elegance in Every Thread</span>
          </div>
        </div>

        {/* RIGHT — Auth + Cart */}
        <div className="vc-right-section">

          {/* Search mobile */}
          <button
            className="vc-icon-btn vc-search-mobile"
            onClick={onSearchOpen}
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Auth buttons — desktop */}
          {!currentUser ? (
            <div className="vc-auth-btns">
              <button
                className="vc-btn-signin"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
              <button
                className="vc-btn-signup"
                onClick={() => navigate("/signup")}
              >
                <span className="vc-btn-signup-shine" />
                Create Account
              </button>
            </div>
          ) : (
            /* Account dropdown */
            <div className="vc-account-wrapper" ref={dropdownRef}>
              <button
                className={`vc-icon-btn vc-account-btn${dropdownOpen ? " open" : ""}`}
                onClick={() => setDropdownOpen((p) => !p)}
                aria-label="Account"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="vc-avatar-circle">{initials}</div>
                <div className="vc-account-labels">
                  <span className="vc-account-greeting">Hello, {currentUser.name.split(" ")[0]}</span>
                  <strong className="vc-account-title">My Account <ChevronDown /></strong>
                </div>
              </button>

              <div className={`vc-account-dropdown-wrap${dropdownOpen ? " open" : ""}`}>
                {dropdownOpen && (
                  <AccountDropdown
                    user={currentUser}
                    onClose={() => setDropdownOpen(false)}
                    onLogout={() => { logout(); setDropdownOpen(false); navigate("/"); }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Cart */}
          <button
            className="vc-icon-btn vc-cart-btn"
            onClick={() => navigate("/cart")}
            aria-label={`Cart — ${cartCount} items`}
          >
            <BagIcon />
            {cartCount > 0 && (
              <span className="vc-cart-badge" aria-hidden="true">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </>
  );
};

export default HeaderTop;