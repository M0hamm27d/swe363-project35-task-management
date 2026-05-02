import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Standard User State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Admin State
  const [adminUser, setAdminUser] = useState(() => {
    const savedAdmin = localStorage.getItem('admin_user');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
      const response = await api.post(endpoint, { email, password });
      
      const userData = response.data;
      
      // Save the token and user details safely in the browser using namespaced keys
      const tokenKey = isAdmin ? 'admin_token' : 'token';
      const userKey = isAdmin ? 'admin_user' : 'user';
      
      localStorage.setItem(tokenKey, userData.token);
      localStorage.setItem(userKey, JSON.stringify(userData));
      
      if (isAdmin) {
        setAdminUser(userData);
      } else {
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      // Return the specific error message from the backend
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/auth/admin/register' : '/auth/register';
      const response = await api.post(endpoint, userData);
      
      const newUserData = response.data;
      
      const tokenKey = isAdmin ? 'admin_token' : 'token';
      const userKey = isAdmin ? 'admin_user' : 'user';

      localStorage.setItem(tokenKey, newUserData.token);
      localStorage.setItem(userKey, JSON.stringify(newUserData));
      
      if (isAdmin) {
        setAdminUser(newUserData);
      } else {
        setUser(newUserData);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = (isAdmin = false) => {
    if (isAdmin) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdminUser(null);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (profileData, isAdmin = false) => {
    try {
      const response = await api.put('/profile', profileData);
      
      const targetKey = isAdmin ? 'admin_user' : 'user';
      const targetState = isAdmin ? adminUser : user;
      const setter = isAdmin ? setAdminUser : setUser;

      if (targetState) {
        const updatedData = { ...targetState, ...response.data.user };
        localStorage.setItem(targetKey, JSON.stringify(updatedData));
        setter(updatedData);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update password' };
    }
  };

  return (
    <UserContext.Provider value={{ user, adminUser, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
