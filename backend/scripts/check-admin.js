/**
 * Check Admin Status
 */

import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

try {
  await client.connect();
  
  const email = process.argv[2] || 'kovertechart@gmail.com';
  
  const result = await client.query(
    'SELECT email, username, is_admin, created_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    console.log('❌ User not found:', email);
    console.log('\n💡 Register at your website first!');
  } else {
    const user = result.rows[0];
    console.log('\n✅ User found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🔑 Admin:', user.is_admin ? '✅ YES' : '❌ NO');
    console.log('📅 Created:', user.created_at);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  await client.end();
}
