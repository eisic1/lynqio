const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration(migrationFile) {
  try {
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', migrationFile);
    
    console.log(`📁 Reading migration file: ${migrationFile}`);
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('🔄 Running migration...');
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please provide migration file name');
  console.log('Usage: node scripts/runMigration.js <migration-file.sql>');
  process.exit(1);
}

runMigration(migrationFile);
