import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import defaultProducts from "../data/products";
import ProductCard from "../components/Product/ProductCard";
import ProductSkeleton from "../components/Product/ProductSkeleton";
import FilterSidebar from "../components/Filters/FilterSidebar";
import Pagination from "../components/Pagination/Pagination";
import AddToCartModal from "../components/Cart/AddToCartModal";
import QuickViewModal from "../components/QuickView/QuickViewModal";

import "../styles/products.css";

function CategoryPage() {

  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [page, setPage] = useState(1);

  const [addedProduct, setAddedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const itemsPerPage = 6;

  /* ===============================
     DATABASE INITIALIZATION
  =============================== */

  useEffect(() => {

    let storedProducts =
      JSON.parse(localStorage.getItem("products"));

    if (!storedProducts) {

      // First time initialize database
      localStorage.setItem(
        "products",
        JSON.stringify(defaultProducts)
      );

      storedProducts = defaultProducts;
    }

    setProducts(storedProducts);

  }, []);

  /* ===============================
     CATEGORY CHANGE EFFECT
  =============================== */

  useEffect(() => {

    setLoading(true);
    setPage(1);
    setSort("default");

    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    setProducts(storedProducts);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);

  }, [categoryName]);

  /* ===============================
     FILTER + SORT
  =============================== */

  const filteredProducts = useMemo(() => {

    if (!categoryName) return [];

    let result = [...products];

    const lowerCategory =
      categoryName.toLowerCase();

    if (lowerCategory !== "all") {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === lowerCategory
      );
    }

    result = result.filter(
      (p) => p.price <= maxPrice
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;

  }, [categoryName, products, maxPrice, sort]);

  /* ===============================
     PAGINATION
  =============================== */

  const totalPages =
    Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex =
    (page - 1) * itemsPerPage;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const isEmpty =
    !loading && filteredProducts.length === 0;

  return (
    <>
      <div className="shop-layout">

        <div className="shop-filter-wrapper">

          <FilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={(value) => {
              setMaxPrice(value);
              setPage(1);
            }}
          />

          <div className="sort-box">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="default">Sort By</option>
              <option value="low">Price Low → High</option>
              <option value="high">Price High → Low</option>
            </select>
          </div>

        </div>

        <div className="products-section">

          <h2 className="category-title">
            {categoryName === "all"
              ? "ALL PRODUCTS"
              : categoryName
                ? categoryName
                    .replace(/-/g, " ")
                    .toUpperCase()
                : "CATEGORY"}
          </h2>

          <div className="products-grid">

            {loading &&
              Array(6).fill().map((_, i) => (
                <ProductSkeleton key={i} />
              ))}

            {!loading &&
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) =>
                    setAddedProduct(p)
                  }
                  onQuickView={(p) =>
                    setQuickViewProduct(p)
                  }
                />
              ))}

          </div>

          {isEmpty && (
            <div className="empty-state">
              <h3>No products found</h3>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              setPage={setPage}
            />
          )}

        </div>
      </div>

      {addedProduct && (
        <AddToCartModal
          product={addedProduct}
          onClose={() =>
            setAddedProduct(null)
          }
        />
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() =>
            setQuickViewProduct(null)
          }
        />
      )}
    </>
  );
}

export default CategoryPage;