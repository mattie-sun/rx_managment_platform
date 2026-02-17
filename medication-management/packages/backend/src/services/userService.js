/**
 * User Service
 * Handles all user-related database operations
 */

import { query, queryOne, execute } from '../database/connection.js';
import { generateUUID, getCurrentDateTime } from '@medication-management/shared';

/**
 * Creates a new user in the database
 * @param {Object} userData - User data to insert
 * @returns {Object} Created user
 */
export function createUser(userData) {
  const id = generateUUID();
  const now = getCurrentDateTime();
  
  const sql = `
    INSERT INTO users (
      id, email, firstName, lastName, dateOfBirth, phoneNumber,
      addressStreet, addressCity, addressState, addressZipCode,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  execute(sql, [
    id,
    userData.email,
    userData.firstName,
    userData.lastName,
    userData.dateOfBirth,
    userData.phoneNumber,
    userData.address.street,
    userData.address.city,
    userData.address.state,
    userData.address.zipCode,
    now,
    now
  ]);
  
  return getUserById(id);
}

/**
 * Gets a user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
export function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  const row = queryOne(sql, [id]);
  
  if (!row) return null;
  
  return formatUserFromDb(row);
}

/**
 * Gets a user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
export function getUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const row = queryOne(sql, [email]);
  
  if (!row) return null;
  
  return formatUserFromDb(row);
}

/**
 * Gets all users with pagination
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated users
 */
export function getAllUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const countSql = `SELECT COUNT(*) as total FROM users`;
  const { total } = queryOne(countSql);
  
  const dataSql = `
    SELECT * FROM users
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `;
  
  const rows = query(dataSql, [limit, offset]);
  const users = rows.map(formatUserFromDb);
  
  return {
    items: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

/**
 * Updates a user
 * @param {string} id - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated user or null if not found
 */
export function updateUser(id, updates) {
  const user = getUserById(id);
  if (!user) return null;
  
  const now = getCurrentDateTime();
  
  const sql = `
    UPDATE users SET
      email = ?,
      firstName = ?,
      lastName = ?,
      dateOfBirth = ?,
      phoneNumber = ?,
      addressStreet = ?,
      addressCity = ?,
      addressState = ?,
      addressZipCode = ?,
      updatedAt = ?
    WHERE id = ?
  `;
  
  const address = updates.address || user.address;
  
  execute(sql, [
    updates.email || user.email,
    updates.firstName || user.firstName,
    updates.lastName || user.lastName,
    updates.dateOfBirth || user.dateOfBirth,
    updates.phoneNumber || user.phoneNumber,
    address.street,
    address.city,
    address.state,
    address.zipCode,
    now,
    id
  ]);
  
  return getUserById(id);
}

/**
 * Deletes a user
 * @param {string} id - User ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteUser(id) {
  const user = getUserById(id);
  if (!user) return false;
  
  const sql = `DELETE FROM users WHERE id = ?`;
  execute(sql, [id]);
  
  return true;
}

/**
 * Formats a user row from database to application format
 * @param {Object} row - Database row
 * @returns {Object} Formatted user object
 */
function formatUserFromDb(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    dateOfBirth: row.dateOfBirth,
    phoneNumber: row.phoneNumber,
    address: {
      street: row.addressStreet,
      city: row.addressCity,
      state: row.addressState,
      zipCode: row.addressZipCode
    },
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}
