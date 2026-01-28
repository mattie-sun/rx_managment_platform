/**
 * Insurance Plan Types
 * Common insurance plan categories in the US healthcare system
 * Defines all the status codes, plan types, and error codes used throughout the app
 * Think of these as your "vocabulary" for the system
 */
export const InsurancePlanType = {
  HMO: 'HMO',         // Health Maintenance Organization
  PPO: 'PPO',         // Preferred Provider Organization
  EPO: 'EPO',         // Exclusive Provider Organization
  POS: 'POS',         // Point of Service
  HDHP: 'HDHP',       // High Deductible Health Plan
};

/**
 * Prescription Status
 * Tracks the lifecycle of a prescription from creation to fulfillment
 */
export const PrescriptionStatus = {
  PENDING: 'PENDING',                       // Awaiting processing
  SUBMITTED: 'SUBMITTED',                   // Submitted to pharmacy/insurance
  APPROVED: 'APPROVED',                     // Insurance approved
  DENIED: 'DENIED',                         // Insurance denied
  PRIOR_AUTH_REQUIRED: 'PRIOR_AUTH_REQUIRED', // Needs prior authorization
  FILLED: 'FILLED',                         // Pharmacy filled the prescription
  PICKED_UP: 'PICKED_UP',                   // Patient picked up medication
  CANCELLED: 'CANCELLED',                   // Prescription cancelled
};

/**
 * Medication Form Types
 * Different physical forms medications can take
 */
export const MedicationForm = {
  TABLET: 'TABLET',
  CAPSULE: 'CAPSULE',
  LIQUID: 'LIQUID',
  INJECTION: 'INJECTION',
  CREAM: 'CREAM',
  INHALER: 'INHALER',
  PATCH: 'PATCH',
  OTHER: 'OTHER',
};

/**
 * Claim Status
 * Represents the final decision from the insurance company/PBM
 */
export const ClaimStatus = {
  APPROVED: 'APPROVED',                               // Claim approved, patient owes copay/coinsurance
  DENIED: 'DENIED',                                   // Claim denied, patient pays full price
  PRIOR_AUTH_REQUIRED: 'PRIOR_AUTH_REQUIRED',         // Requires prior authorization from doctor
  COVERAGE_LIMIT_EXCEEDED: 'COVERAGE_LIMIT_EXCEEDED', // Hit plan limit (quantity, refills, etc.)
  NOT_COVERED: 'NOT_COVERED',                         // Medication not on formulary
  DEDUCTIBLE_NOT_MET: 'DEDUCTIBLE_NOT_MET',           // Patient hasn't met deductible yet
  INVALID_INSURANCE: 'INVALID_INSURANCE',             // Insurance info is invalid or inactive
  PENDING: 'PENDING',                                 // Claim submitted, awaiting adjudication
};

/**
 * Denial Reasons
 * Specific reasons why a claim might be denied or rejected
 */
export const DenialReason = {
  // Insurance issues
  INSURANCE_INACTIVE: 'INSURANCE_INACTIVE',
  INSURANCE_EXPIRED: 'INSURANCE_EXPIRED',
  INVALID_POLICY: 'INVALID_POLICY',
  INVALID_RX_BIN: 'INVALID_RX_BIN',

  // Coverage issues
  NOT_ON_FORMULARY: 'NOT_ON_FORMULARY',
  PRIOR_AUTH_REQUIRED: 'PRIOR_AUTH_REQUIRED',
  QUANTITY_LIMIT_EXCEEDED: 'QUANTITY_LIMIT_EXCEEDED',
  REFILL_TOO_SOON: 'REFILL_TOO_SOON',
  AGE_RESTRICTION: 'AGE_RESTRICTION',

  // Financial issues
  DEDUCTIBLE_NOT_MET: 'DEDUCTIBLE_NOT_MET',
  OUT_OF_POCKET_MAX_REACHED: 'OUT_OF_POCKET_MAX_REACHED',
  BENEFIT_MAXIMUM_REACHED: 'BENEFIT_MAXIMUM_REACHED',

  // Prescription issues
  INVALID_NDC: 'INVALID_NDC',
  INVALID_PRESCRIBER: 'INVALID_PRESCRIBER',
  EXPIRED_PRESCRIPTION: 'EXPIRED_PRESCRIPTION',

  // Other
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  NONE: 'NONE', // No denial reason (claim approved)
};

/**
 * Error Codes
 * Standard error codes used throughout the application
 */
export const ErrorCode = {
  // Validation errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Business logic errors (4xx)
  INSURANCE_INACTIVE: 'INSURANCE_INACTIVE',
  INSURANCE_EXPIRED: 'INSURANCE_EXPIRED',
  PRESCRIPTION_INACTIVE: 'PRESCRIPTION_INACTIVE',
  CLAIM_DENIED: 'CLAIM_DENIED',
  PRIOR_AUTH_REQUIRED: 'PRIOR_AUTH_REQUIRED',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
};

