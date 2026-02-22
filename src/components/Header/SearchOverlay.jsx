import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./SearchOverlay.css";

const SearchOverlay = ({ onClose }) => {

  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* =====================================================
     BODY LOCK + ESC CLOSE
  ===================================================== */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", esc);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  /* =====================================================
     CLOSE ON OUTSIDE CLICK
  ===================================================== */

  const handleOutsideClick = (e) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  /* =====================================================
     FETCH ALL PRODUCTS ON OPEN
  ===================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setAllProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =====================================================
     INTELLIGENT FILTER SEARCH
  ===================================================== */

  useEffect(() => {
    if (!value.trim()) {
      setFilteredResults([]);
      return;
    }

    const query = value.toLowerCase();

    const filtered = allProducts.filter((product) => {

      const titleMatch =
        product.title?.toLowerCase().includes(query);

      const categoryMatch =
        product.category?.toLowerCase().includes(query);

      const keywordMatch =
        product.keywords?.some((k) =>
          k.toLowerCase().includes(query)
        );

      return titleMatch || categoryMatch || keywordMatch;
    });

    setFilteredResults(filtered);
    setActiveIndex(-1);

  }, [value, allProducts]);

  /* =====================================================
     KEYBOARD NAVIGATION
  ===================================================== */

  const handleKeyDown = (e) => {

    if (!filteredResults.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(filteredResults[activeIndex]);
    }
  };

  /* =====================================================
     SELECT PRODUCT
  ===================================================== */

  const handleSelect = (product) => {
    navigate(`/product/${product.slug}`);
    onClose();
  };

  const clearInput = () => {
    setValue("");
    setFilteredResults([]);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={overlayRef}
      className="vc-search-overlay"
      onClick={handleOutsideClick}
    >
      <div className="vc-search-wrapper">

        <div className="vc-search-input-wrapper">

          <input
            ref={inputRef}
            type="text"
            placeholder="Search dresses, sarees, kurtis..."
            className="vc-search-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          {value && (
            <button
              className="vc-clear-btn"
              onClick={clearInput}
              type="button"
            >
              ✕
            </button>
          )}

          {(filteredResults.length > 0 || loading) && (
            <div className="vc-search-dropdown">

              {loading && (
                <div className="vc-search-loading">
                  Loading...
                </div>
              )}

              {!loading && filteredResults.length === 0 && (
                <div className="vc-search-empty">
                  No matching products found
                </div>
              )}

              {!loading &&
                filteredResults.map((item, index) => (
                  <div
                    key={item.id}
                    className={`vc-search-result-card ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="vc-search-result-image"
                    />

                    <div className="vc-search-result-content">
                      <div className="vc-search-result-title">
                        {item.title}
                      </div>
                      <div className="vc-search-result-price">
                        ₹{item.price}
                      </div>
                    </div>
                  </div>
                ))}

            </div>
          )}

        </div>

        <button className="vc-close-btn" onClick={onClose}>
          ✕
        </button>

      </div>
    </div>
  );
};

export default SearchOverlay;