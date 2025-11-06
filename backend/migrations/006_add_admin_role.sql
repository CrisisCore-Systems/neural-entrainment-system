-- Add admin role to users table
-- Migration: Add is_admin column

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Make kovertechart@gmail.com an admin
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'kovertechart@gmail.com';

-- Verify admin status
SELECT id, email, username, is_admin, created_at 
FROM users 
WHERE email = 'kovertechart@gmail.com';
