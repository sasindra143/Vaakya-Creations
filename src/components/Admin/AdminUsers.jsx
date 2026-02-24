/**
 * src/components/Admin/AdminUsers.jsx
 * ✅ Shows joinedAt (registration date) for ALL users
 * ✅ Shows lastLogin timestamp
 * ✅ Search by name / email / whatsapp
 * ✅ Filter: all / active / inactive / customers / admins
 * ✅ Sort: newest / oldest / name / last login
 * ✅ Toggle active status
 * ✅ Profile modal with full details
 * ✅ More dropdown (orders, wishlist, cart)
 * ✅ WhatsApp quick link
 * ✅ Mobile responsive table (horizontal scroll)
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminUsers.css";

/* ── Helpers ── */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatDateTime = (iso) => {
  if (!iso) return "Never";
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${time} · ${date}`;
};

const timeAgo = (iso) => {
  if (!iso) return "Never logged in";
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return formatDate(iso);
};

/* ── More Dropdown ── */
function MoreDropdown({ user, onView }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const navigate        = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (path) => { setOpen(false); navigate(path); };

  return (
    <div className="more-dropdown" ref={ref}>
      <button className="btn-more" onClick={() => setOpen(p => !p)} title="More options">⋯</button>
      {open && (
        <div className="dropdown-menu">
          <button onClick={() => { setOpen(false); onView(user); }}>👤 View Profile</button>
          <button onClick={() => go(`/admin/orders?userId=${user.id}`)}>📦 View Orders</button>
          <button onClick={() => go(`/admin/wishlist?userId=${user.id}`)}>❤️ Wishlist</button>
          <button onClick={() => go(`/admin/cart?userId=${user.id}`)}>🛒 Cart</button>
        </div>
      )}
    </div>
  );
}

/* ── Profile Modal ── */
function UserProfileModal({ user, onClose }) {
  if (!user) return null;
  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-avatar">{initials}</div>
        <h2 className="modal-name">{user.name}</h2>
        <div className="modal-badges">
          <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
            {user.isActive ? "● Active" : "○ Inactive"}
          </span>
          {user.role === "admin" && <span className="badge-admin-tag">Admin</span>}
        </div>
        <div className="modal-details">
          <div><span>📱 WhatsApp</span>     <strong>{user.whatsapp || "—"}</strong></div>
          <div><span>📧 Email</span>        <strong>{user.email || "—"}</strong></div>
          <div><span>📅 Registered</span>   <strong>{formatDate(user.joinedAt)}</strong></div>
          <div><span>🕐 Last Login</span>   <strong>{formatDateTime(user.lastLogin)}</strong></div>
          <div><span>🔖 Role</span>         <strong style={{textTransform:"capitalize"}}>{user.role}</strong></div>
          <div><span>🆔 User ID</span>      <strong style={{fontSize:"11px",fontFamily:"monospace"}}>{user.id}</strong></div>
        </div>
        {user.whatsapp && (
          <a
            href={`https://wa.me/${user.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="modal-wa-btn"
          >
            💬 Message on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

/* ════ MAIN COMPONENT ════ */
export default function AdminUsers() {
  const auth              = useAuth();
  const users             = Array.isArray(auth?.users) ? auth.users : [];
  const toggleUserStatus  = typeof auth?.toggleUserStatus === "function" ? auth.toggleUserStatus : () => {};
  const currentUser       = auth?.currentUser || null;

  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [sort,     setSort]     = useState("newest");
  const [viewUser, setViewUser] = useState(null);

  const isOnline = (user) => currentUser?.id === user.id;

  const filtered = useMemo(() => {
    let list = [...users];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.whatsapp?.includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter === "active")    list = list.filter(u => u.isActive);
    if (filter === "inactive")  list = list.filter(u => !u.isActive);
    if (filter === "customers") list = list.filter(u => u.role !== "admin");
    if (filter === "admins")    list = list.filter(u => u.role === "admin");

    // Sort
    if (sort === "newest")     list.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
    if (sort === "oldest")     list.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
    if (sort === "name")       list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sort === "lastlogin")  list.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));

    return list;
  }, [users, search, filter, sort]);

  const stats = useMemo(() => ({
    total:     users.length,
    active:    users.filter(u => u.isActive).length,
    inactive:  users.filter(u => !u.isActive).length,
    customers: users.filter(u => u.role !== "admin").length,
    loggedIn:  users.filter(u => u.lastLogin).length,
  }), [users]);

  return (
    <div className="admin-users">

      {/* ── Header ── */}
      <div className="au-header">
        <div>
          <h1>User Management</h1>
          <p>All registered customers &amp; admins — login and registration data</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="au-stats">
        {[
          { label: "Total Users",    value: stats.total,     icon: "👥" },
          { label: "Active",         value: stats.active,    icon: "✅" },
          { label: "Inactive",       value: stats.inactive,  icon: "🚫" },
          { label: "Customers",      value: stats.customers, icon: "🛍️" },
          { label: "Ever Logged In", value: stats.loggedIn,  icon: "🔐" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filters bar ── */}
      <div className="au-filters">
        <input
          className="au-search"
          type="text"
          placeholder="🔍  Search name, email, WhatsApp…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="au-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="customers">Customers only</option>
          <option value="admins">Admins only</option>
        </select>
        <select className="au-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest registered</option>
          <option value="oldest">Oldest registered</option>
          <option value="lastlogin">Last login</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>👥</span>
          <p>No users found{search ? ` for "${search}"` : ""}</p>
        </div>
      ) : (
        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Contact</th>
                <th>Registered On</th>
                <th>Last Login</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => {
                const online        = isOnline(user);
                const displayActive = online ? true : user.isActive;
                const initials      = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
                return (
                  <tr key={user.id || idx} className={online ? "row-online" : ""}>
                    <td className="col-num">{idx + 1}</td>

                    <td>
                      <div className="user-cell">
                        <div className={`avatar ${online ? "avatar-online" : ""}`}>{initials}</div>
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email || "—"}</span>
                          <div className="user-badges">
                            {online && <span className="badge-online">● Online now</span>}
                            {user.role === "admin" && <span className="badge-admin">Admin</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <span className="cell-wa">📱 {user.whatsapp || "—"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="date-cell">
                        <span className="date-main">{formatDate(user.joinedAt)}</span>
                        <span className="date-sub">Registered</span>
                      </div>
                    </td>

                    <td>
                      <div className="date-cell">
                        <span className="date-main">{timeAgo(user.lastLogin)}</span>
                        {user.lastLogin && (
                          <span className="date-sub" title={formatDateTime(user.lastLogin)}>
                            {formatDateTime(user.lastLogin).split("·")[1]?.trim()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={`role-tag role-${user.role}`}>
                        {user.role === "admin" ? "⚙️ Admin" : "👤 Customer"}
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${displayActive ? "active" : "inactive"}`}>
                        {displayActive ? "● Active" : "○ Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="actions-cell">
                        {user.whatsapp && (
                          <a
                            href={`https://wa.me/${user.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-whatsapp"
                            title="WhatsApp"
                          >
                            💬
                          </a>
                        )}
                        {user.role !== "admin" && (
                          <button
                            className={`btn-toggle ${user.isActive ? "deactivate" : "activate"}`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                        <MoreDropdown user={user} onView={u => setViewUser(u)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="au-footer">
        Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
        {search && ` — filtered by "${search}"`}
      </p>

      <UserProfileModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  );
}