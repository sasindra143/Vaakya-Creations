import { useState } from "react";
import HeaderTop from "./HeaderTop";
import HeaderNav from "./HeaderNav";
import SearchOverlay from "./SearchOverlay";
import MobileDrawer from "./MobileDrawer";
import "./Header.css";

const Header = ({ onCartOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="vc-header">

      <HeaderTop
        onSearchOpen={() => setSearchOpen(true)}
        onMobileOpen={() => setMobileOpen(true)}
        onCartOpen={onCartOpen}  // ✅ PASS DOWN
      />

      <HeaderNav />

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
        />
      )}

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

    </header>
  );
};

export default Header;