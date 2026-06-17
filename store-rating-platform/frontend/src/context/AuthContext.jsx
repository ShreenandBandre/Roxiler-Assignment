import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return storedUser && token ? JSON.parse(storedUser) : null;
  });

  // Centralized login executor
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, user: loggedUser } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    
    setUser(loggedUser);
    return loggedUser;
  };

  // Centralized signup executor
  const signup = async (name, email, password, address) => {
    const response = await API.post('/auth/signup', { name, email, password, address });
    return response.data;
  };

  // Centralized logout executor
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};