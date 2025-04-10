import axios from 'axios';
import { API_URL } from './api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthResponse {
  success: boolean;
  data: User;
}

// Register user
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    if (response.data.success) {
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } else {
      throw new Error('アカウント作成に失敗しました');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'アカウント作成に失敗しました');
    }
    throw new Error('サーバーに接続できませんでした');
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success) {
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } else {
      throw new Error('認証に失敗しました');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || '認証に失敗しました');
    }
    throw new Error('サーバーに接続できませんでした');
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = async (): Promise<User | null> => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return null;
  }

  try {
    const user: User = JSON.parse(userString);
    
    // Validate token by calling the me endpoint
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.data.success) {
      return user;
    } else {
      // If the token is invalid, remove it from localStorage
      localStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    // If there's an error, the token is probably invalid
    localStorage.removeItem('user');
    return null;
  }
};

// Get auth header
export const getAuthHeader = (): { Authorization: string } | {} => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return {};
  }

  const user: User = JSON.parse(userString);
  return {
    Authorization: `Bearer ${user.token}`,
  };
};