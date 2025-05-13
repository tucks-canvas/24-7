import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://10.10.14.136:5000/api/v1'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      username: credentials.email,
      password: credentials.password
    });
    
    if (response.data.token) {
      await SecureStore.setItemAsync('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};