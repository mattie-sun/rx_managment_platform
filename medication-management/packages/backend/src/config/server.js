/**
 * Server Configuration
 * Contains all server-related configuration settings
 */

/**
 * Port number for the Express server
 * Can be overridden by environment variable
 */
export const PORT = process.env.PORT || 3001;

/**
 * CORS configuration
 * Allows frontend to communicate with backend
 */
export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite's default port
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * API configuration
 */
export const API_PREFIX = '/api';

/**
 * Environment
 */
export const NODE_ENV = process.env.NODE_ENV || 'development';
