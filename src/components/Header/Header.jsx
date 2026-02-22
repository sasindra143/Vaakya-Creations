import { useState } from "react";
import HeaderTop from "./HeaderTop";
import HeaderNav from "./HeaderNav";
import SearchOverlay from "./SearchOverlay";
import "./Header.css";

const Header = ({ onCartOpen }) => {

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="vc-header">

      <HeaderTop
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={onCartOpen}
      />

      {/* Desktop Navigation Only */}
      <HeaderNav />

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
        />
      )}

    </header>
  );
};

export default Header;