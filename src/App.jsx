import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Layout/Footer";

import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import WishlistPage from "./components/Wishlist/WishlistPage";
import OrderSuccess from "./components/Checkout/OrderSuccess";
import AboutPage from "./pages/AboutPage";
import CustomizedBranding from "./pages/CustomizedBranding/CustomizedBranding";

import BlogPage from "./pages/Blog/BlogPage";
import BlogDetails from "./pages/Blog/BlogDetails";
import ContactPage from "./pages/Contact/ContactPage";
import OrderHistory from "./pages/OrderHistory";

import ScrollToTop from "./components/common/ScrollToTop";

/* ADMIN */
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

/* =====================================
   ADMIN ROUTE PROTECTION (OPTIONAL)
===================================== */

function AdminRoute({ children }) {
  // If you want role-based auth later,
  // integrate with AuthContext here.
  return children;
}

/* =====================================
   MAIN APP CONTENT
===================================== */

function AppContent() {

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <ScrollToTop />

      {/* Hide Header on Admin Pages */}
      {!isAdminPage && <Header />}

      <main className={`flex-1 ${!isAdminPage ? "pt-24" : ""}`}>

        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/category/:categoryName"
            element={<CategoryPage />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/wishlist" element={<WishlistPage />} />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/orders"
            element={<OrderHistory />}
          />

          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/branding"
            element={<CustomizedBranding />}
          />

          <Route path="/blog" element={<BlogPage />} />

          <Route
            path="/blog/:slug"
            element={<BlogDetails />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* =========================
              ADMIN ROUTES
          ========================= */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route
              index
              element={<Navigate to="orders" />}
            />

            <Route
              path="orders"
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />
          </Route>

          {/* =========================
              FALLBACK
          ========================= */}

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </main>

      {/* Hide Footer on Admin Pages */}
      {!isAdminPage && <Footer />}

    </div>
  );
}

/* =====================================
   ROOT APP
===================================== */

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>
            <ProductProvider>
              <AppContent />
            </ProductProvider>
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;