/**
 * src/pages/SignInPage.jsx
 * ✅ FIXED: No infinite loading — login resolves immediately
 * ✅ Back button to go home
 * ✅ Admin credentials shown for easy access
 */

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94
               M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19
               m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

export default function SignInPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password.");      return; }

    setLoading(true);

    /* Small UX delay then resolve — NOT a hung promise */
    await new Promise((r) => setTimeout(r, 500));

    const result = login({ email: email.trim(), password });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    /* Redirect to admin if admin user */
    navigate(from === "/" ? "/" : from, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" aria-hidden="true" />

      <div className="auth-card">

        {/* Back button */}
        <button className="auth-back-btn" onClick={() => navigate(-1)} type="button">
          ← Back
        </button>

        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">VC</div>
          <div>
            <div className="auth-logo-name">Vaakya Creations</div>
            <div className="auth-logo-tag">Celebrating Elegance in Every Thread</div>
          </div>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Admin hint */}
        <div className="auth-hint">
          <span>🔑 Admin:</span> admin@vaakya.com / admin123
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={submit} noValidate>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signin-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="signin-email"
                type="email"
                className="auth-input auth-input-icon-pad"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setError(""); setEmail(e.target.value); }}
                required
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="signin-password">Password</label>
            </div>
            <div className="auth-input-wrap">
              <input
                id="signin-password"
                type={showPass ? "text" : "password"}
                className="auth-input auth-input-with-toggle"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setError(""); setPassword(e.target.value); }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            <span className="auth-submit-shine" aria-hidden="true" />
            {loading
              ? <><span className="auth-spinner" aria-label="Loading" /> Signing in…</>
              : "Sign In →"
            }
          </button>

        </form>

        <div className="auth-divider"><span>Don't have an account?</span></div>
        <Link to="/signup" className="auth-alt-btn">Create an Account</Link>

        {/* Admin panel quick link */}
        <div className="auth-admin-link">
          <Link to="/admin/dashboard">⚙️ Go to Admin Panel</Link>
        </div>

        <p className="auth-footer-note">
          By signing in you agree to our Terms of Service &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}