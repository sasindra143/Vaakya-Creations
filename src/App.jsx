/**
 * src/App.jsx
 * ✅ ProductContext wraps everything so Admin + Frontend share the same data
 */

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header  from "./components/Header/Header";
import Footer  from "./components/Layout/Footer";

import { UIProvider }       from "./context/UIContext";
import { AuthProvider }     from "./context/AuthContext";
import { CartProvider }     from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider }  from "./context/ProductContext";

/* ── Public Pages ── */
import Home               from "./pages/Home";
import CategoryPage       from "./pages/CategoryPage";
import ProductDetails     from "./pages/ProductDetails";
import CartPage           from "./pages/CartPage";
import WishlistPage       from "./components/Wishlist/WishlistPage";
import OrderSuccess       from "./components/Checkout/OrderSuccess";
import AboutPage          from "./pages/AboutPage";
import CustomizedBranding from "./pages/CustomizedBranding/CustomizedBranding";
import BlogPage           from "./pages/Blog/BlogPage";
import BlogDetails        from "./pages/Blog/BlogDetails";
import ContactPage        from "./pages/Contact/ContactPage";
import OrderHistory       from "./pages/OrderHistory";
import SearchPage         from "./pages/SearchPage";

/* ── Common ── */
import ScrollToTop from "./components/common/ScrollToTop";

/* ── Admin ── */
import AdminLayout    from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts  from "./components/Admin/AdminProducts";

/* ── Admin route guard (swap for real auth when ready) ── */
function AdminRoute({ children }) {
  return children;
}

/* ── App content ── */
function AppContent() {
  const location  = useLocation();
  const isAdmin   = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <ScrollToTop />

      {!isAdmin && <Header />}

      <main className={`flex-1${!isAdmin ? " pt-24" : ""}`}>
        <Routes>

          {/* ── PUBLIC ── */}
          <Route path="/"                   element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:id"        element={<ProductDetails />} />
          <Route path="/search"             element={<SearchPage />} />
          <Route path="/cart"               element={<CartPage />} />
          <Route path="/wishlist"           element={<WishlistPage />} />
          <Route path="/order-success"      element={<OrderSuccess />} />
          <Route path="/orders"             element={<OrderHistory />} />
          <Route path="/about"              element={<AboutPage />} />
          <Route path="/branding"           element={<CustomizedBranding />} />
          <Route path="/blog"               element={<BlogPage />} />
          <Route path="/blog/:slug"         element={<BlogDetails />} />
          <Route path="/contact"            element={<ContactPage />} />

          {/* ── ADMIN ── */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index                    element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"         element={<AdminDashboard />} />
            <Route path="orders"            element={<AdminDashboard />} />
            <Route path="products"          element={<AdminProducts />} />
          </Route>

          {/* ── FALLBACK ── */}
          <Route path="*"                   element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {!isAdmin && <Footer />}

    </div>
  );
}

/* ── Root — all providers ── */
function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <UIProvider>
              <AppContent />
            </UIProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;