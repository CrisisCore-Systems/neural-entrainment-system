-- Test Database Setup Script
-- Creates test database with seed data for E2E and integration tests
-- Run with: psql -U postgres -f database/setup-test.sql

-- Drop test database if exists (clean slate)
DROP DATABASE IF EXISTS neural_entrainment_test;

-- Create test database
CREATE DATABASE neural_entrainment_test;

-- Connect to test database
\c neural_entrainment_test

-- Success message
SELECT 'Test database created successfully! Now run schema manually.' AS status;
