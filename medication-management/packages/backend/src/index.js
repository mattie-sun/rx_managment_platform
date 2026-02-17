/**
 * Express Server
 * Main application entry point
 */

import express from 'express';
import cors from 'cors';
import { PORT, CORS_OPTIONS, API_PREFIX } from './config/server.js';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler.js';
import { getDatabase } from './database/connection.js';

// Import routes
import usersRouter from './routes/users.js';
import insuranceRouter from './routes/insurance.js';
import prescriptionsRouter from './routes/prescriptions.js';
import claimsRouter from './routes/claims.js';

// Create Express app
const app = express();

// Initialize database connection
getDatabase();

// ========== MIDDLEWARE ==========

// CORS - allow frontend to communicate with backend
app.use(cors(CORS_OPTIONS));

// Parse JSON request bodies
app.use(express.json());

// Request logging
app.use(requestLogger);

// ========== ROUTES ==========

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'medication-management-api'
  });
});

// API routes
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/insurance`, insuranceRouter);
app.use(`${API_PREFIX}/prescriptions`, prescriptionsRouter);
app.use(`${API_PREFIX}/claims`, claimsRouter);

// ========== ERROR HANDLING ==========

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Medication Management API Server');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 API endpoints available at: http://localhost:${PORT}${API_PREFIX}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  - POST   ${API_PREFIX}/users              (Register user)`);
  console.log(`  - GET    ${API_PREFIX}/users/:id          (Get user)`);
  console.log(`  - POST   ${API_PREFIX}/insurance          (Register insurance)`);
  console.log(`  - GET    ${API_PREFIX}/insurance/:id      (Get insurance)`);
  console.log(`  - POST   ${API_PREFIX}/prescriptions      (Create prescription)`);
  console.log(`  - GET    ${API_PREFIX}/prescriptions/:id  (Get prescription)`);
  console.log(`  - POST   ${API_PREFIX}/claims/submit      (Submit claim) 🎯`);
  console.log(`  - GET    ${API_PREFIX}/claims/:id         (Get claim)`);
  console.log('');
  console.log('💡 Tip: Use /health to check server status');
  console.log('='.repeat(60));
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

export default app;
