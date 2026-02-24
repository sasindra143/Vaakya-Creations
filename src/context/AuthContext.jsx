/**
 * src/context/AuthContext.jsx
 * ✅ Tracks joinedAt on registration
 * ✅ Tracks lastLogin on every sign-in
 * ✅ Persists all users to localStorage
 * ✅ toggleUserStatus for admin
 * ✅ Admin pre-seeded
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

/* ── Seed admin user ── */
const ADMIN_SEED = {
  id: "admin-001",
  name: "Admin",
  email: "admin@vaakya.com",
  whatsapp: "919999999999",
  password: "admin123",
  role: "admin",
  isActive: true,
  joinedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
  lastLogin: null,
};

function loadUsers() {
  try {
    const raw = localStorage.getItem("vc_users");
    if (!raw) return [ADMIN_SEED];
    const parsed = JSON.parse(raw);
    // Always ensure admin exists
    const hasAdmin = parsed.some((u) => u.email === "admin@vaakya.com");
    if (!hasAdmin) return [ADMIN_SEED, ...parsed];
    return parsed;
  } catch {
    return [ADMIN_SEED];
  }
}

function saveUsers(users) {
  localStorage.setItem("vc_users", JSON.stringify(users));
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem("vc_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem("vc_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("vc_current_user");
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);

  /* Persist users whenever they change */
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  /* Persist currentUser whenever it changes */
  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  /* ── REGISTER ── */
  const register = useCallback((form) => {
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === form.email.trim().toLowerCase()
    );
    if (emailExists) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const waExists = users.some((u) => u.whatsapp === form.whatsapp.trim());
    if (waExists) {
      return { ok: false, error: "This WhatsApp number is already registered." };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: form.whatsapp.trim(),
      password: form.password,
      role: "customer",
      isActive: true,
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Auto login after register
    const { password: _p, ...safeUser } = newUser;
    setCurrentUser(safeUser);

    return { ok: true };
  }, [users]);

  /* ── LOGIN ── */
  const login = useCallback(({ email, password }) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return { ok: false, error: "No account found with this email address." };
    }
    if (user.password !== password) {
      return { ok: false, error: "Incorrect password. Please try again." };
    }
    if (!user.isActive) {
      return { ok: false, error: "Your account has been deactivated. Contact support." };
    }

    // Update lastLogin timestamp in users list
    const now = new Date().toISOString();
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: now } : u
    );
    setUsers(updatedUsers);

    const { password: _p, ...safeUser } = { ...user, lastLogin: now };
    setCurrentUser(safeUser);

    return { ok: true, user: safeUser };
  }, [users]);

  /* ── LOGOUT ── */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  /* ── TOGGLE USER STATUS (Admin) ── */
  const toggleUserStatus = useCallback((userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  }, []);

  /* ── UPDATE PROFILE ── */
  const updateProfile = useCallback((updates) => {
    if (!currentUser) return { ok: false, error: "Not logged in." };

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);

    const updatedCurrent = { ...currentUser, ...updates };
    setCurrentUser(updatedCurrent);
    return { ok: true };
  }, [currentUser, users]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      register,
      login,
      logout,
      toggleUserStatus,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}