/**
 * Prescription Service
 * Handles all prescription-related database operations
 */

import { query, queryOne, execute } from '../database/connection.js';
import { generateUUID, getCurrentDateTime, PrescriptionStatus } from '@medication-management/shared';

/**
 * Creates a new prescription
 * @param {Object} prescriptionData - Prescription data to insert
 * @returns {Object} Created prescription
 */
export function createPrescription(prescriptionData) {
  const id = generateUUID();
  const now = getCurrentDateTime();
  
  const sql = `
    INSERT INTO prescriptions (
      id, userId, insuranceId, medicationName, medicationForm, strength, ndc,
      dosageInstructions, quantity, daysSupply, refillsAllowed, refillsRemaining,
      prescriberName, prescriberNPI, prescribedDate, status, statusMessage,
      pharmacyName, pharmacyNPI, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  execute(sql, [
    id,
    prescriptionData.userId,
    prescriptionData.insuranceId || null,
    prescriptionData.medicationName,
    prescriptionData.medicationForm,
    prescriptionData.strength,
    prescriptionData.ndc || null,
    prescriptionData.dosageInstructions,
    prescriptionData.quantity,
    prescriptionData.daysSupply,
    prescriptionData.refillsAllowed,
    prescriptionData.refillsAllowed, // refillsRemaining starts equal to refillsAllowed
    prescriptionData.prescriberName,
    prescriptionData.prescriberNPI,
    prescriptionData.prescribedDate,
    PrescriptionStatus.PENDING,
    'Prescription pending submission',
    prescriptionData.pharmacyName || null,
    prescriptionData.pharmacyNPI || null,
    now,
    now
  ]);
  
  return getPrescriptionById(id);
}

/**
 * Gets prescription by ID
 * @param {string} id - Prescription ID
 * @returns {Object|null} Prescription object or null if not found
 */
export function getPrescriptionById(id) {
  const sql = `SELECT * FROM prescriptions WHERE id = ?`;
  const row = queryOne(sql, [id]);
  
  if (!row) return null;
  
  return formatPrescriptionFromDb(row);
}

/**
 * Gets all prescriptions for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of prescriptions
 */
export function getPrescriptionsByUserId(userId) {
  const sql = `
    SELECT * FROM prescriptions 
    WHERE userId = ? 
    ORDER BY createdAt DESC
  `;
  
  const rows = query(sql, [userId]);
  return rows.map(formatPrescriptionFromDb);
}

/**
 * Gets prescriptions by status
 * @param {string} userId - User ID
 * @param {string} status - Prescription status
 * @returns {Array} Array of prescriptions
 */
export function getPrescriptionsByStatus(userId, status) {
  const sql = `
    SELECT * FROM prescriptions 
    WHERE userId = ? AND status = ?
    ORDER BY createdAt DESC
  `;
  
  const rows = query(sql, [userId, status]);
  return rows.map(formatPrescriptionFromDb);
}

/**
 * Updates prescription
 * @param {string} id - Prescription ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated prescription or null if not found
 */
export function updatePrescription(id, updates) {
  const prescription = getPrescriptionById(id);
  if (!prescription) return null;
  
  const now = getCurrentDateTime();
  
  const sql = `
    UPDATE prescriptions SET
      status = ?,
      statusMessage = ?,
      refillsRemaining = ?,
      pharmacyName = ?,
      pharmacyNPI = ?,
      updatedAt = ?
    WHERE id = ?
  `;
  
  execute(sql, [
    updates.status || prescription.status,
    updates.statusMessage || prescription.statusMessage,
    updates.refillsRemaining !== undefined ? updates.refillsRemaining : prescription.refillsRemaining,
    updates.pharmacyName !== undefined ? updates.pharmacyName : prescription.pharmacyName,
    updates.pharmacyNPI !== undefined ? updates.pharmacyNPI : prescription.pharmacyNPI,
    now,
    id
  ]);
  
  return getPrescriptionById(id);
}

/**
 * Deletes prescription
 * @param {string} id - Prescription ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deletePrescription(id) {
  const prescription = getPrescriptionById(id);
  if (!prescription) return false;
  
  const sql = `DELETE FROM prescriptions WHERE id = ?`;
  execute(sql, [id]);
  
  return true;
}

/**
 * Formats a prescription row from database to application format
 * @param {Object} row - Database row
 * @returns {Object} Formatted prescription object
 */
function formatPrescriptionFromDb(row) {
  return {
    id: row.id,
    userId: row.userId,
    insuranceId: row.insuranceId,
    medicationName: row.medicationName,
    medicationForm: row.medicationForm,
    strength: row.strength,
    ndc: row.ndc,
    dosageInstructions: row.dosageInstructions,
    quantity: row.quantity,
    daysSupply: row.daysSupply,
    refillsAllowed: row.refillsAllowed,
    refillsRemaining: row.refillsRemaining,
    prescriberName: row.prescriberName,
    prescriberNPI: row.prescriberNPI,
    prescribedDate: row.prescribedDate,
    status: row.status,
    statusMessage: row.statusMessage,
    pharmacyName: row.pharmacyName,
    pharmacyNPI: row.pharmacyNPI,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}
