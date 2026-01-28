import { PrescriptionStatus, MedicationForm } from '../constants.js';
import { isValidDate } from './userValidator.js';

/**
 * Prescription Validation Utilities
 * Validation functions for prescription-related data
 */

/**
 * Validates NDC (National Drug Code) format
 * NDC format: 12345-1234-12 (5-4-2 digits)
 * @param {string} ndc - NDC to validate
 * @returns {boolean} True if valid NDC format
 */
export function isValidNDC(ndc) {
  const ndcRegex = /^\d{5}-\d{4}-\d{2}$/;
  return ndcRegex.test(ndc);
}

/**
 * Validates NPI (National Provider Identifier) format
 * NPI is always 10 digits
 * @param {string} npi - NPI to validate
 * @returns {boolean} True if valid NPI format
 */
export function isValidNPI(npi) {
  const npiRegex = /^\d{10}$/;
  return npiRegex.test(npi);
}

/**
 * Validates prescription status
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid status
 */
export function isValidPrescriptionStatus(status) {
  return Object.values(PrescriptionStatus).includes(status);
}

/**
 * Validates medication form
 * @param {string} form - Medication form to validate
 * @returns {boolean} True if valid medication form
 */
export function isValidMedicationForm(form) {
  return Object.values(MedicationForm).includes(form);
}

/**
 * Validates a complete prescription object
 * @param {Object} prescription - Prescription object to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validatePrescription(prescription) {
  const errors = [];

  // Required: User ID
  if (!prescription.userId) {
    errors.push('User ID is required');
  }

  // Optional: Insurance ID (patient may pay cash)
  // No validation needed if not provided

  // Required: Medication name
  if (!prescription.medicationName || prescription.medicationName.trim().length === 0) {
    errors.push('Medication name is required');
  }

  // Required: Medication form
  if (!prescription.medicationForm) {
    errors.push('Medication form is required');
  } else if (!isValidMedicationForm(prescription.medicationForm)) {
    errors.push(`Invalid medication form. Must be one of: ${Object.values(MedicationForm).join(', ')}`);
  }

  // Required: Strength
  if (!prescription.strength || prescription.strength.trim().length === 0) {
    errors.push('Medication strength is required (e.g., "500mg", "10mg/ml")');
  }

  // Optional: NDC validation if provided
  if (prescription.ndc && !isValidNDC(prescription.ndc)) {
    errors.push('NDC must be in format: 12345-1234-12');
  }

  // Required: Dosage instructions
  if (!prescription.dosageInstructions || prescription.dosageInstructions.trim().length === 0) {
    errors.push('Dosage instructions are required');
  }

  // Required: Quantity
  if (prescription.quantity === undefined || prescription.quantity === null) {
    errors.push('Quantity is required');
  } else if (typeof prescription.quantity !== 'number' || prescription.quantity < 1) {
    errors.push('Quantity must be a positive number');
  }

  // Required: Days supply
  if (prescription.daysSupply === undefined || prescription.daysSupply === null) {
    errors.push('Days supply is required');
  } else if (typeof prescription.daysSupply !== 'number' || prescription.daysSupply < 1) {
    errors.push('Days supply must be a positive number');
  }

  // Required: Refills allowed
  if (prescription.refillsAllowed === undefined || prescription.refillsAllowed === null) {
    errors.push('Refills allowed is required');
  } else if (typeof prescription.refillsAllowed !== 'number' || prescription.refillsAllowed < 0) {
    errors.push('Refills allowed must be a non-negative number');
  }

  // Refills remaining validation (if provided)
  if (prescription.refillsRemaining !== undefined) {
    if (typeof prescription.refillsRemaining !== 'number' || prescription.refillsRemaining < 0) {
      errors.push('Refills remaining must be a non-negative number');
    }
    if (prescription.refillsRemaining > prescription.refillsAllowed) {
      errors.push('Refills remaining cannot exceed refills allowed');
    }
  }

  // Required: Prescriber name
  if (!prescription.prescriberName || prescription.prescriberName.trim().length === 0) {
    errors.push('Prescriber name is required');
  }

  // Required: Prescriber NPI
  if (!prescription.prescriberNPI) {
    errors.push('Prescriber NPI is required');
  } else if (!isValidNPI(prescription.prescriberNPI)) {
    errors.push('Prescriber NPI must be exactly 10 digits');
  }

  // Required: Prescribed date
  if (!prescription.prescribedDate) {
    errors.push('Prescribed date is required');
  } else if (!isValidDate(prescription.prescribedDate)) {
    errors.push('Prescribed date must be in YYYY-MM-DD format');
  }

  // Optional: Status validation if provided
  if (prescription.status && !isValidPrescriptionStatus(prescription.status)) {
    errors.push(`Invalid prescription status. Must be one of: ${Object.values(PrescriptionStatus).join(', ')}`);
  }

  // Optional: Pharmacy NPI validation if provided
  if (prescription.pharmacyNPI && !isValidNPI(prescription.pharmacyNPI)) {
    errors.push('Pharmacy NPI must be exactly 10 digits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}