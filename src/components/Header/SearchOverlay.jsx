import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

const SearchOverlay = ({ onClose }) => {
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* =============================
     BODY SCROLL LOCK + ESC
  ============================= */
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

  /* =============================
     OUTSIDE CLICK CLOSE
  ============================= */
  const handleOutsideClick = (e) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  /* =============================
     DEBOUNCED SEARCH
  ============================= */
  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get(`/search?q=${value}`);
        setResults(res.data || []);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delay);
  }, [value]);

  /* =============================
     KEYBOARD NAVIGATION
  ============================= */
  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(results[activeIndex]);
    }
  };

  /* =============================
     SELECT RESULT
  ============================= */
  const handleSelect = (item) => {
    console.log("Selected:", item);
    onClose();
  };

  const clearInput = () => {
    setValue("");
    setResults([]);
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
            placeholder="Search"
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

          {/* DROPDOWN */}
          {(results.length > 0 || loading) && (
            <div className="vc-search-dropdown">
              {loading && (
                <div className="vc-search-loading">
                  Searching...
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="vc-search-empty">
                  No results found
                </div>
              )}

              {!loading &&
                results.map((item, index) => (
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

        <button className="vc-search-btn">
          🔍 Search
        </button>

        <button className="vc-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;