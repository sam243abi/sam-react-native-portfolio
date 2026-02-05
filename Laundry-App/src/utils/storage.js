import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ADDRESSES: 'user_addresses',
};

/**
 * Save auth token to AsyncStorage
 * @param {string} token - The authentication token
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

/**
 * Get auth token from AsyncStorage
 * @returns {Promise<string|null>} The stored token or null
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save user data to AsyncStorage
 * @param {Object} userData - The user data object
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Get user data from AsyncStorage
 * @returns {Promise<Object|null>} The stored user data or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all app data from AsyncStorage
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Save addresses to AsyncStorage
 * @param {Array} addresses - The addresses array
 */
export const saveAddresses = async (addresses) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
    console.log('✅ Addresses saved to storage:', addresses.length);
  } catch (error) {
    console.error('Error saving addresses:', error);
  }
};

/**
 * Get addresses from AsyncStorage
 * @returns {Promise<Array|null>} The stored addresses or null
 */
export const getAddresses = async () => {
  try {
    const addressesData = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESSES);
    const addresses = addressesData ? JSON.parse(addressesData) : null;
    console.log('📍 Loaded addresses from storage:', addresses ? addresses.length : 0);
    return addresses;
  } catch (error) {
    console.error('Error getting addresses:', error);
    return null;
  }
};

/**
 * Clear addresses from AsyncStorage
 */
export const clearAddresses = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ADDRESSES);
    console.log('🗑️ Addresses cleared from storage');
  } catch (error) {
    console.error('Error clearing addresses:', error);
  }
};