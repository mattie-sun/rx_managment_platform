/**
 * Insurance Service
 * Handles all insurance-related database operations
 */

import { query, queryOne, execute } from '../database/connection.js';
import { generateUUID, getCurrentDateTime } from '@medication-management/shared';

/**
 * Creates a new insurance policy
 * @param {Object} insuranceData - Insurance data to insert
 * @returns {Object} Created insurance policy
 */
export function createInsurance(insuranceData) {
  const id = generateUUID();
  const now = getCurrentDateTime();
  
  const sql = `
    INSERT INTO insurance (
      id, userId, insuranceCompany, policyNumber, groupNumber, planType, planName,
      rxBIN, rxPCN, rxGroup, deductible, deductibleMet, outOfPocketMax, outOfPocketMet,
      effectiveDate, terminationDate, isActive, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  execute(sql, [
    id,
    insuranceData.userId,
    insuranceData.insuranceCompany,
    insuranceData.policyNumber,
    insuranceData.groupNumber || null,
    insuranceData.planType,
    insuranceData.planName,
    insuranceData.rxBIN,
    insuranceData.rxPCN || null,
    insuranceData.rxGroup || null,
    insuranceData.deductible || 0,
    insuranceData.deductibleMet || 0,
    insuranceData.outOfPocketMax || 0,
    insuranceData.outOfPocketMet || 0,
    insuranceData.effectiveDate,
    insuranceData.terminationDate || null,
    insuranceData.isActive !== false ? 1 : 0,
    now,
    now
  ]);
  
  return getInsuranceById(id);
}

/**
 * Gets insurance by ID
 * @param {string} id - Insurance ID
 * @returns {Object|null} Insurance object or null if not found
 */
export function getInsuranceById(id) {
  const sql = `SELECT * FROM insurance WHERE id = ?`;
  const row = queryOne(sql, [id]);
  
  if (!row) return null;
  
  return formatInsuranceFromDb(row);
}

/**
 * Gets all insurance policies for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of insurance policies
 */
export function getInsuranceByUserId(userId) {
  const sql = `
    SELECT * FROM insurance 
    WHERE userId = ? 
    ORDER BY createdAt DESC
  `;
  
  const rows = query(sql, [userId]);
  return rows.map(formatInsuranceFromDb);
}

/**
 * Gets active insurance for a user
 * @param {string} userId - User ID
 * @returns {Object|null} Active insurance or null
 */
export function getActiveInsuranceByUserId(userId) {
  const sql = `
    SELECT * FROM insurance 
    WHERE userId = ? AND isActive = 1
    ORDER BY createdAt DESC
    LIMIT 1
  `;
  
  const row = queryOne(sql, [userId]);
  
  if (!row) return null;
  
  return formatInsuranceFromDb(row);
}

/**
 * Updates insurance
 * @param {string} id - Insurance ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated insurance or null if not found
 */
export function updateInsurance(id, updates) {
  const insurance = getInsuranceById(id);
  if (!insurance) return null;
  
  const now = getCurrentDateTime();
  
  const sql = `
    UPDATE insurance SET
      insuranceCompany = ?,
      policyNumber = ?,
      groupNumber = ?,
      planType = ?,
      planName = ?,
      rxBIN = ?,
      rxPCN = ?,
      rxGroup = ?,
      deductible = ?,
      deductibleMet = ?,
      outOfPocketMax = ?,
      outOfPocketMet = ?,
      effectiveDate = ?,
      terminationDate = ?,
      isActive = ?,
      updatedAt = ?
    WHERE id = ?
  `;
  
  execute(sql, [
    updates.insuranceCompany || insurance.insuranceCompany,
    updates.policyNumber || insurance.policyNumber,
    updates.groupNumber !== undefined ? updates.groupNumber : insurance.groupNumber,
    updates.planType || insurance.planType,
    updates.planName || insurance.planName,
    updates.rxBIN || insurance.rxBIN,
    updates.rxPCN !== undefined ? updates.rxPCN : insurance.rxPCN,
    updates.rxGroup !== undefined ? updates.rxGroup : insurance.rxGroup,
    updates.deductible !== undefined ? updates.deductible : insurance.deductible,
    updates.deductibleMet !== undefined ? updates.deductibleMet : insurance.deductibleMet,
    updates.outOfPocketMax !== undefined ? updates.outOfPocketMax : insurance.outOfPocketMax,
    updates.outOfPocketMet !== undefined ? updates.outOfPocketMet : insurance.outOfPocketMet,
    updates.effectiveDate || insurance.effectiveDate,
    updates.terminationDate !== undefined ? updates.terminationDate : insurance.terminationDate,
    updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : insurance.isActive,
    now,
    id
  ]);
  
  return getInsuranceById(id);
}

/**
 * Deletes insurance
 * @param {string} id - Insurance ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteInsurance(id) {
  const insurance = getInsuranceById(id);
  if (!insurance) return false;
  
  const sql = `DELETE FROM insurance WHERE id = ?`;
  execute(sql, [id]);
  
  return true;
}

/**
 * Formats an insurance row from database to application format
 * @param {Object} row - Database row
 * @returns {Object} Formatted insurance object
 */
function formatInsuranceFromDb(row) {
  return {
    id: row.id,
    userId: row.userId,
    insuranceCompany: row.insuranceCompany,
    policyNumber: row.policyNumber,
    groupNumber: row.groupNumber,
    planType: row.planType,
    planName: row.planName,
    rxBIN: row.rxBIN,
    rxPCN: row.rxPCN,
    rxGroup: row.rxGroup,
    deductible: row.deductible,
    deductibleMet: row.deductibleMet,
    outOfPocketMax: row.outOfPocketMax,
    outOfPocketMet: row.outOfPocketMet,
    effectiveDate: row.effectiveDate,
    terminationDate: row.terminationDate,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}
