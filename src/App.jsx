/**
 * src/App.jsx  —  Vaakya Creations
 *
 * ✅ All imports use explicit .jsx extensions (Netlify/Linux safe)
 * ✅ SignInPage + SignUpPage defined inline (no separate file needed)
 * ✅ CategoryPage imported normally (file provided separately)
 * ✅ All other pages imported normally
 * ✅ Admin routes fully wired
 */

import { useState }                        from "react";
import { Routes, Route, Navigate,
         useLocation, Link, useNavigate }  from "react-router-dom";

/* ── Layout ── */
import Header  from "./components/Header/Header.jsx";
import Footer  from "./components/Layout/Footer.jsx";

/* ── Context Providers ── */
import { UIProvider }       from "./context/UIContext.jsx";
import { AuthProvider }     from "./context/AuthContext.jsx";
import { CartProvider }     from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ProductProvider }  from "./context/ProductContext.jsx";
import { useAuth }          from "./context/AuthContext.jsx";

/* ── Public Pages ── */
import Home               from "./pages/Home.jsx";
import Categorypage       from "./pages/Categorypage.jsx";
import ProductDetails     from "./pages/ProductDetails.jsx";
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

/* ── Admin Pages ── */
import AdminLayout    from "./components/Admin/AdminLayout.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminProducts  from "./components/Admin/AdminProducts.jsx";
import AdminUsers     from "./components/Admin/AdminUsers.jsx";

/* ── Utilities ── */
import ScrollToTop from "./components/common/ScrollToTop.jsx";

