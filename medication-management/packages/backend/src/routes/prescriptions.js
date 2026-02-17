/**
 * Prescription Routes
 * API endpoints for prescription management
 */

import express from 'express';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  validatePrescription
} from '@medication-management/shared';
import * as prescriptionService from '../services/prescriptionService.js';
import * as userService from '../services/userService.js';
import * as insuranceService from '../services/insuranceService.js';

const router = express.Router();

/**
 * POST /api/prescriptions
 * Create a new prescription
 */
router.post('/', (req, res, next) => {
  try {
    // Validate request body
    const validation = validatePrescription(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors));
    }
    
    // Verify user exists
    const user = userService.getUserById(req.body.userId);
    if (!user) {
      return res.status(404).json(createNotFoundResponse('User'));
    }
    
    // Verify insurance exists (if provided)
    if (req.body.insuranceId) {
      const insurance = insuranceService.getInsuranceById(req.body.insuranceId);
      if (!insurance) {
        return res.status(404).json(createNotFoundResponse('Insurance'));
      }
    }
    
    // Create prescription
    const prescription = prescriptionService.createPrescription(req.body);
    
    res.status(201).json(
      createSuccessResponse(prescription, 'Prescription created successfully')
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/prescriptions/:id
 * Get prescription by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const prescription = prescriptionService.getPrescriptionById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json(createNotFoundResponse('Prescription'));
    }
    
    res.json(createSuccessResponse(prescription));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/prescriptions/user/:userId
 * Get all prescriptions for a user
 */
router.get('/user/:userId', (req, res, next) => {
  try {
    const prescriptions = prescriptionService.getPrescriptionsByUserId(req.params.userId);
    
    res.json(createSuccessResponse(prescriptions));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/prescriptions/user/:userId/status/:status
 * Get prescriptions by status for a user
 */
router.get('/user/:userId/status/:status', (req, res, next) => {
  try {
    const prescriptions = prescriptionService.getPrescriptionsByStatus(
      req.params.userId,
      req.params.status
    );
    
    res.json(createSuccessResponse(prescriptions));
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/prescriptions/:id
 * Update prescription
 */
router.put('/:id', (req, res, next) => {
  try {
    const prescription = prescriptionService.updatePrescription(req.params.id, req.body);
    
    if (!prescription) {
      return res.status(404).json(createNotFoundResponse('Prescription'));
    }
    
    res.json(createSuccessResponse(prescription, 'Prescription updated successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/prescriptions/:id
 * Delete prescription
 */
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = prescriptionService.deletePrescription(req.params.id);
    
    if (!deleted) {
      return res.status(404).json(createNotFoundResponse('Prescription'));
    }
    
    res.json(createSuccessResponse(null, 'Prescription deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;
