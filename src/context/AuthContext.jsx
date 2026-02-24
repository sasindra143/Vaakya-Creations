/**
 * src/context/AuthContext.jsx
 * Auth with WhatsApp number — stores users in localStorage
 */

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  /* Load from localStorage on mount */
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("vc_users") || "[]");
    const storedUser  = JSON.parse(localStorage.getItem("vc_current_user") || "null");
    setUsers(storedUsers);
    setCurrentUser(storedUser);
  }, []);

  const saveUsers = (list) => {
    setUsers(list);
    localStorage.setItem("vc_users", JSON.stringify(list));
  };

  /* Signup */
  const signup = ({ name, whatsapp, email, password }) => {
    const existing = users.find((u) => u.whatsapp === whatsapp);
    if (existing) return { ok: false, error: "WhatsApp number already registered." };

    const newUser = {
      id:        Date.now().toString(),
      name,
      whatsapp,
      email:     email || "",
      password,
      role:      "user",
      joinedAt:  new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive:  true,
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const safe = { ...newUser }; delete safe.password;
    setCurrentUser(safe);
    localStorage.setItem("vc_current_user", JSON.stringify(safe));
    return { ok: true, user: safe };
  };

  /* Login */
  const login = ({ whatsapp, password }) => {
    const user = users.find((u) => u.whatsapp === whatsapp && u.password === password);
    if (!user) return { ok: false, error: "Invalid WhatsApp number or password." };

    const updated = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    saveUsers(updated);

    const safe = { ...user, lastLogin: new Date().toISOString() }; delete safe.password;
    setCurrentUser(safe);
    localStorage.setItem("vc_current_user", JSON.stringify(safe));
    return { ok: true, user: safe };
  };

  /* Logout */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("vc_current_user");
  };

  /* All users for admin */
  const getAllUsers = () => users.map(({ password: _, ...u }) => u);

  /* Toggle user active status */
  const toggleUserStatus = (id) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, isActive: !u.isActive } : u
    );
    saveUsers(updated);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout, getAllUsers, toggleUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);