/* ══════════════════════════════════════════════════════════════════
   INLINE AUTH STYLES
   (No external CSS file needed — avoids missing file errors)
══════════════════════════════════════════════════════════════════ */
const AUTH_CSS = `
  .vc-auth-page {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 24px 16px 40px;
    background: linear-gradient(135deg,#fdf8f0 0%,#f5ead8 35%,#faf2e4 65%,#f0e4cc 100%);
    font-family: "DM Sans", system-ui, sans-serif;
    position: relative; overflow: hidden;
  }
  .vc-auth-bg {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(circle at 20% 20%,rgba(201,169,110,.12) 0%,transparent 50%),
                radial-gradient(circle at 80% 80%,rgba(160,120,48,.10) 0%,transparent 50%);
  }
  .vc-auth-card {
    position: relative; z-index: 1; background: #fff;
    border-radius: 16px; box-shadow: 0 24px 64px rgba(26,22,18,.16);
    border: 1px solid rgba(201,169,110,.18);
    padding: 40px 36px 36px; width: 100%; max-width: 440px;
    animation: vcAuthIn .4s cubic-bezier(.34,1.48,.64,1) both;
  }
  @keyframes vcAuthIn {
    from { opacity:0; transform:translateY(28px) scale(.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .vc-auth-brand {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px; padding-bottom: 24px;
    border-bottom: 1px solid #f0e8d8;
  }
  .vc-auth-brand-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg,#1a1612,#2d2420); color: #c9a96e;
    font-size: 14px; font-weight: 800; letter-spacing: .5px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(26,22,18,.28);
  }
  .vc-auth-brand-name { font-size:15px; font-weight:700; color:#1a1612; }
  .vc-auth-brand-tag  { font-size:10.5px; color:#9a8575; font-style:italic; margin-top:2px; }
  .vc-auth-title      { font-size:26px; font-weight:800; color:#1a1612; margin:0 0 6px; letter-spacing:-.3px; }
  .vc-auth-subtitle   { font-size:13.5px; color:#9a8575; margin:0 0 22px; }
  .vc-auth-err {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;
    color: #dc2626; font-size: 13px; font-weight: 600;
    padding: 11px 14px; margin-bottom: 18px;
    animation: vcErrShake .36s both;
  }
  @keyframes vcErrShake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
    50%{transform:translateX(6px)}  80%{transform:translateX(-3px)}
  }
  .vc-auth-form   { display:flex; flex-direction:column; gap:16px; }
  .vc-auth-field  { display:flex; flex-direction:column; gap:7px; }
  .vc-auth-lbl {
    font-size:11px; font-weight:800; color:#9a8575;
    text-transform:uppercase; letter-spacing:.8px; user-select:none;
  }
  .vc-auth-lbl-row { display:flex; justify-content:space-between; align-items:center; }
  .vc-auth-forgot  { font-size:12px; font-weight:600; color:#a07830; text-decoration:none; }
  .vc-auth-forgot:hover { text-decoration:underline; }
  .vc-auth-iwrap { position:relative; }
  .vc-auth-ico {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    color:#b8a898; display:flex; align-items:center;
    pointer-events:none; z-index:1; transition:color .18s;
  }
  .vc-auth-iwrap:focus-within .vc-auth-ico { color:#a07830; }
  .vc-auth-input {
    width:100%; padding:13px 14px; border:1.5px solid #ddd5c8;
    border-radius:8px; background:#faf7f3; font-family:inherit;
    font-size:14px; font-weight:500; color:#1a1612; outline:none;
    box-sizing:border-box;
    transition:border-color .2s,background .2s,box-shadow .2s;
    -webkit-appearance:none;
  }
  .vc-auth-input:focus {
    border-color:#c9a96e; background:#fff;
    box-shadow:0 0 0 3px rgba(201,169,110,.14);
  }
  .vc-auth-input::placeholder { color:#b8a898; font-weight:400; }
  .vc-auth-input.ico { padding-left:40px; }
  .vc-auth-input.tgl { padding-right:46px; }
  .vc-auth-eye {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; color:#b8a898;
    display:flex; align-items:center; padding:4px; border-radius:4px;
    transition:color .18s,background .18s; z-index:1; line-height:1;
  }
  .vc-auth-eye:hover { color:#1a1612; background:#f0e8d8; }
  .vc-auth-submit {
    position:relative; overflow:hidden; width:100%;
    padding:15px 24px; margin-top:4px;
    background:linear-gradient(135deg,#1a1612,#2d2420);
    color:#c9a96e; border:none; border-radius:8px;
    font-family:inherit; font-size:15px; font-weight:700;
    letter-spacing:.4px; cursor:pointer;
    box-shadow:0 4px 18px rgba(26,22,18,.28);
    transition:background .2s,color .2s,transform .14s,box-shadow .2s;
    display:flex; align-items:center; justify-content:center;
    gap:8px; user-select:none;
  }
  .vc-auth-submit:hover:not(:disabled) {
    background:linear-gradient(135deg,#c9a96e,#a07830);
    color:#1a1612; transform:translateY(-2px);
    box-shadow:0 6px 20px rgba(201,169,110,.4);
  }
  .vc-auth-submit:disabled { opacity:.65; cursor:not-allowed; transform:none; }
  .vc-auth-shine {
    position:absolute; top:0; left:-80%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent);
    pointer-events:none; animation:vcShine 3s ease-in-out infinite;
  }
  @keyframes vcShine { 0%{left:-80%} 60%,100%{left:160%} }
  .vc-auth-spinner {
    display:inline-block; width:16px; height:16px;
    border:2px solid rgba(201,169,110,.3); border-top-color:#c9a96e;
    border-radius:50%; animation:vcSpin .65s linear infinite; flex-shrink:0;
  }
  @keyframes vcSpin { to{transform:rotate(360deg)} }
  .vc-auth-div {
    display:flex; align-items:center; gap:12px; margin:22px 0 16px;
  }
  .vc-auth-div::before,.vc-auth-div::after {
    content:""; flex:1; height:1px; background:#f0e8d8;
  }
  .vc-auth-div span { font-size:12px; color:#9a8575; white-space:nowrap; font-weight:500; }
  .vc-auth-alt {
    display:block; width:100%; padding:13px 24px; text-align:center;
    background:#fdf5e4; border:1.5px solid #ddd5c8; border-radius:8px;
    font-family:inherit; font-size:14px; font-weight:700; color:#1a1612;
    text-decoration:none; box-sizing:border-box; cursor:pointer;
    transition:background .2s,border-color .2s,transform .14s;
  }
  .vc-auth-alt:hover { background:#f0e8d8; border-color:#c9a96e; transform:translateY(-1px); }
  .vc-auth-legal { margin:18px 0 0; font-size:11px; color:#b8a898; text-align:center; line-height:1.6; }
  @media(max-width:480px) {
    .vc-auth-card { padding:28px 20px; }
    .vc-auth-title { font-size:22px; }
  }
`;

