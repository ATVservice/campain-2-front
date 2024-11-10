import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create a context to hold our auth data.
const AuthContext = createContext(null);

// 2. Define a provider component that holds and provides auth state to the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Load token and user from session storage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse stored JSON string for user data
    }

    setLoading(false); // Set loading to false after data is loaded
  }, []);

  // Login function saves the token and user data.
  const loginUser = (token, userData) => {
    setToken(token);
    setUser(userData);

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function clears the token and user data.
  const logoutUser = () => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  // If loading, return null or a loading indicator
  if (loading) {
    return null;
  }

  // 3. Return the provider component, sharing user, token, and login/logout functions.
  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook to use our AuthContext in any component.
export function useAuth() {
  return useContext(AuthContext);
}
