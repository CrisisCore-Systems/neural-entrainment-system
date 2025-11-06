/**
 * Create User Script
 * Generates a user account with hashed password
 * 
 * Usage: node create-user.js <email> <username> <password>
 * Example: node create-user.js kovertechart@gmail.com kovertechart mypassword123
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createUser(email, username, password) {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.log('\nSet it with your Neon connection string:');
    console.log('set DATABASE_URL=postgresql://...');
    process.exit(1);
  }

  console.log('🔐 Hashing password...');
  const passwordHash = await bcrypt.hash(password, 10);
  
  console.log('📊 Connecting to database...');
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    console.log('✏️  Creating user...');
    const result = await client.query(
      `INSERT INTO users (
        email, password_hash, username,
        medical_disclaimer_accepted, medical_disclaimer_date,
        has_epilepsy, has_heart_condition, has_mental_health_condition,
        is_active, is_verified
      ) VALUES ($1, $2, $3, true, NOW(), false, false, false, true, true)
      RETURNING id, email, username, created_at`,
      [email, passwordHash, username]
    );

    const user = result.rows[0];
    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Username:', user.username);
    console.log('Created:', user.created_at);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: [your password]`);
    
  } catch (error) {
    if (error.code === '23505') {
      console.error('\n❌ User already exists with this email or username');
    } else {
      console.error('\n❌ Error creating user:', error.message);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log('Usage: node create-user.js <email> <username> <password>');
  console.log('Example: node create-user.js kovertechart@gmail.com kovertechart mypassword123');
  process.exit(1);
}

const [email, username, password] = args;

// Validate inputs
if (!email.includes('@')) {
  console.error('❌ Invalid email address');
  process.exit(1);
}

if (username.length < 3) {
  console.error('❌ Username must be at least 3 characters');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ Password must be at least 8 characters');
  process.exit(1);
}

createUser(email, username, password);
