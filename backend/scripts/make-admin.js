/**
 * Make User Admin Script
 * Adds admin role and sets specific user as admin
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';

async function makeUserAdmin(email) {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('📊 Connected to database...');
    
    // Read and run migration
    console.log('🔧 Adding admin column...');
    const sql = readFileSync('migrations/006_add_admin_role.sql', 'utf8');
    await client.query(sql);
    
    console.log('✅ Admin role added!');
    
    // Check user
    const result = await client.query(
      'SELECT id, email, username, is_admin FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('\n⚠️  User not found!');
      console.log('📝 Register at your website first, then run this script again.');
    } else {
      const user = result.rows[0];
      console.log('\n✅ User updated:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('👤 Email:', user.email);
      console.log('📛 Username:', user.username);
      console.log('🔑 Admin:', user.is_admin);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'kovertechart@gmail.com';

makeUserAdmin(email);
