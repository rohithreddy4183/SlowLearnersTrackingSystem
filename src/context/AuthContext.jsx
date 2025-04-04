"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Sample user data
const sampleUsers = [
  { id: 1, username: "admin", password: "admin", name: "Admin User", role: "admin" },
  { id: 2, username: "faculty", password: "faculty", name: "Faculty User", role: "faculty" },
  { id: 3, username: "REG0001", password: "REG0001", name: "Student User", role: "student", regNo: "CSE001" },
];

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Find user in sample data
    const foundUser = sampleUsers.find((u) => u.username === username && u.password === password);

    if (foundUser) {
      // Remove password before storing
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      sessionStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user"); // Clears user session on logout
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
