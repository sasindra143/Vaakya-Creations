import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MegaMenu from "./MegaMenu";

const HeaderNav = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
    setOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <nav className="vc-nav" ref={navRef}>

      <Link className={isActive("/")} to="/">Home</Link>

      <div
        className="vc-nav-item"
        onClick={() => setOpen((prev) => !prev)}
      >
        Collections ▼

        <MegaMenu
          open={open}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <Link
        className={isActive("/about")}
        to="/about"
      >
        About Us
      </Link>

      <Link
        className={isActive("/branding")}
        to="/branding"
      >
        Customized Branding
      </Link>

      {/* BLOG NAV LINK */}
      <Link
        className={isActive("/blog")}
        to="/blog"
      >
        Blog
      </Link>

      <Link
        className={isActive("/contact")}
        to="/contact"
      >
        Contact
      </Link>

    </nav>
  );
};

export default HeaderNav;