/**
 * src/pages/SignUpPage.jsx
 * ✅ Collect: name, email (login), whatsapp (profile/contact), password
 * ✅ Login is always by EMAIL — WhatsApp is for order updates / admin contact
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ characters",    pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number",           pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#e53935", "#ff9800", "#4caf50"];
  const labels = ["Weak", "Fair", "Strong"];

  return (
    <div className="auth-strength">
      <div className="auth-strength-bars">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="auth-strength-bar"
            style={{ background: i < score ? colors[score - 1] : "#e8e2d9" }}
          />
        ))}
      </div>
      {score > 0 && (
        <span className="auth-strength-label" style={{ color: colors[score - 1] }}>
          {labels[score - 1]}
        </span>
      )}
      <div className="auth-strength-checks">
        {checks.map((c) => (
          <span key={c.label} className={`auth-check${c.pass ? " pass" : ""}`}>
            {c.pass ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState({
    name:     "",
    email:    "",
    whatsapp: "",
    password: "",
    confirm:  "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { signup }              = useAuth();
  const navigate                = useNavigate();

  const handle = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim())              return setError("Please enter your full name.");
    if (!form.email.trim())             return setError("Please enter your email address.");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Please enter a valid email address.");
    if (!form.whatsapp.trim())          return setError("Please enter your WhatsApp number.");
    if (form.whatsapp.replace(/\D/g,"").length < 10)
                                        return setError("Enter a valid 10-digit WhatsApp number.");
    if (form.password.length < 6)       return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = signup({
      name:     form.name,
      email:    form.email,
      whatsapp: form.whatsapp.replace(/\D/g, ""),
      password: form.password,
    });
    setLoading(false);

    if (!result.ok) { setError(result.error); return; }
    navigate("/");
  };

  const passwordMismatch =
    form.confirm.length > 0 && form.password !== form.confirm;

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" aria-hidden="true" />

      <div className="auth-card auth-card-wide">
        {/* Brand logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">VC</div>
          <div>
            <div className="auth-logo-name">Vaakya Creations</div>
            <div className="auth-logo-tag">Celebrating Elegance in Every Thread</div>
          </div>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our community — sign up takes 30 seconds</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={submit} noValidate>

          {/* Row 1 — Name + Email */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full Name *</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="auth-input auth-input-icon-pad"
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={handle}
                  required
                  autoFocus
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email Address * <span className="auth-badge-used">Used to sign in</span>
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="auth-input auth-input-icon-pad"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handle}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp — full width, clearly labelled as contact detail */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="whatsapp">
              WhatsApp Number *
              <span className="auth-badge-info">For order updates only — not used to login</span>
            </label>
            <div className="auth-input-wrap">
              <span className="auth-prefix">📱 +91</span>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                className="auth-input auth-input-with-prefix"
                placeholder="9876543210"
                value={form.whatsapp}
                onChange={handle}
                maxLength={10}
                required
              />
            </div>
            <span className="auth-field-hint">
              We'll send order confirmations &amp; delivery updates via WhatsApp.
            </span>
          </div>

          {/* Row 2 — Password + Confirm */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password *</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  className="auth-input auth-input-with-toggle"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm">Confirm Password *</label>
              <div className="auth-input-wrap">
                <input
                  id="confirm"
                  name="confirm"
                  type={showPass ? "text" : "password"}
                  className={`auth-input auth-input-with-toggle${passwordMismatch ? " input-error" : ""}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handle}
                  required
                  autoComplete="new-password"
                />
              </div>
              {passwordMismatch && (
                <span className="auth-field-error">Passwords don't match</span>
              )}
              {form.confirm && !passwordMismatch && (
                <span className="auth-field-ok">✓ Passwords match</span>
              )}
            </div>
          </div>

          {/* Benefits strip */}
          <div className="auth-benefits">
            <span className="auth-benefit">✓ Exclusive member discounts</span>
            <span className="auth-benefit">✓ Order tracking via WhatsApp</span>
            <span className="auth-benefit">✓ Early access to new collections</span>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            <span className="auth-submit-shine" />
            {loading ? <span className="auth-spinner" /> : "Create My Account →"}
          </button>
        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <Link to="/signin" className="auth-alt-btn">Sign In Instead</Link>

        <p className="auth-footer-note">
          Your email is used to sign in. WhatsApp is for order updates only — we never spam.
        </p>
      </div>
    </div>
  );
}