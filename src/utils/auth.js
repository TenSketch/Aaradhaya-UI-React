// src/utils/auth.js
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('user_token');
  const userData = localStorage.getItem('user_data');
  return !!(token && userData);
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getUserDisplayName = () => {
  const user = getCurrentUser();
  return user ? user.name : 'User';
};

export const getUserEmail = () => {
  const user = getCurrentUser();
  return user ? user.email : '';
};