/* ══════════════════════════════════════════════════════════════════
   EYE ICON
══════════════════════════════════════════════════════════════════ */
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
               a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4
               c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19
               m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function AuthBrand() {
  return (
    <div className="vc-auth-brand">
      <div className="vc-auth-brand-icon">VC</div>
      <div>
        <div className="vc-auth-brand-name">Vaakya Creations</div>
        <div className="vc-auth-brand-tag">Celebrating Elegance in Every Thread</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SIGN IN PAGE  (inline — no ./pages/SignInPage.jsx file needed)
══════════════════════════════════════════════════════════════════ */
function SignInPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password.");      return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login({ email, password });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate(from, { replace: true });
  };

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="vc-auth-page">
        <div className="vc-auth-bg" aria-hidden="true" />
        <div className="vc-auth-card">
          <AuthBrand />
          <h1 className="vc-auth-title">Welcome Back</h1>
          <p className="vc-auth-subtitle">Sign in to your account to continue</p>

          {error && (
            <div className="vc-auth-err" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="vc-auth-form" onSubmit={submit} noValidate>

            {/* Email */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="si-email">Email Address</label>
              <div className="vc-auth-iwrap">
                <span className="vc-auth-ico" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="si-email"
                  type="email"
                  className="vc-auth-input ico"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setError(""); setEmail(e.target.value); }}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="vc-auth-field">
              <div className="vc-auth-lbl-row">
                <label className="vc-auth-lbl" htmlFor="si-password">Password</label>
                <a href="#" className="vc-auth-forgot">Forgot password?</a>
              </div>
              <div className="vc-auth-iwrap">
                <input
                  id="si-password"
                  type={showPass ? "text" : "password"}
                  className="vc-auth-input tgl"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setError(""); setPassword(e.target.value); }}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="vc-auth-eye"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="vc-auth-submit" disabled={loading}>
              <span className="vc-auth-shine" aria-hidden="true" />
              {loading ? <span className="vc-auth-spinner" /> : "Sign In →"}
            </button>

          </form>

          <div className="vc-auth-div"><span>Don't have an account?</span></div>
          <Link to="/signup" className="vc-auth-alt">Create an Account</Link>
          <p className="vc-auth-legal">
            By signing in you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SIGN UP PAGE  (inline — no ./pages/SignUpPage.jsx file needed)
