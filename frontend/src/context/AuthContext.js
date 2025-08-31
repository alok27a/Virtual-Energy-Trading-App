import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

// Create the context with a default value of null.
const AuthContext = createContext(null);

// This is the provider component that will wrap our application.
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
  };

  const signup = async (email, password) => {
    await registerUser(email, password);
  };

  const logout = () => {
    setToken(null);
  };

  // The value that will be available to all children components.
  const value = {
    token,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This is the custom hook that components will use to access the context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // --- FIX ---
  // If a component tries to use this hook outside of the provider,
  // the context will be null, and we can throw a helpful error.
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};