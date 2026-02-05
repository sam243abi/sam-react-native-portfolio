/**
 * User-related API calls
 */

import apiClient from './apiclient';
import { ENDPOINTS } from './urls';

/**
 * Login with phone number
 * @param {string} phoneNumber - User's phone number
 */
export const loginWithPhone = async (phoneNumber) => {
  return apiClient.post(ENDPOINTS.LOGIN, { phoneNumber });
};

/**
 * Verify OTP code
 * @param {string} phoneNumber - User's phone number
 * @param {string} otpCode - OTP code received
 */
export const verifyOtp = async (phoneNumber, otpCode) => {
  return apiClient.post(ENDPOINTS.VERIFY_OTP, { phoneNumber, otpCode });
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  return apiClient.get(ENDPOINTS.USER_PROFILE);
};

/**
 * Update user profile
 * @param {object} profileData - User profile data
 */
export const updateUserProfile = async (profileData) => {
  return apiClient.put(ENDPOINTS.UPDATE_PROFILE, profileData);
};

/**
 * Get user orders
 */
export const getUserOrders = async () => {
  return apiClient.get(ENDPOINTS.ORDERS);
};

export default {
  loginWithPhone,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  getUserOrders,
};