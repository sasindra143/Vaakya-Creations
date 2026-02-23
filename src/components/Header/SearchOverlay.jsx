import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchOverlay.css";

/* ─────────────────────────────────────────
   STATIC DATA — Vaakya Creations
   Replace with real API calls as needed
───────────────────────────────────────── */
const CATEGORIES = [
  { label: "Pattu Sarees",        slug: "pattu-sarees" },
  { label: "Kurtis",              slug: "kurtis" },
  { label: "Dresses",             slug: "dresses" },
  { label: "Blouses",             slug: "blouses" },
  { label: "Handmade Jewellery",  slug: "handmade-jewellery" },
  { label: "Lehengas",            slug: "lehengas" },
  { label: "Silk Sarees",         slug: "silk-sarees" },
  { label: "Anarkali Suits",      slug: "anarkali-suits" },
  { label: "Shop All",            slug: "all" },
];

const TRENDING = ["Pattu Sarees", "Silk Blouses", "Bridal Sets", "Kurtis", "Jewellery"];

const COLLECTIONS = [
  {
    id: 1,
    name: "Bridal Splendour",
    slug: "bridal-splendour",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    tag: "New Arrival",
  },
  {
    id: 2,
    name: "Silk Traditions",
    slug: "silk-traditions",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
    tag: "Bestseller",
  },
  {
    id: 3,
    name: "Festival Florals",
    slug: "festival-florals",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80",
    tag: "Trending",
  },
  {
    id: 4,
    name: "Zari Elegance",
    slug: "zari-elegance",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80",
    tag: "Limited",
  },
];

/* ── ICONS ── */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  /* Mount animation */
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      inputRef.current?.focus();
    }, 20);
    return () => clearTimeout(t);
  }, []);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ESC to close */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Animated close */
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      handleClose();
    }
  };

  const goCategory = (slug) => {
    navigate(`/category/${slug}`);
    handleClose();
  };

  const goCollection = (slug) => {
    navigate(`/collection/${slug}`);
    handleClose();
  };

  const goTrending = (term) => {
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    handleClose();
  };

  /* Filter collections by query */
  const filteredCollections = query
    ? COLLECTIONS.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : COLLECTIONS;

  const filteredCategories = query
    ? CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : CATEGORIES;

  return (
    <div
      className={`vcs-overlay${visible ? " visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* ── Backdrop ── */}
      <div className="vcs-backdrop" onClick={handleClose} aria-hidden="true" />

      {/* ── Panel ── */}
      <div className={`vcs-panel${visible ? " visible" : ""}`}>

        {/* ═══════════════════════════════════
            SEARCH BAR ROW
        ════════════════════════════════════ */}
        <div className="vcs-search-row">
          <form className="vcs-input-wrap" onSubmit={handleSearch}>
            <span className="vcs-search-icon-wrap" aria-hidden="true">
              <SearchIcon />
            </span>

            <input
              ref={inputRef}
              className="vcs-input"
              type="text"
              placeholder="Search sarees, kurtis, jewellery…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck="false"
              aria-label="Search products"
            />

            {query && (
              <button
                type="button"
                className="vcs-clear-btn"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <CloseIcon size={16} />
              </button>
            )}

            <button type="submit" className="vcs-search-btn" aria-label="Submit search">
              <SearchIcon />
              <span>Search</span>
            </button>
          </form>

          <button className="vcs-close-btn" onClick={handleClose} aria-label="Close search">
            <CloseIcon size={20} />
          </button>
        </div>

        {/* ═══════════════════════════════════
            TRENDING NOW
        ════════════════════════════════════ */}
        {!query && (
          <div className="vcs-trending-row">
            <span className="vcs-trending-label">Trending Now:</span>
            {TRENDING.map((t) => (
              <button
                key={t}
                className="vcs-trending-chip"
                onClick={() => goTrending(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════
            BODY — 2 COLUMN LAYOUT
        ════════════════════════════════════ */}
        <div className="vcs-body">

          {/* LEFT SIDEBAR — Categories */}
          <aside className="vcs-sidebar">
            <div className="vcs-sidebar-header">
              <h3 className="vcs-section-title">
                {query ? "Categories" : "Shop by Category"}
              </h3>
            </div>

            <ul className="vcs-category-list" role="list">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      className="vcs-category-item"
                      onClick={() => goCategory(cat.slug)}
                    >
                      <span>{cat.label}</span>
                      <ArrowRight />
                    </button>
                  </li>
                ))
              ) : (
                <li className="vcs-no-results-sm">No categories found</li>
              )}
            </ul>
          </aside>

          {/* RIGHT — Collections Grid */}
          <div className="vcs-main">
            <div className="vcs-main-header">
              <h3 className="vcs-section-title">Collections</h3>
              <button
                className="vcs-see-all"
                onClick={() => { navigate("/collections"); handleClose(); }}
              >
                See All Categories
              </button>
            </div>

            {filteredCollections.length > 0 ? (
              <div className="vcs-grid">
                {filteredCollections.map((col, i) => (
                  <button
                    key={col.id}
                    className="vcs-card"
                    onClick={() => goCollection(col.slug)}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="vcs-card-img-wrap">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="vcs-card-img"
                        loading="lazy"
                      />
                      <span className="vcs-card-tag">{col.tag}</span>
                    </div>
                    <span className="vcs-card-name">{col.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="vcs-no-results">
                <p>No collections match "<strong>{query}</strong>"</p>
                <button className="vcs-browse-all" onClick={() => { navigate("/collections"); handleClose(); }}>
                  Browse All Collections
                </button>
              </div>
            )}

            {/* Blog row */}
            {!query && (
              <div className="vcs-blog-row">
                <div className="vcs-main-header" style={{ marginTop: "28px" }}>
                  <h3 className="vcs-section-title">From the Blog</h3>
                  <button
                    className="vcs-see-all"
                    onClick={() => { navigate("/blog"); handleClose(); }}
                  >
                    See All Articles
                  </button>
                </div>
                <div className="vcs-blog-chips">
                  {["How to drape a Kanjeevaram", "Kurtis for every occasion", "Jewellery care tips"].map((b) => (
                    <button key={b} className="vcs-blog-chip"
                      onClick={() => { navigate("/blog"); handleClose(); }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ESC hint */}
        <div className="vcs-esc-hint" aria-hidden="true">
          Press <kbd>Esc</kbd> to close
        </div>

      </div>
    </div>
  );
};

export default SearchOverlay;