

export const BASE_URL = 'https://api.laundryapp.com/v1';

export const ENDPOINTS = {

  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  REGISTER: '/auth/register',
  
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  SERVICES: '/services',
  
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  
  DELIVERY: '/delivery',
  COLLECTION: '/collection',
};