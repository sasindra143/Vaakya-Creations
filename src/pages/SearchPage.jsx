/**
 * src/pages/SearchPage.jsx
 *
 * Rendered at /search?q=keyword
 * Reads products from localStorage (same source as CategoryPage).
 * Uses your existing ProductCard, ProductSkeleton, AddToCartModal, QuickViewModal.
 *
 * CSS file → src/pages/SearchPage.css
 */

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import defaultProducts from "../data/products";
import ProductCard     from "../components/Product/ProductCard";
import ProductSkeleton from "../components/Product/ProductSkeleton";
import AddToCartModal  from "../components/Cart/AddToCartModal";
import QuickViewModal  from "../components/QuickView/QuickViewModal";

import "./SearchPage.css";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const CATEGORIES = [
  { label: "All Products",      slug: "all" },
  { label: "Pattu Sarees",      slug: "pattu-sarees" },
  { label: "Kurtis",            slug: "kurtis" },
  { label: "Dresses",           slug: "dresses" },
  { label: "Blouses",           slug: "blouses" },
  { label: "Jewellery",         slug: "handmade-jewellery" },
  { label: "Fancy Sarees",      slug: "fancy-sarees" },
  { label: "Anarkali Suits",    slug: "anarkali-suits" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "low",       label: "Price: Low → High" },
  { value: "high",      label: "Price: High → Low" },
  { value: "rating",    label: "Top Rated" },
];

const ITEMS_PER_PAGE = 12;

