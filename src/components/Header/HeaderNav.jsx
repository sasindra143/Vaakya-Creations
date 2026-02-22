import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";
import "./HeaderNav.css";

const HeaderNav = () => {

  /* ================================
     STATE MANAGEMENT
  ================================= */
  const [desktopMegaOpen, setDesktopMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);

  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================================
     CLOSE DESKTOP MEGA ON OUTSIDE CLICK
  ================================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDesktopMegaOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================================
     CLOSE ALL MENUS ON ROUTE CHANGE
  ================================= */
  useEffect(() => {
    setDesktopMegaOpen(false);
    setMobileMenuOpen(false);
    setMobileCollectionOpen(false);
  }, [location]);

  /* ================================
     LOCK BODY SCROLL WHEN MOBILE MENU OPEN
  ================================= */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  /* ================================
     CATEGORY NAVIGATION
  ================================= */
  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
    setDesktopMegaOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <>
      {/* =========================
          HAMBURGER (MOBILE ONLY)
      ========================== */}
      <div
        className={`vc-hamburger ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </div>

      {/* =========================
          DESKTOP NAVIGATION
      ========================== */}
      <nav className="vc-nav" ref={navRef}>

        <Link className={isActive("/")} to="/">Home</Link>

        <div
          className="vc-nav-item"
          onClick={() => setDesktopMegaOpen(prev => !prev)}
        >
          Collections ▼

          <MegaMenu
            open={desktopMegaOpen}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        <Link className={isActive("/about")} to="/about">
          About Us
        </Link>

        <Link className={isActive("/branding")} to="/branding">
          Customized Branding
        </Link>

        <Link className={isActive("/blog")} to="/blog">
          Blog
        </Link>

        <Link className={isActive("/contact")} to="/contact">
          Contact
        </Link>

      </nav>

      {/* =========================
          MOBILE OVERLAY
      ========================== */}
      <div
        className={`vc-mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* =========================
          MOBILE SIDE DRAWER
      ========================== */}
      <aside
        className={`vc-mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        role="navigation"
        aria-hidden={!mobileMenuOpen}
      >

        {/* MOBILE HEADER */}
        <div className="vc-mobile-header">
          <span>Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* MOBILE LINKS */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>

        {/* COLLECTION ACCORDION */}
        <div className="vc-mobile-collection">

          <div
            className="vc-mobile-collection-title"
            onClick={() =>
              setMobileCollectionOpen(prev => !prev)
            }
          >
            Collections {mobileCollectionOpen ? "▲" : "▼"}
          </div>

          {mobileCollectionOpen && (
            <div className="vc-mobile-submenu">

              <p onClick={() => handleCategoryClick("pattu-sarees")}>
                Pattu Sarees
              </p>

              <p onClick={() => handleCategoryClick("kurtis")}>
                Kurtis
              </p>

              <p onClick={() => handleCategoryClick("dresses")}>
                Dresses
              </p>

              <p onClick={() => handleCategoryClick("blouses")}>
                Blouses
              </p>

              <p onClick={() => handleCategoryClick("handmade-jewellery")}>
                Jewellery
              </p>

            </div>
          )}
        </div>

        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
          About Us
        </Link>

        <Link to="/branding" onClick={() => setMobileMenuOpen(false)}>
          Customized Branding
        </Link>

        <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
          Blog
        </Link>

        <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
          Contact
        </Link>

      </aside>
    </>
  );
};

export default HeaderNav;