import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [email, setEmail] = useState(() => localStorage.getItem('email') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  const login = (jwtToken, userEmail, userRole) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('role', userRole);
    setToken(jwtToken);
    setEmail(userEmail);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
