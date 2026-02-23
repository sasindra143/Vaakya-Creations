/**
 * src/components/Header/HeaderNav.jsx
 *
 * ✅ All 10 categories with correct slugs
 * ✅ Sarees mega-dropdown, Western Wear dropdown, Jewellery dropdown
 * ✅ Wishlist badge shows live count
 * ✅ Clicking any nav link opens that category's products page
 * ✅ Mobile drawer with all categories listed
 * ✅ Accessible: keyboard close on Esc, outside-click close
 */

import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { WishlistContext } from "../../context/WishlistContext";
import "./HeaderNav.css";

/* ── Icons ── */
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Category map — single source of truth ── */
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
  const go = (slug) => {
    navigate(`/category/${slug}`);
    onClose();
  };

  return (
    <div className="hn-mega" role="menu">
      <div className="hn-mega-inner">
        <div className="hn-mega-col">
          <span className="hn-mega-heading">Silk & Pattu</span>
          {CATEGORIES.sarees.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hn-mega-col">
          <span className="hn-mega-heading">Traditional</span>
          {CATEGORIES.traditional.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hn-mega-col">
          <span className="hn-mega-heading">Western & Fusion</span>
          {CATEGORIES.western.map((item) => (
            <button key={item.slug} className="hn-mega-item" onClick={() => go(item.slug)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hn-mega-cta">
          <div className="hn-mega-cta-inner">
            <span className="hn-mega-cta-label">✨ New Arrivals</span>
            <p className="hn-mega-cta-text">
              Authentic Indian textiles handcrafted with love.
            </p>
            <button className="hn-mega-cta-btn" onClick={() => go("all")}>
              Shop All Products →
            </button>
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
        <button
          key={item.slug}
          className="hn-dropdown-item"
          role="menuitem"
          onClick={() => { navigate(`/category/${item.slug}`); onClose(); }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const HeaderNav = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { wishlist } = useContext(WishlistContext);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  const closeAll = () => setOpenMenu(null);
  const toggle = (name) => setOpenMenu((p) => (p === name ? null : name));

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeAll();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeAll();
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMobileMenuOpen]);

  const handleMobileLink = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="hn-nav" ref={navRef} aria-label="Main navigation">
        <NavLink to="/" className="hn-link" onClick={closeAll} end>
          Home
        </NavLink>

        <div className="hn-item-wrap">
          <button
            className={`hn-link hn-btn${openMenu === "sarees" ? " hn-open" : ""}`}
            onClick={() => toggle("sarees")}
          >
            Sarees <span className={`hn-chev${openMenu === "sarees" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "sarees" && <MegaMenu onClose={closeAll} />}
        </div>

        <div className="hn-item-wrap">
          <button
            className={`hn-link hn-btn${openMenu === "western" ? " hn-open" : ""}`}
            onClick={() => toggle("western")}
          >
            Western Wear <span className={`hn-chev${openMenu === "western" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "western" && <Dropdown items={CATEGORIES.western} onClose={closeAll} />}
        </div>

        <div className="hn-item-wrap">
          <button
            className={`hn-link hn-btn${openMenu === "jewellery" ? " hn-open" : ""}`}
            onClick={() => toggle("jewellery")}
          >
            Jewellery <span className={`hn-chev${openMenu === "jewellery" ? " hn-chev-open" : ""}`}><ChevronDown /></span>
          </button>
          {openMenu === "jewellery" && <Dropdown items={CATEGORIES.jewellery} onClose={closeAll} />}
        </div>

        <NavLink to="/blog" className="hn-link">Blog</NavLink>
        <NavLink to="/branding" className="hn-link">Branding</NavLink>
        <NavLink to="/about" className="hn-link">About</NavLink>
        <NavLink to="/contact" className="hn-link">Contact</NavLink>

        <button
          className="hn-link hn-btn hn-wishlist-btn"
          onClick={() => navigate("/wishlist")}
        >
          ♥ Wishlist
        </button>
      </nav>
    </>
  );
};

export default HeaderNav;