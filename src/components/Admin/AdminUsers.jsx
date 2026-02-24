/**
 * src/components/Admin/AdminUsers.jsx
 * ✅ Full user list with WhatsApp, login status, join date
 * ✅ Toggle active/inactive
 * ✅ Shows who is currently logged in (Online badge)
 * ✅ Status: Active when logged in session, Inactive when logged out
 * ✅ More dropdown → View Orders, Wishlist, Cart per user
 * ✅ Search & filter
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminUsers.css";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
  );
};

// ─── More Dropdown ────────────────────────────────────────────────────────────
function MoreDropdown({ user, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="more-dropdown" ref={ref}>
      <button
        className="btn-more"
        onClick={() => setOpen((p) => !p)}
        title="More options"
      >
        ⋯
      </button>
      {open && (
        <div className="dropdown-menu">
          <button onClick={() => { setOpen(false); onView(user); }}>
            👤 View Profile
          </button>
          <button onClick={() => go(`/admin/orders?userId=${user.id}`)}>
            📦 View Orders
          </button>
          <button onClick={() => go(`/admin/wishlist?userId=${user.id}`)}>
            ❤️ Wishlist
          </button>
          <button onClick={() => go(`/admin/cart?userId=${user.id}`)}>
            🛒 Cart
          </button>
        </div>
      )}
    </div>
  );
}

// ─── User Profile Modal ───────────────────────────────────────────────────────
function UserProfileModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-avatar">
          {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <h2 className="modal-name">{user.name}</h2>
        <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
          {user.isActive ? "● Active" : "○ Inactive"}
        </span>
        <div className="modal-details">
          <div><span>📱 WhatsApp</span><strong>{user.whatsapp}</strong></div>
          <div><span>📧 Email</span><strong>{user.email || "—"}</strong></div>
          <div><span>📅 Joined</span><strong>{formatDate(user.joinedAt)}</strong></div>
          <div><span>🕐 Last Login</span><strong>{formatTime(user.lastLogin)}</strong></div>
          <div><span>🔖 Role</span><strong style={{ textTransform: "capitalize" }}>{user.role}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminUsers() {
  const { getAllUsers, toggleUserStatus, currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive
  const [sort, setSort] = useState("newest");
  const [viewUser, setViewUser] = useState(null);

  const users = getAllUsers();

  // A user is considered "currently online" only if they are the active session
  const isCurrentlyLoggedIn = (user) => currentUser?.id === user.id;

  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.whatsapp.includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    if (filter === "active") list = list.filter((u) => u.isActive);
    if (filter === "inactive") list = list.filter((u) => !u.isActive);
    if (sort === "newest") list.sort((a, b) => (b.joinedAt > a.joinedAt ? 1 : -1));
    if (sort === "oldest") list.sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [users, search, filter, sort]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
      online: currentUser && currentUser.role !== "admin" ? 1 : 0,
    }),
    [users, currentUser]
  );

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="au-header">
        <div>
          <h1>User Management</h1>
          <p>All registered customers</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="au-stats">
        {[
          { label: "Total Users", value: stats.total, icon: "👥" },
          { label: "Active", value: stats.active, icon: "✅" },
          { label: "Inactive", value: stats.inactive, icon: "🚫" },
          { label: "Online Now", value: stats.online, icon: "🟢" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="au-controls">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>

        <div className="filter-tabs">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              className={`tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">A–Z Name</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>👥</span>
          <p>No users found</p>
        </div>
      ) : (
        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => {
                const online = isCurrentlyLoggedIn(user);
                // Status reflects live session: if this user IS the current session → Active, else use isActive field
                const displayActive = online ? true : user.isActive;

                return (
                  <tr key={user.id} className={online ? "row-online" : ""}>
                    <td>{idx + 1}</td>

                    {/* User cell */}
                    <td>
                      <div className="user-cell">
                        <div className={`avatar ${online ? "avatar-online" : ""}`}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <div className="user-badges">
                            {online && (
                              <span className="badge-online">● Online</span>
                            )}
                            {user.role === "admin" && (
                              <span className="badge-admin">Admin</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>📱 {user.whatsapp}</td>
                    <td>{user.email || "—"}</td>
                    <td>{formatDate(user.joinedAt)}</td>
                    <td>{formatTime(user.lastLogin)}</td>

                    {/* Status — Active when logged in, Inactive when logged out */}
                    <td>
                      <span
                        className={`status-badge ${
                          displayActive ? "active" : "inactive"
                        }`}
                      >
                        {displayActive ? "● Active" : "○ Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        <a
                          href={`https://wa.me/${user.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-whatsapp"
                        >
                          💬
                        </a>

                        <button
                          className={`btn-toggle ${
                            user.isActive ? "deactivate" : "activate"
                          }`}
                          onClick={() => toggleUserStatus(user.id)}
                          title={
                            user.isActive ? "Deactivate user" : "Activate user"
                          }
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>

                        {/* More dropdown → Orders, Wishlist, Cart */}
                        <MoreDropdown
                          user={user}
                          onView={(u) => setViewUser(u)}
                        />
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
        Showing {filtered.length} of {users.length} users
      </p>

      {/* Profile Modal */}
      <UserProfileModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  );
}