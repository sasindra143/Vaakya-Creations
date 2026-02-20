import {
  useState,
  useRef,
  useEffect,
  useContext
} from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import AccountDropdown from "./AccountDropdown";

const HeaderTop = ({
  onSearchOpen,
  onMobileOpen
}) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  /* ==========================================
     CLOSE ACCOUNT DROPDOWN ON OUTSIDE CLICK
  =========================================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ==========================================
     CART CLICK HANDLER → FULL PAGE
  =========================================== */
  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className="vc-header-top">

      {/* MOBILE MENU */}
      <button
        className="vc-mobile-menu-btn"
        onClick={onMobileOpen}
      >
        ☰
      </button>

      {/* SEARCH */}
      <button
        className="vc-search-icon"
        onClick={onSearchOpen}
      >
        🔍
      </button>

      {/* LOGO */}
      <div
        className="vc-logo-wrapper"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://res.cloudinary.com/dvknx0hpm/image/upload/v1769403850/WhatsApp_Image_2026-01-25_at_08.16.25-removebg-preview_lfe4ye.png"
          alt="Logo"
          className="vc-logo-img"
        />

        <div className="vc-logo-text">
          <h1>Vaakya Creations</h1>
          <span>
            Celebrating Elegance in Every Thread
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="vc-right" ref={dropdownRef}>

        {/* ACCOUNT */}
        <div
          className="vc-account"
          onClick={() =>
            setDropdownOpen((prev) => !prev)
          }
        >
          <div className="vc-account-text">
            <span>Hello, sign in</span>
            <strong>Account & List</strong>
          </div>
        </div>

        {dropdownOpen && <AccountDropdown />}

        {/* CART ICON */}
        <div
          className="vc-cart"
          onClick={handleCartClick}
          style={{ cursor: "pointer", position: "relative" }}
        >
          👜

          {cartItems.length > 0 && (
            <span className="vc-cart-count">
              {cartItems.length}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default HeaderTop;