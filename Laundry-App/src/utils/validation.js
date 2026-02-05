/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate OTP format (6 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if OTP is valid
 */
export const isValidOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validate form fields
 * @param {Object} fields - Object containing form fields
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateForm = (fields, requiredFields = []) => {
  const errors = {};
  let isValid = true;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!fields[field] || fields[field].trim() === '') {
      errors[field] = `${field} is required`;
      isValid = false;
    }
  });
  
  // Validate email if present
  if (fields.email && !isValidEmail(fields.email)) {
    errors.email = 'Invalid email format';
    isValid = false;
  }
  
  // Validate phone if present
  if (fields.phone && !isValidPhone(fields.phone)) {
    errors.phone = 'Invalid phone number format (must be 10 digits)';
    isValid = false;
  }
  
  return { isValid, errors };
};