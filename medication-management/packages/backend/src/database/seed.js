/**
 * Database Seeding
 * Populates database with realistic dummy data for testing
 */

import { getDatabase } from './connection.js';
import { 
  generateUUID, 
  getCurrentDateTime, 
  dollarsToCents 
} from '@medication-management/shared';

/**
 * Seeds the database with dummy data
 * Creates sample users, insurance plans, prescriptions, and claims
 */
export function seedDummyData() {
  const db = getDatabase();
  const now = getCurrentDateTime();
  
  // Clear existing data
  db.exec('DELETE FROM claims');
  db.exec('DELETE FROM prescriptions');
  db.exec('DELETE FROM insurance');
  db.exec('DELETE FROM users');
  
  // ========== USERS ==========
  const users = [
    {
      id: generateUUID(),
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-03-15',
      phoneNumber: '5551234567',
      addressStreet: '123 Main St',
      addressCity: 'Seattle',
      addressState: 'WA',
      addressZipCode: '98101',
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-07-22',
      phoneNumber: '5559876543',
      addressStreet: '456 Oak Ave',
      addressCity: 'Portland',
      addressState: 'OR',
      addressZipCode: '97201',
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      email: 'bob.wilson@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      dateOfBirth: '1978-11-05',
      phoneNumber: '5555551234',
      addressStreet: '789 Pine Rd',
      addressCity: 'San Francisco',
      addressState: 'CA',
      addressZipCode: '94102',
      createdAt: now,
      updatedAt: now
    }
  ];
  
  // Insert users
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, email, firstName, lastName, dateOfBirth, phoneNumber,
      addressStreet, addressCity, addressState, addressZipCode,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  users.forEach(user => {
    insertUser.run(
      user.id, user.email, user.firstName, user.lastName, user.dateOfBirth,
      user.phoneNumber, user.addressStreet, user.addressCity, user.addressState,
      user.addressZipCode, user.createdAt, user.updatedAt
    );
  });
  
  console.log(`   ✓ Created ${users.length} users`);
  
  // ========== INSURANCE ==========
  const insurance = [
    {
      id: generateUUID(),
      userId: users[0].id,
      insuranceCompany: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS123456789',
      groupNumber: 'GRP001',
      planType: 'PPO',
      planName: 'Blue Shield Premium PPO',
      rxBIN: '610014',
      rxPCN: 'MEDDPPO',
      rxGroup: 'MEDPPO',
      deductible: dollarsToCents(1500),
      deductibleMet: dollarsToCents(500),
      outOfPocketMax: dollarsToCents(5000),
      outOfPocketMet: dollarsToCents(800),
      effectiveDate: '2024-01-01',
      terminationDate: null,
      isActive: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      userId: users[1].id,
      insuranceCompany: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002',
      planType: 'HMO',
      planName: 'Aetna Choice HMO',
      rxBIN: '610455',
      rxPCN: 'AETHMO',
      rxGroup: 'AETHMO01',
      deductible: dollarsToCents(2000),
      deductibleMet: dollarsToCents(2000),
      outOfPocketMax: dollarsToCents(6000),
      outOfPocketMet: dollarsToCents(3000),
      effectiveDate: '2024-01-01',
      terminationDate: null,
      isActive: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      userId: users[2].id,
      insuranceCompany: 'UnitedHealthcare',
      policyNumber: 'UHC555666777',
      groupNumber: 'GRP003',
      planType: 'HDHP',
      planName: 'UnitedHealthcare High Deductible',
      rxBIN: '610020',
      rxPCN: 'UHDHP',
      rxGroup: 'UHDHP01',
      deductible: dollarsToCents(3000),
      deductibleMet: dollarsToCents(0),
      outOfPocketMax: dollarsToCents(7000),
      outOfPocketMet: dollarsToCents(0),
      effectiveDate: '2023-06-01',
      terminationDate: '2024-01-15',
      isActive: 0,
      createdAt: now,
      updatedAt: now
    }
  ];
  
  // Insert insurance
  const insertInsurance = db.prepare(`
    INSERT INTO insurance (
      id, userId, insuranceCompany, policyNumber, groupNumber, planType, planName,
      rxBIN, rxPCN, rxGroup, deductible, deductibleMet, outOfPocketMax, outOfPocketMet,
      effectiveDate, terminationDate, isActive, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insurance.forEach(ins => {
    insertInsurance.run(
      ins.id, ins.userId, ins.insuranceCompany, ins.policyNumber, ins.groupNumber,
      ins.planType, ins.planName, ins.rxBIN, ins.rxPCN, ins.rxGroup, ins.deductible,
      ins.deductibleMet, ins.outOfPocketMax, ins.outOfPocketMet, ins.effectiveDate,
      ins.terminationDate, ins.isActive, ins.createdAt, ins.updatedAt
    );
  });
  
  console.log(`   ✓ Created ${insurance.length} insurance policies`);
  
  // ========== PRESCRIPTIONS ==========
  const prescriptions = [
    {
      id: generateUUID(),
      userId: users[0].id,
      insuranceId: insurance[0].id,
      medicationName: 'Lisinopril',
      medicationForm: 'TABLET',
      strength: '10mg',
      ndc: '12345-1234-01',
      dosageInstructions: 'Take 1 tablet by mouth once daily',
      quantity: 30,
      daysSupply: 30,
      refillsAllowed: 3,
      refillsRemaining: 3,
      prescriberName: 'Dr. Sarah Johnson',
      prescriberNPI: '1234567890',
      prescribedDate: '2024-01-15',
      status: 'PENDING',
      statusMessage: 'Prescription pending submission',
      pharmacyName: null,
      pharmacyNPI: null,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      userId: users[1].id,
      insuranceId: insurance[1].id,
      medicationName: 'Metformin',
      medicationForm: 'TABLET',
      strength: '500mg',
      ndc: '54321-4321-02',
      dosageInstructions: 'Take 1 tablet by mouth twice daily with meals',
      quantity: 60,
      daysSupply: 30,
      refillsAllowed: 5,
      refillsRemaining: 5,
      prescriberName: 'Dr. Michael Chen',
      prescriberNPI: '0987654321',
      prescribedDate: '2024-01-20',
      status: 'PENDING',
      statusMessage: 'Prescription pending submission',
      pharmacyName: null,
      pharmacyNPI: null,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      userId: users[0].id,
      insuranceId: insurance[0].id,
      medicationName: 'Atorvastatin',
      medicationForm: 'TABLET',
      strength: '20mg',
      ndc: '11111-2222-03',
      dosageInstructions: 'Take 1 tablet by mouth once daily at bedtime',
      quantity: 90,
      daysSupply: 90,
      refillsAllowed: 2,
      refillsRemaining: 2,
      prescriberName: 'Dr. Sarah Johnson',
      prescriberNPI: '1234567890',
      prescribedDate: '2024-01-10',
      status: 'PENDING',
      statusMessage: 'Prescription pending submission',
      pharmacyName: null,
      pharmacyNPI: null,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateUUID(),
      userId: users[2].id,
      insuranceId: insurance[2].id,
      medicationName: 'Omeprazole',
      medicationForm: 'CAPSULE',
      strength: '40mg',
      ndc: '22222-3333-04',
      dosageInstructions: 'Take 1 capsule by mouth once daily before breakfast',
      quantity: 30,
      daysSupply: 30,
      refillsAllowed: 1,
      refillsRemaining: 1,
      prescriberName: 'Dr. Emily Rodriguez',
      prescriberNPI: '5555555555',
      prescribedDate: '2024-01-18',
      status: 'PENDING',
      statusMessage: 'Prescription pending submission',
      pharmacyName: null,
      pharmacyNPI: null,
      createdAt: now,
      updatedAt: now
    }
  ];
  
  // Insert prescriptions
  const insertPrescription = db.prepare(`
    INSERT INTO prescriptions (
      id, userId, insuranceId, medicationName, medicationForm, strength, ndc,
      dosageInstructions, quantity, daysSupply, refillsAllowed, refillsRemaining,
      prescriberName, prescriberNPI, prescribedDate, status, statusMessage,
      pharmacyName, pharmacyNPI, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  prescriptions.forEach(rx => {
    insertPrescription.run(
      rx.id, rx.userId, rx.insuranceId, rx.medicationName, rx.medicationForm,
      rx.strength, rx.ndc, rx.dosageInstructions, rx.quantity, rx.daysSupply,
      rx.refillsAllowed, rx.refillsRemaining, rx.prescriberName, rx.prescriberNPI,
      rx.prescribedDate, rx.status, rx.statusMessage, rx.pharmacyName, rx.pharmacyNPI,
      rx.createdAt, rx.updatedAt
    );
  });
  
  console.log(`   ✓ Created ${prescriptions.length} prescriptions`);
  
  // Store for later use
  global.SEED_DATA = {
    users,
    insurance,
    prescriptions
  };
}
