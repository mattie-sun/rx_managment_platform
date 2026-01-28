import { ErrorCode } from '../constants.js';

/**
 * API Response Utilities
 * Helper functions for creating consistent API responses
 */

/**
 * Creates a success response
 * @param {*} data - Data to return
 * @param {string} message - Optional success message
 * @returns {Object} Standardized success response
 */
export function createSuccessResponse(data, message) {
  return {
    success: true,
    data,
    message: message || undefined
  };
}

/**
 * Creates an error response
 * @param {string} code - Error code from ErrorCode constants
 * @param {string} message - User-friendly error message
 * @param {*} details - Optional additional error details
 * @returns {Object} Standardized error response
 */
export function createErrorResponse(code, message, details) {
  return {
    success: false,
    error: {
      code,
      message,
      details: details || undefined
    }
  };
}

/**
 * Creates a validation error response
 * @param {string[]} errors - Array of validation error messages
 * @returns {Object} Standardized validation error response
 */
export function createValidationErrorResponse(errors) {
  return createErrorResponse(
    ErrorCode.VALIDATION_ERROR,
    'Validation failed',
    { errors }
  );
}

/**
 * Creates a not found error response
 * @param {string} resource - Name of the resource that wasn't found
 * @returns {Object} Standardized not found error response
 */
export function createNotFoundResponse(resource) {
  return createErrorResponse(
    ErrorCode.NOT_FOUND,
    `${resource} not found`
  );
}

/**
 * Creates a paginated response
 * @param {Array} items - Array of items for current page
 * @param {number} total - Total number of items across all pages
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Object} Standardized paginated response
 */
export function createPaginatedResponse(items, total, page, limit) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}