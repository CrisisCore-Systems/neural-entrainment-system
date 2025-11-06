-- Create a user account manually
-- Replace 'YOUR_PASSWORD_HERE' with your actual password
-- This script will hash the password using bcrypt

-- Note: You need to run this with a bcrypt hash generator first
-- Use this Node.js command to generate a hash:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD_HERE', 10).then(hash => console.log(hash));"

-- Then replace PASSWORD_HASH_HERE with the generated hash

INSERT INTO users (
  email,
  password_hash,
  username,
  medical_disclaimer_accepted,
  medical_disclaimer_date,
  has_epilepsy,
  has_heart_condition,
  has_mental_health_condition,
  is_active,
  is_verified
) VALUES (
  'kovertechart@gmail.com',
  'PASSWORD_HASH_HERE', -- Replace with bcrypt hash
  'kovertechart',
  true,
  NOW(),
  false,
  false,
  false,
  true,
  true
);

-- Verify user created
SELECT id, email, username, created_at FROM users WHERE email = 'kovertechart@gmail.com';
