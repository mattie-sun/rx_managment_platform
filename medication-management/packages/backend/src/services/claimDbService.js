/**
 * Claim Database Service
 * Handles storing and retrieving claims from the database
 */

import { query, queryOne, execute } from '../database/connection.js';
import { generateUUID, getCurrentDateTime } from '@medication-management/shared';

/**
 * Creates a new claim in the database
 * @param {Object} claimData - Claim data to insert
 * @returns {Object} Created claim
 */
export function createClaim(claimData) {
  const id = generateUUID();
  const now = getCurrentDateTime();
  
  const sql = `
    INSERT INTO claims (
      id, prescriptionId, insuranceId, userId, claimNumber, pharmacyClaimId,
      status, denialReason, statusMessage, medicationCost, dispensingFee,
      totalCost, insurancePays, patientPays, copay, coinsurance, deductibleApplied,
      adjudicationSteps, submittedAt, adjudicatedAt, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const costBreakdown = claimData.costBreakdown || {};
  
  execute(sql, [
    id,
    claimData.prescriptionId,
    claimData.insuranceId,
    claimData.userId,
    claimData.claimNumber || `CLM-${Date.now()}`,
    claimData.pharmacyClaimId || null,
    claimData.status,
    claimData.denialReason || null,
    claimData.statusMessage,
    costBreakdown.medicationCost || null,
    costBreakdown.dispensingFee || null,
    costBreakdown.totalCost || null,
    costBreakdown.insurancePays || null,
    costBreakdown.patientPays || null,
    costBreakdown.copay || null,
    costBreakdown.coinsurance || null,
    costBreakdown.deductibleApplied || null,
    JSON.stringify(claimData.adjudicationSteps || []),
    now,
    now,
    now,
    now
  ]);
  
  return getClaimById(id);
}

/**
 * Gets claim by ID
 * @param {string} id - Claim ID
 * @returns {Object|null} Claim object or null if not found
 */
export function getClaimById(id) {
  const sql = `SELECT * FROM claims WHERE id = ?`;
  const row = queryOne(sql, [id]);
  
  if (!row) return null;
  
  return formatClaimFromDb(row);
}

/**
 * Gets all claims for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of claims
 */
export function getClaimsByUserId(userId) {
  const sql = `
    SELECT * FROM claims 
    WHERE userId = ? 
    ORDER BY createdAt DESC
  `;
  
  const rows = query(sql, [userId]);
  return rows.map(formatClaimFromDb);
}

/**
 * Gets claims by prescription ID
 * @param {string} prescriptionId - Prescription ID
 * @returns {Array} Array of claims
 */
export function getClaimsByPrescriptionId(prescriptionId) {
  const sql = `
    SELECT * FROM claims 
    WHERE prescriptionId = ? 
    ORDER BY createdAt DESC
  `;
  
  const rows = query(sql, [prescriptionId]);
  return rows.map(formatClaimFromDb);
}

/**
 * Formats a claim row from database to application format
 * @param {Object} row - Database row
 * @returns {Object} Formatted claim object
 */
function formatClaimFromDb(row) {
  const claim = {
    id: row.id,
    prescriptionId: row.prescriptionId,
    insuranceId: row.insuranceId,
    userId: row.userId,
    claimNumber: row.claimNumber,
    pharmacyClaimId: row.pharmacyClaimId,
    status: row.status,
    denialReason: row.denialReason,
    statusMessage: row.statusMessage,
    submittedAt: row.submittedAt,
    adjudicatedAt: row.adjudicatedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
  
  // Add cost breakdown if it exists
  if (row.totalCost !== null) {
    claim.costBreakdown = {
      medicationCost: row.medicationCost,
      dispensingFee: row.dispensingFee,
      totalCost: row.totalCost,
      insurancePays: row.insurancePays,
      patientPays: row.patientPays
    };
    
    if (row.copay !== null) claim.costBreakdown.copay = row.copay;
    if (row.coinsurance !== null) claim.costBreakdown.coinsurance = row.coinsurance;
    if (row.deductibleApplied !== null) claim.costBreakdown.deductibleApplied = row.deductibleApplied;
  }
  
  // Parse adjudication steps
  if (row.adjudicationSteps) {
    try {
      claim.adjudicationSteps = JSON.parse(row.adjudicationSteps);
    } catch (e) {
      claim.adjudicationSteps = [];
    }
  } else {
    claim.adjudicationSteps = [];
  }
  
  return claim;
}
