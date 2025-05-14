// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.10.14.136:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Declare registerUser
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password
    };

    console.log('Sending registration:', payload);
    const response = await api.post('/register', payload);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || 'Registration failed',
      details: error.response?.data?.details || error.message
    };
  }
};

// Declare loginUser
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });

    if (response.data.token) {
      await SecureStore.setItemAsync('auth_token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed',
      details: error.response?.data?.details || error.message
    };
  }
};

// Declare requestResetCode
export const requestResetCode = async (email: string) => {
  try {
    const response = await api.post('/auth/request-password-reset', { email });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send code'
    };
  }
};

// Declare verifyResetCode
export const verifyResetCode = async (email: string, code: string) => {
  try {
    const response = await api.post('/auth/verify-reset-code', { 
      email,
      token: code 
    });
    return {
      success: true,
      token: response.data.token 
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Invalid verification code'
    };
  }
};

// Declare updatePassword
export const updatePassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Password update failed'
    };
  }
};

// Declare getUserProfile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/v1/users/me');
    console.error('Fetching error:', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Declare updateUserProfile
export const updateUserProfile = async (data: { name?: string; location?: string }) => {
  try {
    const response = await api.patch('/api/v1/users/me', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Declare logoutUser
export const logoutUser = async () => {
  try {
    await api.post('/api/v1/auth/logout');
    await SecureStore.deleteItemAsync('auth_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};