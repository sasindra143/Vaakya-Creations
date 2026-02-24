/**
 * src/pages/SignUpPage.jsx
 * ✅ Back button
 * ✅ Working register via AuthContext
 * ✅ Redirects to home after success
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "", password: "", confirm: "",
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handle = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim())                          return setError("Please enter your full name.");
    if (!form.email.trim())                         return setError("Please enter your email address.");
    if (!form.whatsapp.trim())                      return setError("Please enter your WhatsApp number.");
    if (!/^\d{10,15}$/.test(form.whatsapp.trim()))  return setError("Enter a valid WhatsApp number (10–15 digits).");
    if (!form.password)                             return setError("Please choose a password.");
    if (form.password.length < 6)                   return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm)             return setError("Passwords do not match.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = register(form);
    setLoading(false);

    if (!result.ok) { setError(result.error); return; }
    navigate("/", { replace: true });
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and explore our exclusive collection</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={submit} noValidate>

          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input id="signup-name" name="name" type="text"
                className="auth-input auth-input-icon-pad"
                placeholder="Your full name" value={form.name}
                onChange={handle} required autoFocus autoComplete="name" />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input id="signup-email" name="email" type="email"
                className="auth-input auth-input-icon-pad"
                placeholder="you@example.com" value={form.email}
                onChange={handle} required autoComplete="email" />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-whatsapp">WhatsApp Number</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                           A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4
                           A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81
                           a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.07-.92
                           a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input id="signup-whatsapp" name="whatsapp" type="tel"
                className="auth-input auth-input-icon-pad"
                placeholder="10-digit mobile number" value={form.whatsapp}
                onChange={handle} required autoComplete="tel" maxLength={15} />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <input id="signup-password" name="password"
                type={showPass ? "text" : "password"}
                className="auth-input auth-input-with-toggle"
                placeholder="At least 6 characters" value={form.password}
                onChange={handle} required autoComplete="new-password" />
              <button type="button" className="auth-eye"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}>
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
            <div className="auth-input-wrap">
              <input id="signup-confirm" name="confirm"
                type={showConfirm ? "text" : "password"}
                className="auth-input auth-input-with-toggle"
                placeholder="Re-enter your password" value={form.confirm}
                onChange={handle} required autoComplete="new-password" />
              <button type="button" className="auth-eye"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Hide password" : "Show password"}>
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            <span className="auth-submit-shine" aria-hidden="true" />
            {loading
              ? <><span className="auth-spinner" aria-label="Loading" /> Creating account…</>
              : "Create Account →"
            }
          </button>

        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <Link to="/signin" className="auth-alt-btn">Sign In Instead</Link>

        <p className="auth-footer-note">
          By creating an account you agree to our Terms of Service &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}