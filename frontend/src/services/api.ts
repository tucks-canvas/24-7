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

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    // Format exactly like the working PowerShell example
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

// Similarly update loginUser
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