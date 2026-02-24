/**
 * src/components/Header/Header.jsx
 * ✅ FIXED: No gap between header and content below
 * ✅ Sticky header, mobile responsive
 */

import { useState, useEffect } from "react";
import HeaderTop from "./HeaderTop";
import HeaderNav from "./HeaderNav";
import SearchOverlay from "./SearchOverlay";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`vc-header${scrolled ? " vc-header-scrolled" : ""}`}>
      <HeaderTop
        mobileMenuOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen((p) => !p)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <HeaderNav
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
};

export default Header;