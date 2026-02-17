/**
 * Claims Routes
 * API endpoints for submitting and viewing insurance claims
 * This is the CORE feature showing transparent claim adjudication
 */

import express from 'express';
import {
  createSuccessResponse,
  createErrorResponse,
  createNotFoundResponse,
  ErrorCode,
  PrescriptionStatus
} from '@medication-management/shared';
import * as prescriptionService from '../services/prescriptionService.js';
import * as insuranceService from '../services/insuranceService.js';
import * as claimDbService from '../services/claimDbService.js';
import { adjudicateClaim } from '../services/claimService.js';

const router = express.Router();

/**
 * POST /api/claims/submit
 * Submit a prescription claim for adjudication
 * This is where the magic happens - transparent insurance processing!
 */
router.post('/submit', (req, res, next) => {
  try {
    const { prescriptionId, insuranceId, userId } = req.body;
    
    // Validate required fields
    if (!prescriptionId || !insuranceId || !userId) {
      return res.status(400).json(
        createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          'prescriptionId, insuranceId, and userId are required'
        )
      );
    }
    
    // Get prescription
    const prescription = prescriptionService.getPrescriptionById(prescriptionId);
    if (!prescription) {
      return res.status(404).json(createNotFoundResponse('Prescription'));
    }
    
    // Get insurance
    const insurance = insuranceService.getInsuranceById(insuranceId);
    if (!insurance) {
      return res.status(404).json(createNotFoundResponse('Insurance'));
    }
    
    // Verify prescription belongs to user
    if (prescription.userId !== userId) {
      return res.status(403).json(
        createErrorResponse(
          ErrorCode.FORBIDDEN,
          'Prescription does not belong to this user'
        )
      );
    }
    
    // Verify insurance belongs to user
    if (insurance.userId !== userId) {
      return res.status(403).json(
        createErrorResponse(
          ErrorCode.FORBIDDEN,
          'Insurance does not belong to this user'
        )
      );
    }
    
    // ========== ADJUDICATE THE CLAIM ==========
    // This is the core feature - transparent step-by-step processing
    const adjudicationResult = adjudicateClaim(prescription, insurance);
    
    // Save claim to database
    const claim = claimDbService.createClaim({
      prescriptionId,
      insuranceId,
      userId,
      status: adjudicationResult.status,
      denialReason: adjudicationResult.denialReason,
      statusMessage: adjudicationResult.statusMessage,
      costBreakdown: adjudicationResult.costBreakdown,
      adjudicationSteps: adjudicationResult.adjudicationSteps
    });
    
    // Update prescription status
    prescriptionService.updatePrescription(prescriptionId, {
      status: adjudicationResult.status === 'APPROVED' 
        ? PrescriptionStatus.APPROVED 
        : adjudicationResult.status === 'PRIOR_AUTH_REQUIRED'
        ? PrescriptionStatus.PRIOR_AUTH_REQUIRED
        : PrescriptionStatus.DENIED,
      statusMessage: adjudicationResult.statusMessage
    });
    
    // Prepare response with next steps
    const nextSteps = [];
    
    if (adjudicationResult.status === 'APPROVED') {
      nextSteps.push('Take this approval to your pharmacy to fill the prescription');
      nextSteps.push(`Bring payment for: $${(adjudicationResult.costBreakdown.patientPays / 100).toFixed(2)}`);
    } else if (adjudicationResult.status === 'PRIOR_AUTH_REQUIRED') {
      nextSteps.push('Contact your doctor to request prior authorization');
      nextSteps.push('Your doctor will submit additional medical information to the insurance company');
      nextSteps.push('This process typically takes 1-3 business days');
    } else if (adjudicationResult.status === 'INVALID_INSURANCE') {
      nextSteps.push('Verify your insurance information is correct');
      nextSteps.push('Contact your insurance company to confirm coverage');
    } else {
      nextSteps.push('Contact your insurance company for more information');
      nextSteps.push('You may pay cash price at the pharmacy if needed');
    }
    
    const response = {
      claim,
      success: adjudicationResult.status === 'APPROVED',
      message: adjudicationResult.statusMessage,
      nextSteps
    };
    
    res.status(201).json(createSuccessResponse(response));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/claims/:id
 * Get claim by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const claim = claimDbService.getClaimById(req.params.id);
    
    if (!claim) {
      return res.status(404).json(createNotFoundResponse('Claim'));
    }
    
    res.json(createSuccessResponse(claim));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/claims/user/:userId
 * Get all claims for a user
 */
router.get('/user/:userId', (req, res, next) => {
  try {
    const claims = claimDbService.getClaimsByUserId(req.params.userId);
    
    res.json(createSuccessResponse(claims));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/claims/prescription/:prescriptionId
 * Get claims for a specific prescription
 */
router.get('/prescription/:prescriptionId', (req, res, next) => {
  try {
    const claims = claimDbService.getClaimsByPrescriptionId(req.params.prescriptionId);
    
    res.json(createSuccessResponse(claims));
  } catch (error) {
    next(error);
  }
});

export default router;
