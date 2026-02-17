/**
 * Error Handling Middleware
 * Catches and formats errors in a consistent way
 */

import { createErrorResponse, ErrorCode } from '@medication-management/shared';

/**
 * Global error handler
 * Catches all errors and returns consistent error responses
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);
  
  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  
  const response = createErrorResponse(
    err.code || ErrorCode.INTERNAL_ERROR,
    err.message || 'An unexpected error occurred',
    err.details
  );
  
  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 * Called when no route matches
 */
export function notFoundHandler(req, res) {
  const response = createErrorResponse(
    ErrorCode.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`
  );
  
  res.status(404).json(response);
}

/**
 * Request logging middleware
 * Logs all incoming requests
 */
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
}
