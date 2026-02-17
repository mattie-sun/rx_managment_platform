/**
 * Database Schema Definitions
 * SQL statements to create all database tables
 */

/**
 * Users table
 * Stores patient/user information
 */
export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    addressStreet TEXT NOT NULL,
    addressCity TEXT NOT NULL,
    addressState TEXT NOT NULL,
    addressZipCode TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`;

/**
 * Insurance table
 * Stores insurance policy information
 */
export const CREATE_INSURANCE_TABLE = `
  CREATE TABLE IF NOT EXISTS insurance (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    insuranceCompany TEXT NOT NULL,
    policyNumber TEXT NOT NULL,
    groupNumber TEXT,
    planType TEXT NOT NULL,
    planName TEXT NOT NULL,
    rxBIN TEXT NOT NULL,
    rxPCN TEXT,
    rxGroup TEXT,
    deductible INTEGER NOT NULL DEFAULT 0,
    deductibleMet INTEGER NOT NULL DEFAULT 0,
    outOfPocketMax INTEGER NOT NULL DEFAULT 0,
    outOfPocketMet INTEGER NOT NULL DEFAULT 0,
    effectiveDate TEXT NOT NULL,
    terminationDate TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

/**
 * Prescriptions table
 * Stores prescription information
 */
export const CREATE_PRESCRIPTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    insuranceId TEXT,
    medicationName TEXT NOT NULL,
    medicationForm TEXT NOT NULL,
    strength TEXT NOT NULL,
    ndc TEXT,
    dosageInstructions TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    daysSupply INTEGER NOT NULL,
    refillsAllowed INTEGER NOT NULL,
    refillsRemaining INTEGER NOT NULL,
    prescriberName TEXT NOT NULL,
    prescriberNPI TEXT NOT NULL,
    prescribedDate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    statusMessage TEXT,
    pharmacyName TEXT,
    pharmacyNPI TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (insuranceId) REFERENCES insurance(id) ON DELETE SET NULL
  )
`;

/**
 * Claims table
 * Stores insurance claim submissions and adjudication results
 */
export const CREATE_CLAIMS_TABLE = `
  CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    prescriptionId TEXT NOT NULL,
    insuranceId TEXT NOT NULL,
    userId TEXT NOT NULL,
    claimNumber TEXT,
    pharmacyClaimId TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    denialReason TEXT,
    statusMessage TEXT NOT NULL,
    medicationCost INTEGER,
    dispensingFee INTEGER,
    totalCost INTEGER,
    insurancePays INTEGER,
    patientPays INTEGER,
    copay INTEGER,
    coinsurance INTEGER,
    deductibleApplied INTEGER,
    adjudicationSteps TEXT,
    submittedAt TEXT,
    adjudicatedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (prescriptionId) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (insuranceId) REFERENCES insurance(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

/**
 * Array of all table creation statements
 * Used for initializing the database
 */
export const ALL_TABLES = [
  CREATE_USERS_TABLE,
  CREATE_INSURANCE_TABLE,
  CREATE_PRESCRIPTIONS_TABLE,
  CREATE_CLAIMS_TABLE
];
