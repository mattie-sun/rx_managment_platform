/**
 * Database Configuration
 * Configures SQLite database connection and location
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database file location
 * Stored in the backend directory for easy access
 */
export const DB_PATH = path.join(__dirname, '../../data/medication_management.db');

/**
 * Database configuration options
 */
export const DB_CONFIG = {
  // Enable verbose logging in development
  verbose: process.env.NODE_ENV !== 'production',
  
  // Enable foreign key constraints
  fileMustExist: false, // Allow creation of new DB file
};
