/**
 * Insurance Routes
 * API endpoints for insurance policy management
 */

import express from 'express';
import {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  validateInsurance,
  ErrorCode
} from '@medication-management/shared';
import * as insuranceService from '../services/insuranceService.js';
import * as userService from '../services/userService.js';

const router = express.Router();

/**
 * POST /api/insurance
 * Register a new insurance policy
 */
router.post('/', (req, res, next) => {
  try {
    // Validate request body
    const validation = validateInsurance(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors));
    }
    
    // Verify user exists
    const user = userService.getUserById(req.body.userId);
    if (!user) {
      return res.status(404).json(createNotFoundResponse('User'));
    }
    
    // Create insurance
    const insurance = insuranceService.createInsurance(req.body);
    
    res.status(201).json(
      createSuccessResponse(insurance, 'Insurance policy registered successfully')
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/insurance/:id
 * Get insurance by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const insurance = insuranceService.getInsuranceById(req.params.id);
    
    if (!insurance) {
      return res.status(404).json(createNotFoundResponse('Insurance'));
    }
    
    res.json(createSuccessResponse(insurance));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/insurance/user/:userId
 * Get all insurance policies for a user
 */
router.get('/user/:userId', (req, res, next) => {
  try {
    const insurances = insuranceService.getInsuranceByUserId(req.params.userId);
    
    res.json(createSuccessResponse(insurances));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/insurance/user/:userId/active
 * Get active insurance for a user
 */
router.get('/user/:userId/active', (req, res, next) => {
  try {
    const insurance = insuranceService.getActiveInsuranceByUserId(req.params.userId);
    
    if (!insurance) {
      return res.status(404).json(
        createErrorResponse(
          ErrorCode.NOT_FOUND,
          'No active insurance found for this user'
        )
      );
    }
    
    res.json(createSuccessResponse(insurance));
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/insurance/:id
 * Update insurance
 */
router.put('/:id', (req, res, next) => {
  try {
    const insurance = insuranceService.updateInsurance(req.params.id, req.body);
    
    if (!insurance) {
      return res.status(404).json(createNotFoundResponse('Insurance'));
    }
    
    res.json(createSuccessResponse(insurance, 'Insurance updated successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/insurance/:id
 * Delete insurance
 */
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = insuranceService.deleteInsurance(req.params.id);
    
    if (!deleted) {
      return res.status(404).json(createNotFoundResponse('Insurance'));
    }
    
    res.json(createSuccessResponse(null, 'Insurance deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;
