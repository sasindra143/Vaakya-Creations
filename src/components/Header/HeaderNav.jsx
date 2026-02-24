/**
 * src/components/Header/HeaderNav.jsx
 * ✅ Desktop centered nav
 * ✅ Mobile drawer with backdrop — hamburger controlled from parent
 * ✅ All categories with mega/dropdowns
 * ✅ Wishlist badge
 */

import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { WishlistContext } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./HeaderNav.css";

/* ── Icons ── */
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CATEGORIES = {
  sarees: [
    { label: "Pattu Sarees", slug: "pattu-sarees" },
    { label: "Silk Sarees", slug: "silk-sarees" },
    { label: "Fancy Sarees", slug: "fancy-sarees" },
  ],
  traditional: [
    { label: "Lehengas", slug: "lehengas" },
    { label: "Anarkali Suits", slug: "anarkali-suits" },
    { label: "Blouses", slug: "blouses" },
  ],
  western: [
    { label: "Dresses", slug: "dresses" },
    { label: "Tops", slug: "tops" },
    { label: "Kurtis", slug: "kurtis" },
  ],
  jewellery: [
    { label: "Handmade Jewellery", slug: "handmade-jewellery" },
  ],
};

function MegaMenu({ onClose }) {
  const navigate = useNavigate();
  const go = (slug) => { navigate(`/category/${slug}`); onClose(); };
  return (
    <div className="hn-mega" role="menu">
      <div className="hn-mega-inner">
        <div className="hn-mega-col">
          <span className="hn-mega-heading">Silk & Pattu</span>
          {CATEGORIES.sarees.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>{item.label}</button>
          ))}
        </div>
        <div className="hn-mega-col">
          <span className="hn-mega-heading">Traditional</span>
          {CATEGORIES.traditional.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>{item.label}</button>
          ))}
        </div>
        <div className="hn-mega-col">
          <span className="hn-mega-heading">Western & Fusion</span>
          {CATEGORIES.western.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>{item.label}</button>
          ))}
        </div>
        <div className="hn-mega-cta">
          <div className="hn-mega-cta-inner">
            <span className="hn-mega-cta-label">✨ New Arrivals</span>
            <p className="hn-mega-cta-text">Authentic Indian textiles handcrafted with love.</p>
            <button className="hn-mega-cta-btn" onClick={() => go("all")}>Shop All Products →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown({ items, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="hn-dropdown" role="menu">
      {items.map((item) => (
        <button key={item.slug} className="hn-dropdown-item" role="menuitem"
          onClick={() => { navigate(`/category/${item.slug}`); onClose(); }}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── Mobile Accordion ── */
function MobAccordion({ title, items, onClose }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="hn-mob-accordion">
      <button className="hn-mob-link hn-mob-accordion-btn" onClick={() => setOpen(o => !o)}>
        {title}
        <span className={`hn-mob-chev${open ? " open" : ""}`}><ChevronDown /></span>
      </button>
      {open && (
        <div className="hn-mob-accordion-body">
          {items.map(item => (
            <button key={item.slug} className="hn-mob-sub-link"
              onClick={() => { navigate(`/category/${item.slug}`); onClose(); }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const HeaderNav = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { wishlist } = useContext(WishlistContext);
  const { currentUser, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  const closeAll = () => setOpenMenu(null);
  const toggle = (name) => setOpenMenu((p) => (p === name ? null : name));

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeAll();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Esc closes everything */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { closeAll(); setMobileMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMobileMenuOpen]);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleMobileLink = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const wishCount = wishlist?.length ?? 0;

  return (
    <>
      {/* ════ DESKTOP NAV ════ */}
      <nav className="hn-nav" ref={navRef} aria-label="Main navigation">
        <NavLink to="/" className="hn-link" onClick={closeAll} end>Home</NavLink>

        <div className="hn-item-wrap">
          <button className={`hn-link hn-btn${openMenu === "sarees" ? " hn-open" : ""}`} onClick={() => toggle("sarees")}>
            Sarees <span className={`hn-chev${openMenu === "sarees" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "sarees" && <MegaMenu onClose={closeAll} />}
        </div>

        <div className="hn-item-wrap">
          <button className={`hn-link hn-btn${openMenu === "western" ? " hn-open" : ""}`} onClick={() => toggle("western")}>
            Western Wear <span className={`hn-chev${openMenu === "western" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "western" && <Dropdown items={CATEGORIES.western} onClose={closeAll} />}
        </div>

        <div className="hn-item-wrap">
          <button className={`hn-link hn-btn${openMenu === "jewellery" ? " hn-open" : ""}`} onClick={() => toggle("jewellery")}>
            Jewellery <span className={`hn-chev${openMenu === "jewellery" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "jewellery" && <Dropdown items={CATEGORIES.jewellery} onClose={closeAll} />}
        </div>

        <NavLink to="/blog"     className="hn-link">Blog</NavLink>
        <NavLink to="/branding" className="hn-link">Branding</NavLink>
        <NavLink to="/about"    className="hn-link">About</NavLink>
        <NavLink to="/contact"  className="hn-link">Contact</NavLink>

        <button className="hn-link hn-btn hn-wishlist-btn" onClick={() => navigate("/wishlist")}>
          <span className="hn-heart-wrap">
            ♥
            {wishCount > 0 && <span className="hn-wish-badge">{wishCount}</span>}
          </span>
          Wishlist
        </button>
      </nav>

      {/* ════ MOBILE DRAWER ════ */}
      {mobileMenuOpen && (
        <div
          className="hn-mob-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`hn-mob-drawer${mobileMenuOpen ? " hn-mob-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        {/* Drawer header */}
        <div className="hn-mob-head">
          <span className="hn-mob-logo">Vaakya Creations</span>
          <button
            className="hn-mob-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* User greeting if logged in */}
        {currentUser && (
          <div className="hn-mob-user">
            <div className="hn-mob-avatar">
              {currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div className="hn-mob-user-info">
              <span className="hn-mob-user-name">{currentUser.name}</span>
              <span className="hn-mob-user-wa">📱 {currentUser.whatsapp}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="hn-mob-nav">
          <button className="hn-mob-link" onClick={() => handleMobileLink("/")}>🏠 Home</button>

          <span className="hn-mob-section">Shop</span>
          <MobAccordion title="🥻 Sarees" items={[...CATEGORIES.sarees, ...CATEGORIES.traditional]} onClose={() => setMobileMenuOpen(false)} />
          <MobAccordion title="👗 Western Wear" items={CATEGORIES.western} onClose={() => setMobileMenuOpen(false)} />
          <MobAccordion title="💍 Jewellery" items={CATEGORIES.jewellery} onClose={() => setMobileMenuOpen(false)} />

          <span className="hn-mob-section">Explore</span>
          <button className="hn-mob-link" onClick={() => handleMobileLink("/blog")}>📝 Blog</button>
          <button className="hn-mob-link" onClick={() => handleMobileLink("/branding")}>✨ Branding</button>
          <button className="hn-mob-link" onClick={() => handleMobileLink("/about")}>🌸 About</button>
          <button className="hn-mob-link" onClick={() => handleMobileLink("/contact")}>📞 Contact</button>

          <span className="hn-mob-section">Account</span>
          {currentUser ? (
            <>
              <button className="hn-mob-link" onClick={() => handleMobileLink("/orders")}>🛍️ My Orders</button>
              <button className="hn-mob-link" onClick={() => handleMobileLink("/profile")}>👤 My Profile</button>
              {currentUser.role === "admin" && (
                <button className="hn-mob-link hn-mob-admin" onClick={() => handleMobileLink("/admin/dashboard")}>⚙️ Admin Panel</button>
              )}
              <button className="hn-mob-link hn-mob-logout" onClick={() => { logout(); setMobileMenuOpen(false); }}>🚪 Sign Out</button>
            </>
          ) : (
            <>
              <button className="hn-mob-link hn-mob-signin" onClick={() => handleMobileLink("/signin")}>Sign In</button>
              <button className="hn-mob-link hn-mob-signup" onClick={() => handleMobileLink("/signup")}>Create Account →</button>
            </>
          )}

          {/* Wishlist */}
          <button className="hn-mob-link hn-mob-wish" onClick={() => handleMobileLink("/wishlist")}>
            ♥ Wishlist
            {wishCount > 0 && <span className="hn-mob-wish-count">{wishCount}</span>}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default HeaderNav;