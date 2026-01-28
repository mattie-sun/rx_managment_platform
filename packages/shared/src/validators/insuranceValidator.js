import { InsurancePlanType } from '../constants.js';
import { isValidDate } from './userValidator.js';

/**
 * Insurance Validation Utilities
 * Validation functions for insurance-related data
 */

/**
 * Validates RxBIN format (6 digits)
 * RxBIN identifies the Pharmacy Benefit Manager (PBM)
 * @param {string} rxBIN - RxBIN to validate
 * @returns {boolean} True if valid RxBIN format
 */
export function isValidRxBIN(rxBIN) {
  const rxBINRegex = /^\d{6}$/;
  return rxBINRegex.test(rxBIN);
}

/**
 * Validates insurance plan type
 * @param {string} planType - Plan type to validate
 * @returns {boolean} True if valid plan type
 */
export function isValidPlanType(planType) {
  return Object.values(InsurancePlanType).includes(planType);
}

/**
 * Checks if insurance is currently active based on dates
 * @param {Object} insurance - Insurance object with effectiveDate and terminationDate
 * @returns {boolean} True if insurance is active
 */
export function isInsuranceActive(insurance) {
  const now = new Date();
  const effectiveDate = new Date(insurance.effectiveDate);

  // Not yet effective
  if (effectiveDate > now) {
    return false;
  }

  // Already terminated
  if (insurance.terminationDate) {
    const terminationDate = new Date(insurance.terminationDate);
    if (terminationDate < now) {
      return false;
    }
  }

  return insurance.isActive !== false;
}

/**
 * Validates a complete insurance object
 * @param {Object} insurance - Insurance object to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateInsurance(insurance) {
  const errors = [];

  // Required: User ID
  if (!insurance.userId) {
    errors.push('User ID is required');
  }

  // Required: Insurance company name
  if (!insurance.insuranceCompany || insurance.insuranceCompany.trim().length === 0) {
    errors.push('Insurance company name is required');
  }

  // Required: Policy number
  if (!insurance.policyNumber || insurance.policyNumber.trim().length === 0) {
    errors.push('Policy number is required');
  }

  // Required: Plan type
  if (!insurance.planType) {
    errors.push('Plan type is required');
  } else if (!isValidPlanType(insurance.planType)) {
    errors.push(`Invalid plan type. Must be one of: ${Object.values(InsurancePlanType).join(', ')}`);
  }

  // Required: Plan name
  if (!insurance.planName || insurance.planName.trim().length === 0) {
    errors.push('Plan name is required');
  }

  // Required: RxBIN
  if (!insurance.rxBIN) {
    errors.push('RxBIN is required');
  } else if (!isValidRxBIN(insurance.rxBIN)) {
    errors.push('RxBIN must be exactly 6 digits');
  }

  // Financial validations (amounts should be in cents, non-negative integers)
  if (insurance.deductible !== undefined) {
    if (typeof insurance.deductible !== 'number' || insurance.deductible < 0) {
      errors.push('Deductible must be a non-negative number (in cents)');
    }
  }

  if (insurance.deductibleMet !== undefined) {
    if (typeof insurance.deductibleMet !== 'number' || insurance.deductibleMet < 0) {
      errors.push('Deductible met must be a non-negative number (in cents)');
    }
  }

  if (insurance.outOfPocketMax !== undefined) {
    if (typeof insurance.outOfPocketMax !== 'number' || insurance.outOfPocketMax < 0) {
      errors.push('Out of pocket max must be a non-negative number (in cents)');
    }
  }

  if (insurance.outOfPocketMet !== undefined) {
    if (typeof insurance.outOfPocketMet !== 'number' || insurance.outOfPocketMet < 0) {
      errors.push('Out of pocket met must be a non-negative number (in cents)');
    }
  }

  // Date validations
  if (!insurance.effectiveDate) {
    errors.push('Effective date is required');
  } else if (!isValidDate(insurance.effectiveDate)) {
    errors.push('Effective date must be in YYYY-MM-DD format');
  }

  if (insurance.terminationDate && !isValidDate(insurance.terminationDate)) {
    errors.push('Termination date must be in YYYY-MM-DD format');
  }

  // Logical validations
  if (insurance.effectiveDate && insurance.terminationDate) {
    const effective = new Date(insurance.effectiveDate);
    const termination = new Date(insurance.terminationDate);
    if (termination <= effective) {
      errors.push('Termination date must be after effective date');
    }
  }

  if (insurance.deductibleMet > insurance.deductible) {
    errors.push('Deductible met cannot exceed total deductible');
  }

  if (insurance.outOfPocketMet > insurance.outOfPocketMax) {
    errors.push('Out of pocket met cannot exceed out of pocket max');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
