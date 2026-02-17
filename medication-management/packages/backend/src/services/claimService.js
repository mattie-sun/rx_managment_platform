/**
 * Claim Adjudication Service
 * Simulates insurance claim processing with transparent step-by-step logic
 * This is the CORE feature that shows what happens behind the scenes
 */

import { 
  ClaimStatus, 
  DenialReason,
  dollarsToCents,
  isInsuranceActive as checkIfActive
} from '@medication-management/shared';
import { getInsuranceById } from './insuranceService.js';
import { getPrescriptionById } from './prescriptionService.js';

/**
 * Adjudicates a claim (processes it through insurance rules)
 * Returns detailed information about each step of the process
 * 
 * @param {Object} prescription - Prescription being claimed
 * @param {Object} insurance - Insurance policy
 * @returns {Object} Adjudication result with cost breakdown and steps
 */
export function adjudicateClaim(prescription, insurance) {
  const adjudicationSteps = [];
  let status = ClaimStatus.PENDING;
  let denialReason = DenialReason.NONE;
  let statusMessage = '';
  
  // Step 1: Verify insurance is active
  const insuranceCheck = verifyInsurance(insurance);
  adjudicationSteps.push(insuranceCheck);
  
  if (!insuranceCheck.passed) {
    status = ClaimStatus.INVALID_INSURANCE;
    denialReason = insuranceCheck.denialReason;
    statusMessage = insuranceCheck.message;
    
    return {
      status,
      denialReason,
      statusMessage,
      costBreakdown: null,
      adjudicationSteps
    };
  }
  
  // Step 2: Check if medication is on formulary (covered by insurance)
  const formularyCheck = checkFormulary(prescription, insurance);
  adjudicationSteps.push(formularyCheck);
  
  if (!formularyCheck.passed) {
    status = formularyCheck.requiresPriorAuth ? ClaimStatus.PRIOR_AUTH_REQUIRED : ClaimStatus.NOT_COVERED;
    denialReason = formularyCheck.denialReason;
    statusMessage = formularyCheck.message;
    
    return {
      status,
      denialReason,
      statusMessage,
      costBreakdown: calculateCashPayCost(prescription),
      adjudicationSteps
    };
  }
  
  // Step 3: Check quantity limits
  const quantityCheck = checkQuantityLimits(prescription, insurance);
  adjudicationSteps.push(quantityCheck);
  
  if (!quantityCheck.passed) {
    status = ClaimStatus.COVERAGE_LIMIT_EXCEEDED;
    denialReason = quantityCheck.denialReason;
    statusMessage = quantityCheck.message;
    
    return {
      status,
      denialReason,
      statusMessage,
      costBreakdown: calculateCashPayCost(prescription),
      adjudicationSteps
    };
  }
  
  // Step 4: Calculate costs
  const costCalculation = calculateCosts(prescription, insurance);
  adjudicationSteps.push(costCalculation.step);
  
  // All checks passed - claim approved!
  status = ClaimStatus.APPROVED;
  statusMessage = `Claim approved. Patient responsibility: $${(costCalculation.costBreakdown.patientPays / 100).toFixed(2)}`;
  
  return {
    status,
    denialReason,
    statusMessage,
    costBreakdown: costCalculation.costBreakdown,
    adjudicationSteps
  };
}

/**
 * Step 1: Verify insurance is active and valid
 */
function verifyInsurance(insurance) {
  // Check if insurance is marked as active
  if (!insurance.isActive) {
    return {
      step: 'Insurance Verification',
      passed: false,
      message: 'Insurance policy is inactive',
      denialReason: DenialReason.INSURANCE_INACTIVE,
      technicalDetails: `Policy ${insurance.policyNumber} is marked as inactive`
    };
  }
  
  // Check if insurance has expired
  if (!checkIfActive(insurance)) {
    return {
      step: 'Insurance Verification',
      passed: false,
      message: 'Insurance policy has expired or is not yet effective',
      denialReason: DenialReason.INSURANCE_EXPIRED,
      technicalDetails: `Effective: ${insurance.effectiveDate}, Termination: ${insurance.terminationDate || 'None'}`
    };
  }
  
  // Insurance is valid
  return {
    step: 'Insurance Verification',
    passed: true,
    message: `Insurance verified: ${insurance.insuranceCompany} ${insurance.planName}`,
    technicalDetails: `RxBIN: ${insurance.rxBIN}, Policy: ${insurance.policyNumber}`
  };
}

