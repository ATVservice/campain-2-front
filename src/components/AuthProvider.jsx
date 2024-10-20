import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create a context to hold our auth data.
const AuthContext = createContext(null);

// 2. Define a provider component that holds and provides auth state to the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

    // Load user from local storage on mount
useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse stored JSON string
    }
    setLoading(false); // Set loading to false after user is loaded

    }, []);
    

  // Login function saves the user data.
  const loginUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function clears the user data.
  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  // If loading, return null
  if (loading) {
    return null;
  }

  // 3. Return the provider component, sharing user and login/logout functions.
  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook to use our AuthContext in any component.
export function useAuth() {
  return useContext(AuthContext);
}
