/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
};

/**
 * Format time to readable string
 * @param {string|Date} date - Date to extract time from
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (date, includeSeconds = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid time';
  }
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  
  if (includeSeconds) {
    options.second = '2-digit';
  }
  
  return dateObj.toLocaleTimeString('en-US', options);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format phone number with country code
 * @param {string} phone - Phone number to format
 * @param {string} countryCode - Country code (default: '+91' for India)
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone, countryCode = '+91') => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if country code is already included
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    const number = cleaned.slice(2);
    return `${countryCode} ${number}`;
  }
  
  return `${countryCode} ${cleaned}`;
};