/**
 * Step 2: Check if medication is on the insurance formulary
 * In real systems, this would check against a formulary database
 * For demo purposes, we use simple rules based on medication name
 */
function checkFormulary(prescription, insurance) {
  // Simulate formulary restrictions
  // These are example drugs that might require prior authorization
  const priorAuthDrugs = ['Humira', 'Enbrel', 'Stelara', 'Ozempic', 'Wegovy'];
  const notCoveredDrugs = ['Experimental Drug X'];
  
  // Check if drug is not covered
  if (notCoveredDrugs.some(drug => prescription.medicationName.toLowerCase().includes(drug.toLowerCase()))) {
    return {
      step: 'Formulary Check',
      passed: false,
      requiresPriorAuth: false,
      message: 'Medication is not covered by your insurance plan',
      denialReason: DenialReason.NOT_ON_FORMULARY,
      technicalDetails: `${prescription.medicationName} is not on the ${insurance.planType} formulary`
    };
  }
  
  // Check if drug requires prior authorization
  if (priorAuthDrugs.some(drug => prescription.medicationName.toLowerCase().includes(drug.toLowerCase()))) {
    return {
      step: 'Formulary Check',
      passed: false,
      requiresPriorAuth: true,
      message: 'This medication requires prior authorization from your doctor',
      denialReason: DenialReason.PRIOR_AUTH_REQUIRED,
      technicalDetails: `${prescription.medicationName} is a specialty drug requiring prior authorization`
    };
  }
  
  // Drug is covered
  return {
    step: 'Formulary Check',
    passed: true,
    message: `${prescription.medicationName} is covered under your plan`,
    technicalDetails: `Found on ${insurance.planType} formulary as preferred generic`
  };
}

/**
 * Step 3: Check quantity limits
 * Insurance often limits how much medication you can get at once
 */
function checkQuantityLimits(prescription, insurance) {
  // Example: Most plans limit 30-day supplies unless it's a 90-day fill
  const maxStandardQuantity = 90; // days supply
  
  if (prescription.daysSupply > maxStandardQuantity) {
    return {
      step: 'Quantity Limit Check',
      passed: false,
      message: `Quantity exceeds plan limit. Maximum ${maxStandardQuantity} day supply allowed`,
      denialReason: DenialReason.QUANTITY_LIMIT_EXCEEDED,
      technicalDetails: `Requested: ${prescription.daysSupply} days, Plan max: ${maxStandardQuantity} days`
    };
  }
  
  // Quantity is within limits
  return {
    step: 'Quantity Limit Check',
    passed: true,
    message: `Quantity approved: ${prescription.quantity} tablets for ${prescription.daysSupply} days`,
    technicalDetails: `Within plan limits (max ${maxStandardQuantity} days)`
  };
}

/**
 * Step 4: Calculate costs
 * This is where we determine how much the insurance pays vs. patient pays
 */
