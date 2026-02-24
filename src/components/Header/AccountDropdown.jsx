/**
 * src/components/Header/AccountDropdown.jsx
 * Dropdown shown when logged-in user clicks account button
 */

import { useNavigate } from "react-router-dom";
import "./AccountDropdown.css";

const AccountDropdown = ({ user, onClose, onLogout }) => {
  const navigate = useNavigate();

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div className="acd-root" role="menu">
      {/* User info header */}
      <div className="acd-header">
        <div className="acd-avatar">
          {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div className="acd-user-info">
          <strong className="acd-name">{user.name}</strong>
          <span className="acd-whatsapp">📱 {user.whatsapp}</span>
          {user.email && <span className="acd-email">{user.email}</span>}
        </div>
      </div>

      <div className="acd-divider" />

      <button className="acd-item" onClick={() => go("/orders")} role="menuitem">
        <span>🛍️</span> My Orders
      </button>
      <button className="acd-item" onClick={() => go("/wishlist")} role="menuitem">
        <span>♥</span> Wishlist
      </button>
      <button className="acd-item" onClick={() => go("/profile")} role="menuitem">
        <span>👤</span> My Profile
      </button>

      {user.role === "admin" && (
        <>
          <div className="acd-divider" />
          <button className="acd-item acd-admin" onClick={() => go("/admin/dashboard")} role="menuitem">
            <span>⚙️</span> Admin Panel
          </button>
        </>
      )}

      <div className="acd-divider" />
      <button className="acd-item acd-logout" onClick={onLogout} role="menuitem">
        <span>🚪</span> Sign Out
      </button>
    </div>
  );
};

export default AccountDropdown;