/**
 * Common Utility Functions
 * Reusable helper functions for various operations
 */

/**
 * Generates a UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Formats currency from cents to dollars
 * @param {number} cents - Amount in cents
 * @returns {string} Formatted currency string (e.g., "$12.34")
 */
export function formatCurrency(cents) {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(dollars);
}

/**
 * Converts dollars to cents
 * @param {number} dollars - Amount in dollars
 * @returns {number} Amount in cents
 */
export function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}

/**
 * Converts cents to dollars
 * @param {number} cents - Amount in cents
 * @returns {number} Amount in dollars
 */
export function centsToDollars(cents) {
  return cents / 100;
}

/**
 * Formats a date string to a more readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "January 15, 2024")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Gets current ISO date string (YYYY-MM-DD)
 * @returns {string} Current date in YYYY-MM-DD format
 */
export function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Gets current ISO datetime string
 * @returns {string} Current datetime in ISO 8601 format
 */
export function getCurrentDateTime() {
  return new Date().toISOString();
}

/**
 * Checks if a date is in the past
 * @param {string} dateString - Date string to check (YYYY-MM-DD)
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return date < today;
}

/**
 * Checks if a date is in the future
 * @param {string} dateString - Date string to check (YYYY-MM-DD)
 * @returns {boolean} True if date is in the future
 */
export function isFutureDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return date > today;
}

/**
 * Sanitizes user input by trimming whitespace
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim();
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}