/* ─────────────────────────────────────────
   SVG ICONS  (inline — no extra deps)
───────────────────────────────────────── */
const SearchIcon = () => (
  <svg
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
function SearchPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get("q") || "";

  /* ── State ── */
  const [inputValue,       setInputValue]       = useState(queryParam);
  const [allProducts,      setAllProducts]       = useState([]);
  const [loading,          setLoading]           = useState(true);
  const [sort,             setSort]              = useState("relevance");
  const [maxPrice,         setMaxPrice]          = useState(15000);
  const [page,             setPage]              = useState(1);
  const [addedProduct,     setAddedProduct]      = useState(null);
  const [quickViewProduct, setQuickViewProduct]  = useState(null);
  const [sidebarOpen,      setSidebarOpen]       = useState(false);

  /* ── Load products from localStorage (same as CategoryPage) ── */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products"));
    if (!stored) {
      // Seed if empty (mirrors CategoryPage behavior)
      localStorage.setItem("products", JSON.stringify(defaultProducts));
      setAllProducts(defaultProducts);
    } else {
      setAllProducts(stored);
    }
  }, []);

  /* ── Re-run skeleton on query change ── */
  useEffect(() => {
    setInputValue(queryParam);
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [queryParam]);

  /* ── Close mobile sidebar on resize ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Derived max price from product data ── */
  const priceMax = useMemo(() => {
    if (!allProducts.length) return 15000;
    return Math.ceil(Math.max(...allProducts.map((p) => p.price)) / 1000) * 1000;
  }, [allProducts]);

  /* ── Filter + sort ── */
  const results = useMemo(() => {
    if (!queryParam.trim()) return [];
    const q = queryParam.toLowerCase();

    let filtered = allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );

    filtered = filtered.filter((p) => p.price <= maxPrice);

    if (sort === "low")    filtered.sort((a, b) => a.price - b.price);
    if (sort === "high")   filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return filtered;
  }, [queryParam, allProducts, sort, maxPrice]);

  /* ── Suggested products when no results ── */
  const suggestions = useMemo(() => {
    if (results.length > 0 || !queryParam) return [];
    return allProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [results, allProducts, queryParam]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginated  = results.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ── Handlers ── */
  const handleSearch = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (q) {
      setSearchParams({ q });
      setPage(1);
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const goPage = (n) => {
    setPage(n);
    scrollTop();
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="sp-page">

      {/* ════════════════════════════════════
          HERO — search bar
      ════════════════════════════════════ */}
      <div className="sp-hero">
        <div className="sp-hero-inner">

          <div className="sp-hero-text">
            <h1 className="sp-hero-title">
              {queryParam
                ? <>Results for&nbsp;<em>"{queryParam}"</em></>
                : "Search Our Collection"}
            </h1>
            {queryParam && !loading && (
              <span className="sp-hero-count">
                {results.length} product{results.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          <form className="sp-search-form" onSubmit={handleSearch} role="search">
            <div className="sp-search-wrap">
              <span className="sp-search-icon-wrap" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                type="search"
                className="sp-search-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search sarees, kurtis, jewellery…"
                autoComplete="off"
                spellCheck="false"
                aria-label="Search products"
              />
              {inputValue && (
                <button
                  type="button"
                  className="sp-clear-btn"
                  onClick={() => {
                    setInputValue("");
                    setSearchParams({});
                  }}
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            <button type="submit" className="sp-submit-btn" aria-label="Submit search">
              <SearchIcon />
              <span>Search</span>
            </button>
          </form>

        </div>
      </div>

      {/* ════════════════════════════════════
          MOBILE FILTER TOGGLE
      ════════════════════════════════════ */}
      <div className="sp-mobile-toolbar">
        <button
          className="sp-filter-toggle-btn"
          onClick={() => setSidebarOpen((p) => !p)}
          aria-expanded={sidebarOpen}
        >
          <FilterIcon />
          {sidebarOpen ? "Hide Filters" : "Filters & Sort"}
        </button>
        <span className="sp-mobile-count">
          {loading ? "Loading…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Mobile filter backdrop */}
      {sidebarOpen && (
        <div
          className="sp-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════
          BODY — sidebar + results
      ════════════════════════════════════ */}
      <div className="sp-body">

        {/* ── SIDEBAR ── */}
        <aside
          className={`sp-sidebar${sidebarOpen ? " open" : ""}`}
          aria-label="Filters"
        >
          {/* Sort */}
          <div className="sp-filter-block">
            <h3 className="sp-filter-title">Sort By</h3>
            <div className="sp-sort-options">
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`sp-sort-option${sort === opt.value ? " active" : ""}`}
                >
                  <input
                    type="radio"
                    name="sort"
                    value={opt.value}
                    checked={sort === opt.value}
                    onChange={() => {
                      setSort(opt.value);
                      setPage(1);
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="sp-filter-block">
            <h3 className="sp-filter-title">Max Price</h3>
            <div className="sp-price-wrap">
              <input
                type="range"
                min={500}
                max={priceMax}
                step={500}
                value={Math.min(maxPrice, priceMax)}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="sp-range"
                aria-label="Maximum price filter"
              />
              <div className="sp-price-labels">
                <span>₹500</span>
                <strong>₹{Math.min(maxPrice, priceMax).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="sp-filter-block">
            <h3 className="sp-filter-title">Browse Categories</h3>
            <div className="sp-cat-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  className="sp-cat-btn"
                  onClick={() => {
                    navigate(`/category/${cat.slug}`);
                    setSidebarOpen(false);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="sp-filter-block">
            <button
              className="sp-reset-btn"
              onClick={() => {
                setSort("relevance");
                setMaxPrice(priceMax);
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── MAIN RESULTS ── */}
        <div className="sp-main">

          {/* ── Loading skeletons ── */}
          {loading && (
            <div className="sp-grid">
              {Array(8).fill(0).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Results grid ── */}
          {!loading && results.length > 0 && (
            <>
              <div className="sp-grid">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => setAddedProduct(p)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="sp-pagination" role="navigation" aria-label="Pages">
                  <button
                    className="sp-page-btn sp-page-arrow"
                    disabled={page === 1}
                    onClick={() => goPage(page - 1)}
                    aria-label="Previous page"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`sp-page-btn${page === n ? " active" : ""}`}
                      onClick={() => goPage(n)}
                      aria-label={`Page ${n}`}
                      aria-current={page === n ? "page" : undefined}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    className="sp-page-btn sp-page-arrow"
                    disabled={page === totalPages}
                    onClick={() => goPage(page + 1)}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── No results ── */}
          {!loading && queryParam && results.length === 0 && (
            <div className="sp-empty">
              <div className="sp-empty-icon">🔍</div>
              <h2 className="sp-empty-title">
                No results for "{queryParam}"
              </h2>
              <p className="sp-empty-text">
                Try a different keyword or browse our collections
              </p>
              <button
                className="sp-browse-btn"
                onClick={() => navigate("/category/all")}
              >
                Browse All Products
              </button>

              {suggestions.length > 0 && (
                <div className="sp-suggestions-wrap">
                  <p className="sp-suggestion-label">You might also like:</p>
                  <div className="sp-grid">
                    {suggestions.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(p) => setAddedProduct(p)}
                        onQuickView={(p) => setQuickViewProduct(p)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── No query yet ── */}
          {!loading && !queryParam && (
            <div className="sp-empty">
              <div className="sp-empty-icon">👗</div>
              <h2 className="sp-empty-title">Start Your Search</h2>
              <p className="sp-empty-text">
                Type a keyword above to explore sarees, kurtis, jewellery and more
              </p>
              <div className="sp-quick-links">
                {CATEGORIES.filter((c) => c.slug !== "all").slice(0, 5).map((cat) => (
                  <button
                    key={cat.slug}
                    className="sp-quick-chip"
                    onClick={() => navigate(`/category/${cat.slug}`)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Modals ── */}
      {addedProduct && (
        <AddToCartModal
          product={addedProduct}
          onClose={() => setAddedProduct(null)}
        />
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
}

export default SearchPage;