import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Layout/Footer";

import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

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

import ScrollToTop from "./components/common/ScrollToTop";

import OrderHistory from "./pages/OrderHistory";

/* ADMIN */
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>

            <div className="min-h-screen flex flex-col bg-gray-50">

              <ScrollToTop />
              <Header />

              <main className="flex-1 pt-24">

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
                      ADMIN ROUTES (FIXED)
                  ========================= */}

                  <Route path="/admin" element={<AdminLayout />}>

                    {/* Default: /admin */}
                    <Route
                      index
                      element={<Navigate to="orders" />}
                    />

                    {/* /admin/orders */}
                    <Route
                      path="orders"
                      element={<AdminDashboard />}
                    />

                    {/* /admin/products */}
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

              <Footer />

            </div>

          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;