══════════════════════════════════════════════════════════════════ */
function SignUpPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();
  const clr = () => setError("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim())                         { setError("Please enter your full name.");                   return; }
    if (!email.trim())                        { setError("Please enter your email address.");                return; }
    if (!whatsapp.trim())                     { setError("Please enter your WhatsApp number.");              return; }
    if (!/^\d{10,15}$/.test(whatsapp.trim())) { setError("Enter a valid WhatsApp number (10–15 digits)."); return; }
    if (!password)                            { setError("Please choose a password.");                      return; }
    if (password.length < 6)                  { setError("Password must be at least 6 characters.");       return; }
    if (password !== confirm)                 { setError("Passwords do not match.");                       return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = register({ name, email, whatsapp, password });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate("/", { replace: true });
  };

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="vc-auth-page">
        <div className="vc-auth-bg" aria-hidden="true" />
        <div className="vc-auth-card">
          <AuthBrand />
          <h1 className="vc-auth-title">Create Account</h1>
          <p className="vc-auth-subtitle">Join us and explore our exclusive collection</p>

          {error && (
            <div className="vc-auth-err" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="vc-auth-form" onSubmit={submit} noValidate>

            {/* Full Name */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="su-name">Full Name</label>
              <div className="vc-auth-iwrap">
                <span className="vc-auth-ico" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input id="su-name" type="text" className="vc-auth-input ico"
                  placeholder="Your full name" value={name}
                  onChange={e => { clr(); setName(e.target.value); }}
                  required autoFocus autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="su-email">Email Address</label>
              <div className="vc-auth-iwrap">
                <span className="vc-auth-ico" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input id="su-email" type="email" className="vc-auth-input ico"
                  placeholder="you@example.com" value={email}
                  onChange={e => { clr(); setEmail(e.target.value); }}
                  required autoComplete="email" />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="su-wa">WhatsApp Number</label>
              <div className="vc-auth-iwrap">
                <span className="vc-auth-ico" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.07-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input id="su-wa" type="tel" className="vc-auth-input ico"
                  placeholder="10-digit mobile number" value={whatsapp}
                  onChange={e => { clr(); setWhatsapp(e.target.value); }}
                  required autoComplete="tel" maxLength={15} />
              </div>
            </div>

            {/* Password */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="su-pw">Password</label>
              <div className="vc-auth-iwrap">
                <input id="su-pw" type={showPass ? "text" : "password"} className="vc-auth-input tgl"
                  placeholder="At least 6 characters" value={password}
                  onChange={e => { clr(); setPassword(e.target.value); }}
                  required autoComplete="new-password" />
                <button type="button" className="vc-auth-eye"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="vc-auth-field">
              <label className="vc-auth-lbl" htmlFor="su-cf">Confirm Password</label>
              <div className="vc-auth-iwrap">
                <input id="su-cf" type={showConf ? "text" : "password"} className="vc-auth-input tgl"
                  placeholder="Re-enter your password" value={confirm}
                  onChange={e => { clr(); setConfirm(e.target.value); }}
                  required autoComplete="new-password" />
                <button type="button" className="vc-auth-eye"
                  onClick={() => setShowConf(p => !p)}
                  aria-label={showConf ? "Hide password" : "Show password"}>
                  <EyeIcon open={showConf} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="vc-auth-submit" disabled={loading}>
              <span className="vc-auth-shine" aria-hidden="true" />
              {loading ? <span className="vc-auth-spinner" /> : "Create Account →"}
            </button>

          </form>

          <div className="vc-auth-div"><span>Already have an account?</span></div>
          <Link to="/signin" className="vc-auth-alt">Sign In Instead</Link>
          <p className="vc-auth-legal">
            By creating an account you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROUTE GUARDS
══════════════════════════════════════════════════════════════════ */
function AdminRoute({ children }) {
  // Uncomment when auth is ready:
  // const { currentUser } = useAuth();
  // if (!currentUser || currentUser.role !== "admin") return <Navigate to="/signin" replace />;
  return children;
}

// function RequireAuth({ children }) {
//   const { currentUser } = useAuth();
//   const location = useLocation();
//   if (!currentUser) return <Navigate to="/signin" state={{ from: location }} replace />;
//   return children;
// }

/* ══════════════════════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════════════════════ */
function AppContent() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <ScrollToTop />

      {/* Header hidden on all /admin/* routes */}
      {!isAdmin && <Header />}

      <main className={`flex-1${!isAdmin ? " pt-24" : ""}`}>
        <Routes>

          {/* ── Public Routes ── */}
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

          {/* ── Auth Routes (components defined inline above) ── */}
          <Route path="/signin"                 element={<SignInPage />} />
          <Route path="/signup"                 element={<SignUpPage />} />

          {/* ── Admin Routes ── */}
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

      {/* Footer hidden on all /admin/* routes */}
      {!isAdmin && <Footer />}

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
   Provider order: AuthProvider → ProductProvider → CartProvider →
   WishlistProvider → UIProvider → AppContent
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