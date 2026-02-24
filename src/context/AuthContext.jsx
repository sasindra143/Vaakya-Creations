/**
 * src/context/AuthContext.jsx
 * ✅ FIXED: login() now actually resolves — no infinite loading
 * ✅ Users persisted to localStorage
 * ✅ Admin seeded: admin@vaakya.com / admin123
 * ✅ register() checks for duplicate email
 */

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY   = "vc_users";
const SESSION_KEY   = "vc_session";

/* ── Seed default admin ── */
const DEFAULT_USERS = [
  {
    id:       "admin-001",
    name:     "Admin",
    email:    "admin@vaakya.com",
    whatsapp: "9999999999",
    password: "admin123",
    role:     "admin",
  },
];

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    /* Ensure admin always exists */
    const hasAdmin = parsed.some((u) => u.email === "admin@vaakya.com");
    if (!hasAdmin) {
      const merged = [...DEFAULT_USERS, ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [users,       setUsers]       = useState(getUsers);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  /* Persist session */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  /* ── LOGIN ── */
  const login = ({ email, password }) => {
    const allUsers = getUsers(); /* always read fresh */
    const found = allUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) {
      return { ok: false, error: "Invalid email or password. Please try again." };
    }
    const { password: _pw, ...safe } = found;
    setCurrentUser(safe);
    return { ok: true };
  };

  /* ── REGISTER ── */
  const register = ({ name, email, whatsapp, password }) => {
    const allUsers = getUsers();
    const exists = allUsers.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id:       `user-${Date.now()}`,
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      password,
      role:     "customer",
    };
    const updated = [...allUsers, newUser];
    saveUsers(updated);
    setUsers(updated);
    const { password: _pw, ...safe } = newUser;
    setCurrentUser(safe);
    return { ok: true };
  };

  /* ── LOGOUT ── */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthContext };