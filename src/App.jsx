/**
 * src/App.jsx  —  Vaakya Creations
 * ✅ No pt-24 gap below header (header is sticky, pages start flush)
 * ✅ SignIn/SignUp imported from separate page files
 * ✅ All imports Linux/Netlify case-safe
 */

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ── Layout ── */
import Header  from "./components/Header/Header.jsx";
import Footer  from "./components/Layout/Footer.jsx";

/* ── Context Providers ── */
import { UIProvider }       from "./context/UIContext.jsx";
import { AuthProvider }     from "./context/AuthContext.jsx";
import { CartProvider }     from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ProductProvider }  from "./context/ProductContext.jsx";

/* ── Public Pages ── */
import Home               from "./pages/Home.jsx";
import Categorypage       from "./pages/Categorypage.jsx";
import ProductDetails     from "./pages/Productdetails.jsx";
import CartPage           from "./pages/CartPage.jsx";
import WishlistPage       from "./components/Wishlist/WishlistPage.jsx";
import OrderSuccess       from "./components/Checkout/OrderSuccess.jsx";
import AboutPage          from "./pages/AboutPage.jsx";
import CustomizedBranding from "./pages/CustomizedBranding/CustomizedBranding.jsx";
import BlogPage           from "./pages/Blog/BlogPage.jsx";
import BlogDetails        from "./pages/Blog/BlogDetails.jsx";
import ContactPage        from "./pages/Contact/ContactPage.jsx";
import OrderHistory       from "./pages/OrderHistory.jsx";
import SearchPage         from "./pages/SearchPage.jsx";

/* ── Auth Pages ── */
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

/* ── Admin Pages ── */
import AdminLayout    from "./components/Admin/AdminLayout.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminProducts  from "./components/Admin/AdminProducts.jsx";
import AdminUsers     from "./components/Admin/AdminUsers.jsx";

/* ── Utilities ── */
import ScrollToTop from "./components/common/ScrollToTop.jsx";

/* ══════════════════════════════════════════════════════════════════
   ROUTE GUARDS
══════════════════════════════════════════════════════════════════ */
function AdminRoute({ children }) {
  return children;
}

/* ══════════════════════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════════════════════ */
function AppContent() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");

  return (
    /* ✅ NO pt-24 — header is sticky so content starts right below it */
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <ScrollToTop />

      {!isAdmin && <Header />}

      {/* ✅ flex-1 with NO padding-top — header handles its own sticky offset */}
      <main style={{ flex: 1 }}>
        <Routes>

          {/* ── Public ── */}
          <Route path="/"                       element={<Home />} />
          <Route path="/category/:categoryName" element={<Categorypage />} />
          <Route path="/product/:id"            element={<ProductDetails />} />
          <Route path="/search"                 element={<SearchPage />} />
          <Route path="/cart"                   element={<CartPage />} />
          <Route path="/wishlist"               element={<WishlistPage />} />
          <Route path="/order-success"          element={<OrderSuccess />} />
          <Route path="/orders"                 element={<OrderHistory />} />
          <Route path="/about"                  element={<AboutPage />} />
          <Route path="/branding"               element={<CustomizedBranding />} />
          <Route path="/blog"                   element={<BlogPage />} />
          <Route path="/blog/:slug"             element={<BlogDetails />} />
          <Route path="/contact"                element={<ContactPage />} />

          {/* ── Auth ── */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* ── Admin ── */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index            element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products"  element={<AdminProducts />} />
            <Route path="orders"    element={<AdminDashboard />} />
            <Route path="users"     element={<AdminUsers />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {!isAdmin && <Footer />}

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
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