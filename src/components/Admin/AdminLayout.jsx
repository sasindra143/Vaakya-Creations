/**
 * src/components/Admin/AdminLayout.jsx
 * Complete dark admin sidebar layout for Vaakya Creations
 */

import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

/* ── SVG Icons ── */
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconProducts = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconStore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: IconDashboard },
  { to: "/admin/products",  label: "Products",  Icon: IconProducts  },
  { to: "/admin/orders",    label: "Orders",    Icon: IconOrders    },
];

export default function AdminLayout() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const [collapsed, setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Page label for mobile topbar */
  const currentPage = NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ?? "Admin";

  return (
    <div className={`al-root${collapsed ? " al-collapsed" : ""}${mobileOpen ? " al-mob-open" : ""}`}>

      {/* Mobile backdrop */}
      <div className="al-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />

      {/* ════ SIDEBAR ════ */}
      <aside className="al-sidebar">

        {/* Brand */}
        <div className="al-brand">
          <div className="al-brand-logo">VC</div>
          {!collapsed && (
            <div className="al-brand-text">
              <span className="al-brand-name">Vaakya Admin</span>
              <span className="al-brand-sub">Control Panel</span>
            </div>
          )}
          <button
            className="al-toggle-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        {/* Divider */}
        <div className="al-divider" />

        {/* Navigation */}
        <nav className="al-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `al-nav-link${isActive ? " al-active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <span className="al-nav-icon"><Icon /></span>
              {!collapsed && <span className="al-nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="al-sidebar-bottom">
          <div className="al-divider" />

          <button
            className="al-bottom-btn"
            onClick={() => navigate("/")}
            title={collapsed ? "View Store" : undefined}
          >
            <IconStore />
            {!collapsed && <span>View Store</span>}
          </button>

          <button
            className="al-bottom-btn al-logout-btn"
            onClick={() => navigate("/")}
            title={collapsed ? "Logout" : undefined}
          >
            <IconLogout />
            {!collapsed && <span>Logout</span>}
          </button>

          {!collapsed && (
            <div className="al-user-card">
              <div className="al-user-avatar">VA</div>
              <div className="al-user-info">
                <span className="al-user-name">Vaakya Creations</span>
                <span className="al-user-role">Administrator</span>
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* ════ MAIN CONTENT ════ */}
      <div className="al-main">

        {/* Mobile topbar */}
        <div className="al-topbar">
          <button
            className="al-topbar-menu"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <span className="al-topbar-title">Vaakya Admin — {currentPage}</span>
          <button
            className="al-topbar-store"
            onClick={() => navigate("/")}
          >
            View Store →
          </button>
        </div>

        {/* Page content */}
        <div className="al-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}