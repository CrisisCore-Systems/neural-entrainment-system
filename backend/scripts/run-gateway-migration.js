/**
 * Run Gateway Process Migration
 * Adds Gateway Process tables and columns
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

try {
  await client.connect();
  console.log('📊 Connected to database...');
  
  console.log('🔧 Running Gateway Process migration...');
  const sql = readFileSync('migrations/005_gateway_process_clean.sql', 'utf8');
  await client.query(sql);
  
  console.log('✅ Gateway Process migration completed!');
  
  // Verify columns were added
  const result = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name IN ('gateway_access', 'gateway_level', 'gateway_training_completed', 'total_standard_sessions', 'is_admin')
    ORDER BY column_name
  `);
  
  console.log('\n📋 User table columns:');
  result.rows.forEach(row => console.log('  ✓', row.column_name));
  
  // Grant gateway access to admin user
  const email = process.argv[2] || 'kovertechart@gmail.com';
  const updateResult = await client.query(
    `UPDATE users 
     SET gateway_access = TRUE,
         gateway_level = 27,
         gateway_training_completed = TRUE,
         total_standard_sessions = 50
     WHERE email = $1
     RETURNING email, gateway_access, gateway_level`,
    [email]
  );
  
  if (updateResult.rows.length > 0) {
    console.log('\n✅ Granted Gateway access to:', email);
    console.log('   Gateway Level: 27 (Full Access)');
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
} finally {
  await client.end();
}
