/**
 * Database Connection
 * Manages SQLite database connection and provides query methods
 */

import Database from 'better-sqlite3';
import { DB_PATH, DB_CONFIG } from '../config/database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Database connection instance
 * Singleton pattern - only one connection throughout the app
 */
let db = null;

/**
 * Gets or creates the database connection
 * @returns {Database} SQLite database instance
 */
export function getDatabase() {
  if (!db) {
    console.log(`📂 Connecting to database at: ${DB_PATH}`);
    
    db = new Database(DB_PATH, {
      verbose: DB_CONFIG.verbose ? console.log : null
    });
    
    // Enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    console.log('✅ Database connection established');
  }
  
  return db;
}

/**
 * Closes the database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Database connection closed');
  }
}

/**
 * Executes a query that returns multiple rows
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Array} Query results
 */
export function query(sql, params = []) {
  const database = getDatabase();
  return database.prepare(sql).all(params);
}

/**
 * Executes a query that returns a single row
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object|undefined} Query result or undefined
 */
export function queryOne(sql, params = []) {
  const database = getDatabase();
  return database.prepare(sql).get(params);
}

/**
 * Executes a query that modifies data (INSERT, UPDATE, DELETE)
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object} Result with changes and lastInsertRowid
 */
export function execute(sql, params = []) {
  const database = getDatabase();
  return database.prepare(sql).run(params);
}

/**
 * Begins a transaction
 * @param {Function} callback - Function to execute within transaction
 * @returns {*} Result of callback
 */
export function transaction(callback) {
  const database = getDatabase();
  return database.transaction(callback)();
}
