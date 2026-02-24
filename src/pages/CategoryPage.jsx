/**
 * src/pages/CategoryPage.jsx
 *
 * ✅ Reads from ProductContext (admin-only products).
 * ✅ Clicking a nav link opens this page with correct category filtered.
 * ✅ Real-time: add/delete in admin instantly reflects here.
 * ✅ Empty state when no products for a category.
 */

import { useParams, useNavigate }          from "react-router-dom";
import { useState, useEffect, useMemo }    from "react";
import { useProducts }                     from "../context/ProductContext";
import ProductCard                         from "../components/Product/ProductCard";
import ProductSkeleton                     from "../components/Product/ProductSkeleton";
import FilterSidebar                       from "../components/Filters/FilterSidebar";
import Pagination                          from "../components/Pagination/Pagination";
import AddToCartModal                      from "../components/Cart/AddToCartModal";
import QuickViewModal                      from "../components/QuickView/QuickViewModal";
import "../styles/products.css";

const PER_PAGE = 6;

/* Human-readable titles for each category slug */
const CATEGORY_TITLES = {
  "all":                 "All Products",
  "pattu-sarees":        "Pattu Sarees",
  "fancy-sarees":        "Fancy Sarees",
  "silk-sarees":         "Silk Sarees",
  "kurtis":              "Kurtis",
  "dresses":             "Dresses",
  "tops":                "Tops",
  "blouses":             "Blouses",
  "handmade-jewellery":  "Handmade Jewellery",
  "lehengas":            "Lehengas",
  "anarkali-suits":      "Anarkali Suits",
};

export default function Categorypage() {
  const { categoryName }  = useParams();
  const navigate          = useNavigate();

  /* ✅ Subscribe to `products` array — re-renders when admin changes anything */
  const { products } = useProducts();

  const [sort,     setSort]     = useState("default");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [cartModal,  setCartModal]  = useState(null);
  const [quickModal, setQuickModal] = useState(null);

  /* Brief skeleton on category change */
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setSort("default");
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [categoryName]);

  /* ✅ `products` in deps array = recomputes on every admin add/edit/delete */
  const filtered = useMemo(() => {
    const slug = categoryName?.toLowerCase();
    let list = (!slug || slug === "all")
      ? [...products]
      : products.filter((p) => p.category?.toLowerCase() === slug);

    list = list.filter((p) => Number(p.price) <= maxPrice);

    if (sort === "price-low")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating")     list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "newest")     list.sort((a, b) => (String(b.id) > String(a.id) ? 1 : -1));

    return list;
  }, [products, categoryName, maxPrice, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const isEmpty    = !loading && filtered.length === 0;
  const allEmpty   = !loading && products.length === 0;

  const pageTitle =
    CATEGORY_TITLES[categoryName?.toLowerCase()] ||
    (categoryName ? categoryName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Products");

  return (
    <>
      <div className="shop-layout">

        {/* Sidebar + sort */}
        <div className="shop-filter-wrapper">
          <FilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={(v) => { setMaxPrice(v); setPage(1); }}
          />
          <div className="sort-box">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              aria-label="Sort products"
            >
              <option value="default">Sort By</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products section */}
        <div className="products-section">

          <div className="category-header">
            <h2 className="category-title">{pageTitle}</h2>
            {!loading && (
              <span className="category-count">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="products-grid">
            {loading && Array(PER_PAGE).fill(null).map((_, i) => <ProductSkeleton key={i} />)}

            {!loading && paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => setCartModal(p)}
                onQuickView={(p) => setQuickModal(p)}
              />
            ))}
          </div>

          {/* No products in this category */}
          {isEmpty && !allEmpty && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products in "{pageTitle}"</h3>
              <p>
                Nothing here yet. Add products in this category from the
                Admin panel.
              </p>
              <button
                className="empty-state-btn"
                onClick={() => navigate("/category/all")}
              >
                Browse All Products
              </button>
            </div>
          )}

          {/* Store is completely empty */}
          {allEmpty && (
            <div className="empty-state">
              <div className="empty-state-icon">🏪</div>
              <h3>Store is empty</h3>
              <p>
                No products have been added yet. Visit the Admin panel to add
                your first product.
              </p>
              <button
                className="empty-state-btn"
                onClick={() => navigate("/admin/products")}
              >
                Go to Admin →
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              setPage={(n) => {
                setPage(n);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

        </div>
      </div>

      {cartModal  && <AddToCartModal product={cartModal}  onClose={() => setCartModal(null)}  />}
      {quickModal && <QuickViewModal product={quickModal} onClose={() => setQuickModal(null)} />}
    </>
  );
}