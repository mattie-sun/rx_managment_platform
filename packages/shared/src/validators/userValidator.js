/**
 * User Validation Utilities
 * Simple validation functions for user-related data
 * Provides functions to check if emails, phone numbers, addresses are valid
 * The main function validateUser() checks everything at once and returns a list of errors if any
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (US format)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\+?1?\d{10,14}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid date format
 */
export function isValidDate(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  // Check if date is actually valid (e.g., not 2023-02-31)
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
}

/**
 * Validates US ZIP code format
 * @param {string} zipCode - ZIP code to validate
 * @returns {boolean} True if valid ZIP format (12345 or 12345-6789)
 */
export function isValidZipCode(zipCode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validates US state code (2 letters)
 * @param {string} state - State code to validate
 * @returns {boolean} True if valid state code
 */
export function isValidStateCode(state) {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'PR', 'VI', 'GU', 'AS', 'MP'
  ];
  return validStates.includes(state?.toUpperCase());
}

/**
 * Validates a complete user object
 * @param {Object} user - User object to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateUser(user) {
  const errors = [];

  // Email validation
  if (!user.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(user.email)) {
    errors.push('Invalid email format');
  }

  // Name validation
  if (!user.firstName || user.firstName.trim().length === 0) {
    errors.push('First name is required');
  } else if (user.firstName.length > 100) {
    errors.push('First name must be 100 characters or less');
  }

  if (!user.lastName || user.lastName.trim().length === 0) {
    errors.push('Last name is required');
  } else if (user.lastName.length > 100) {
    errors.push('Last name must be 100 characters or less');
  }

  // Date of birth validation
  if (!user.dateOfBirth) {
    errors.push('Date of birth is required');
  } else if (!isValidDate(user.dateOfBirth)) {
    errors.push('Date of birth must be in YYYY-MM-DD format');
  }

  // Phone number validation
  if (!user.phoneNumber) {
    errors.push('Phone number is required');
  } else if (!isValidPhoneNumber(user.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  // Address validation
  if (!user.address) {
    errors.push('Address is required');
  } else {
    if (!user.address.street || user.address.street.trim().length === 0) {
      errors.push('Street address is required');
    }

    if (!user.address.city || user.address.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!user.address.state) {
      errors.push('State is required');
    } else if (!isValidStateCode(user.address.state)) {
      errors.push('Invalid state code (must be 2-letter code like CA, NY)');
    }

    if (!user.address.zipCode) {
      errors.push('ZIP code is required');
    } else if (!isValidZipCode(user.address.zipCode)) {
      errors.push('Invalid ZIP code format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}