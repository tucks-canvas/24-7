// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const apiURL = 'http://10.10.14.136:5000'; // Remember to change if at different address or location

const API_BASE_URL = 'http://10.10.14.136:5000/api/v1'; // Remember to change if at different address or location

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add this helper function
const refreshAuthToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await axios.post(`${apiURL}/api/v1/auth/refresh`, {
      refresh_token: refreshToken
    });
    
    await SecureStore.setItemAsync('auth_token', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');
    throw error;
  }
};

// Update photo URL generation
export const getPhotoUrl = (filename: string) => {
  return `${apiURL}/api/v1/photos/${filename}`;
};

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

// Declare logoutUser
export const logoutUser = async () => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    await api.post('/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await SecureStore.deleteItemAsync('auth_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
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
      token: token,
      new_password: newPassword
    });
    
    return {
      success: true,
      message: response.data.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Password update failed',
      details: error.response?.data
    };
  }
};

// Declare user profile
export const getUserProfile = async (userId?: number) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    
    if (!userId) {
      const userJson = await SecureStore.getItemAsync('user');
      if (userJson) {
        userId = JSON.parse(userJson).id;
      }
    }
    
    if (!userId) {
      throw new Error('User ID not available');
    }

    const response = await api.get(`/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    // Ensure profile_photo is properly formatted
    const data = response.data;
    if (data.profile_photo && !data.profile_photo.startsWith('http')) {
      data.profile_photo_url = `${apiURL}/api/v1/photos/${data.profile_photo}`;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching profile:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// Declare user profile by ID
export const updateUserProfile = async (
  userId: number,
  data: { 
    firstname?: string;
    lastname?: string;
    location?: string;
  }
) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    const response = await api.patch(`/users/${userId}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Profile update failed',
      details: error.response?.data?.details || error.message
    };
  }
};

// Declare profile photo by user ID
export const uploadProfilePhoto = async (imageUri: string) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) throw new Error('Authentication token not found');

    let uri = imageUri;
    if (Platform.OS === 'android' && uri.startsWith('file://')) {
      uri = uri.replace('file://', '');
    }

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error('File does not exist');

    const filename = `user_${Date.now()}.${uri.split('.').pop() || 'jpg'}`;
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: `image/${filename.split('.').pop() || 'jpg'}`,
    } as any);

    console.log('Uploading to:', `${API_BASE_URL}/photos`);
    const response = await axios.post(`${API_BASE_URL}/photos`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: () => formData,
    });

    console.log('Upload response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    if (!response.data.url) {
      response.data.url = `${API_BASE_URL}/photos/${response.data.filename}`;
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};