function calculateCosts(prescription, insurance) {
  // Simulate medication costs (in cents)
  // In real systems, this comes from pharmacy pricing databases
  const medicationCost = simulateMedicationCost(prescription);
  const dispensingFee = dollarsToCents(2.50); // Pharmacy's fee
  const totalCost = medicationCost + dispensingFee;
  
  // Determine copay/coinsurance based on plan type
  let copay = 0;
  let coinsurance = 0;
  let deductibleApplied = 0;
  let insurancePays = 0;
  let patientPays = 0;
  
  // Check if deductible is met
  const deductibleRemaining = insurance.deductible - insurance.deductibleMet;
  
  if (deductibleRemaining > 0) {
    // Patient hasn't met deductible yet
    // Patient pays full cost (or amount remaining on deductible)
    deductibleApplied = Math.min(totalCost, deductibleRemaining);
    
    if (deductibleApplied >= totalCost) {
      // Entire cost goes toward deductible
      patientPays = totalCost;
      insurancePays = 0;
    } else {
      // Part goes to deductible, rest is covered with copay/coinsurance
      const remainingAfterDeductible = totalCost - deductibleApplied;
      
      // Apply copay or coinsurance to remaining amount
      if (insurance.planType === 'HMO' || insurance.planType === 'PPO') {
        // Fixed copay (typical for generic drugs)
        copay = Math.min(dollarsToCents(10), remainingAfterDeductible);
        patientPays = deductibleApplied + copay;
        insurancePays = totalCost - patientPays;
      } else {
        // Coinsurance (percentage, typical for HDHP)
        const coinsuranceRate = 0.20; // 20%
        coinsurance = Math.round(remainingAfterDeductible * coinsuranceRate);
        patientPays = deductibleApplied + coinsurance;
        insurancePays = totalCost - patientPays;
      }
    }
  } else {
    // Deductible is met - patient pays copay/coinsurance only
    if (insurance.planType === 'HMO' || insurance.planType === 'PPO') {
      copay = dollarsToCents(10); // $10 copay for generic
      patientPays = copay;
      insurancePays = totalCost - copay;
    } else if (insurance.planType === 'HDHP') {
      const coinsuranceRate = 0.20; // 20%
      coinsurance = Math.round(totalCost * coinsuranceRate);
      patientPays = coinsurance;
      insurancePays = totalCost - coinsurance;
    } else {
      // Other plan types - default to copay
      copay = dollarsToCents(15);
      patientPays = copay;
      insurancePays = totalCost - copay;
    }
  }
  
  const costBreakdown = {
    medicationCost,
    dispensingFee,
    totalCost,
    insurancePays,
    patientPays,
    copay: copay > 0 ? copay : undefined,
    coinsurance: coinsurance > 0 ? coinsurance : undefined,
    deductibleApplied: deductibleApplied > 0 ? deductibleApplied : undefined
  };
  
  // Build explanation message
  let explanation = `Total cost: $${(totalCost / 100).toFixed(2)}. `;
  
  if (deductibleApplied > 0) {
    explanation += `$${(deductibleApplied / 100).toFixed(2)} applied to deductible. `;
  }
  
  if (copay > 0) {
    explanation += `Copay: $${(copay / 100).toFixed(2)}. `;
  }
  
  if (coinsurance > 0) {
    explanation += `Coinsurance (20%): $${(coinsurance / 100).toFixed(2)}. `;
  }
  
  explanation += `Insurance pays: $${(insurancePays / 100).toFixed(2)}`;
  
  return {
    step: {
      step: 'Cost Calculation',
      passed: true,
      message: explanation,
      technicalDetails: `Medication: $${(medicationCost / 100).toFixed(2)}, Dispensing Fee: $${(dispensingFee / 100).toFixed(2)}`
    },
    costBreakdown
  };
}

/**
 * Simulates medication cost based on drug name and quantity
 * In real systems, this comes from pharmacy pricing databases
 */
function simulateMedicationCost(prescription) {
  // Base cost per unit (in cents)
  const baseCosts = {
    'lisinopril': 15,      // $0.15 per tablet (cheap generic)
    'metformin': 20,       // $0.20 per tablet
    'atorvastatin': 25,    // $0.25 per tablet
    'omeprazole': 30,      // $0.30 per capsule
    'humira': 600000,      // $6,000 per dose (expensive specialty)
    'default': 50          // $0.50 default
  };
  
  // Find matching drug cost
  const drugName = prescription.medicationName.toLowerCase();
  let costPerUnit = baseCosts.default;
  
  for (const [drug, cost] of Object.entries(baseCosts)) {
    if (drugName.includes(drug)) {
      costPerUnit = cost;
      break;
    }
  }
  
  return costPerUnit * prescription.quantity;
}

/**
 * Calculate cash pay cost (when insurance denies or patient pays without insurance)
 */
function calculateCashPayCost(prescription) {
  const medicationCost = simulateMedicationCost(prescription);
  const dispensingFee = dollarsToCents(2.50);
  const totalCost = medicationCost + dispensingFee;
  
  return {
    medicationCost,
    dispensingFee,
    totalCost,
    insurancePays: 0,
    patientPays: totalCost,
    copay: undefined,
    coinsurance: undefined,
    deductibleApplied: undefined
  };
}
