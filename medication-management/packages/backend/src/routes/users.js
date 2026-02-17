/**
 * User Routes
 * API endpoints for user registration and management
 */

import express from 'express';
import {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  validateUser,
  ErrorCode
} from '@medication-management/shared';
import * as userService from '../services/userService.js';

const router = express.Router();

/**
 * POST /api/users
 * Register a new user
 */
router.post('/', (req, res, next) => {
  try {
    // Validate request body
    const validation = validateUser(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors));
    }
    
    // Check if user already exists
    const existingUser = userService.getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json(
        createErrorResponse(
          ErrorCode.ALREADY_EXISTS,
          'A user with this email already exists'
        )
      );
    }
    
    // Create user
    const user = userService.createUser(req.body);
    
    res.status(201).json(
      createSuccessResponse(user, 'User registered successfully')
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const user = userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json(createNotFoundResponse('User'));
    }
    
    res.json(createSuccessResponse(user));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users
 * Get all users (with pagination)
 */
router.get('/', (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = userService.getAllUsers(page, limit);
    
    res.json(createSuccessResponse(result));
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res, next) => {
  try {
    // Validate request body
    const validation = validateUser({ ...req.body, id: req.params.id });
    
    if (!validation.isValid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors));
    }
    
    const user = userService.updateUser(req.params.id, req.body);
    
    if (!user) {
      return res.status(404).json(createNotFoundResponse('User'));
    }
    
    res.json(createSuccessResponse(user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = userService.deleteUser(req.params.id);
    
    if (!deleted) {
      return res.status(404).json(createNotFoundResponse('User'));
    }
    
    res.json(createSuccessResponse(null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;
