-- Setup script for Neural Entrainment Database
-- Run this with: psql -U postgres -f database/setup.sql

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE neural_entrainment'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'neural_entrainment')\gexec

-- Connect to the database
\c neural_entrainment

-- Now run the schema
\i database/schema.sql

-- Verify tables created
\dt

-- Show success message
SELECT 'Database setup complete!' AS status;
