/**
 * Database Initialization Script
 * Creates tables and seeds with dummy data
 */

import { getDatabase, closeDatabase } from './connection.js';
import { ALL_TABLES } from './schema.js';
import { seedDummyData } from './seed.js';

/**
 * Initializes the database
 * Creates all tables and optionally seeds data
 */
function initializeDatabase() {
  console.log('🚀 Initializing database...');
  
  const db = getDatabase();
  
  try {
    // Create all tables
    console.log('📋 Creating tables...');
    ALL_TABLES.forEach((tableSQL) => {
      db.exec(tableSQL);
    });
    console.log('✅ All tables created successfully');
    
    // Seed dummy data
    console.log('🌱 Seeding dummy data...');
    seedDummyData();
    console.log('✅ Dummy data seeded successfully');
    
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    closeDatabase();
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };
