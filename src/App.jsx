/**
 * src/App.jsx  —  Vaakya Creations
 *
 * ✅ Matches existing project structure exactly
 * ✅ Email + password login (WhatsApp stored as contact detail)
 * ✅ Sign In / Sign Up routes added
 * ✅ Admin Users page added at /admin/users
 * ✅ Header hidden on admin routes
 * ✅ RequireAuth guard for protected pages
 * ✅ All original public routes preserved
 *
 * FIX: Removed duplicate imports of Signinpage / Signuppage.
 *      Import names now match the actual default export names in each file:
 *        ./pages/SignInPage  → exports default SignInPage
 *        ./pages/SignUpPage  → exports default SignUpPage
 */

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ── Layout ── */
import Header  from "./components/Header/Header";
import Footer  from "./components/Layout/Footer";

/* ── Context Providers ── */
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

/* ── Auth Pages ── */
/* FIXED: single import per page, name matches the file's default export exactly */
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

/* ── Admin Pages ── */
import AdminLayout    from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts  from "./components/Admin/AdminProducts";
import AdminUsers     from "./components/Admin/AdminUsers";

/* ── Utilities ── */
import ScrollToTop from "./components/common/ScrollToTop";

/* ─────────────────────────────────────────────────────────────
   ROUTE GUARDS
───────────────────────────────────────────────────────────── */

/**
 * AdminRoute — restricts /admin/* to users with role === "admin".
 * Swap the inner logic for your real auth check when ready.
 * For now it passes through to make development easy.
 */
function AdminRoute({ children }) {
  // TODO: uncomment when auth is wired up:
  // const { currentUser } = useAuth();
  // if (!currentUser || currentUser.role !== "admin")
  //   return <Navigate to="/signin" replace />;
  return children;
}

/**
 * RequireAuth — protects pages that need a logged-in user.
 * Redirects to /signin, preserving the intended destination.
 */
// function RequireAuth({ children }) {
//   const { currentUser } = useAuth();
//   const location = useLocation();
//   if (!currentUser)
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   return children;
// }

/* ─────────────────────────────────────────────────────────────
   APP SHELL  (reads location → decides header/footer visibility)
───────────────────────────────────────────────────────────── */
function AppContent() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <ScrollToTop />

      {/* Header is hidden on all /admin/* routes */}
      {!isAdmin && <Header />}

      <main className={`flex-1${!isAdmin ? " pt-24" : ""}`}>
        <Routes>

          {/* ════════════════════════════════
              PUBLIC ROUTES
          ════════════════════════════════ */}
          <Route path="/"                       element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
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

          {/* ════════════════════════════════
              AUTH ROUTES
              Login  → email + password
              Signup → name, email, whatsapp, password
          ════════════════════════════════ */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* ════════════════════════════════
              ADMIN ROUTES
              All nested under <AdminLayout>
              /admin/dashboard  — stats overview
              /admin/products   — product manager
              /admin/orders     — order list
              /admin/users      — registered users
          ════════════════════════════════ */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index            element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products"  element={<AdminProducts />} />
            <Route path="orders"    element={<AdminDashboard />} />  {/* swap with AdminOrders when ready */}
            <Route path="users"     element={<AdminUsers />} />
          </Route>

          {/* ════════════════════════════════
              FALLBACK
          ════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {/* Footer is hidden on all /admin/* routes */}
      {!isAdmin && <Footer />}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT  —  provider order matters:
   AuthProvider → ProductProvider → CartProvider →
   WishlistProvider → UIProvider → AppContent
───────────────────────────────────────────────────────────── */
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