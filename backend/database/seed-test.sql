-- Test Data Seed Script
-- Populates test database with realistic test data
-- Run AFTER setup-test.sql: psql -U postgres -d neural_entrainment_test -f database/seed-test.sql

-- Clear existing data (for re-runs)
TRUNCATE TABLE daily_metrics, sessions, protocols, users CASCADE;

-- Insert test users
-- Password for all users: TestPass123! (bcrypt hashed)
-- Hash: $2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly
INSERT INTO users (email, username, password_hash, is_active, medical_disclaimer_accepted, has_epilepsy, has_heart_condition, created_at) VALUES
  ('test@example.com', 'testuser', '$2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly', true, true, false, false, NOW() - INTERVAL '30 days'),
  ('testuser@example.com', 'testuser2', '$2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly', true, true, false, false, NOW() - INTERVAL '30 days'),
  ('gatewayuser@example.com', 'gatewayuser', '$2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly', true, true, false, false, NOW() - INTERVAL '60 days'),
  ('admin@example.com', 'admin', '$2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly', true, true, false, false, NOW() - INTERVAL '90 days'),
  ('inactive@example.com', 'inactive', '$2b$10$m38p70zPLTejKT6glY2Eq.CICHwjyTX1IFeDgKeZxzwmsGDkQJqly', false, false, false, false, NOW() - INTERVAL '10 days');

-- Insert test protocols with JSONB phases
INSERT INTO protocols (name, description, category, difficulty, safety_rating, is_public, phases, total_duration) VALUES
  ('Deep Focus', 'Enhanced concentration for study and work', 'focus', 2, 4, true, '[
    {"name": "Calibration", "description": "Baseline establishment", "duration": 180, "startFrequency": 10.0, "endFrequency": 10.0, "intensity": 0.5, "color": "#667eea"},
    {"name": "Ramp Up", "description": "Increase to beta waves", "duration": 300, "startFrequency": 10.0, "endFrequency": 15.0, "intensity": 0.6, "color": "#764ba2"},
    {"name": "Peak Focus", "description": "Maintain high focus state", "duration": 420, "startFrequency": 15.0, "endFrequency": 15.0, "intensity": 0.7, "color": "#f093fb"},
    {"name": "Cool Down", "description": "Gentle return to baseline", "duration": 300, "startFrequency": 15.0, "endFrequency": 10.0, "intensity": 0.5, "color": "#4facfe"}
  ]'::jsonb, 1200),
  
  ('Calm Mind', 'Stress relief and relaxation', 'relaxation', 1, 5, true, '[
    {"name": "Calibration", "description": "Initial grounding", "duration": 180, "startFrequency": 10.0, "endFrequency": 10.0, "intensity": 0.4, "color": "#667eea"},
    {"name": "Alpha Entry", "description": "Relaxation deepening", "duration": 360, "startFrequency": 10.0, "endFrequency": 8.0, "intensity": 0.5, "color": "#00f2fe"},
    {"name": "Deep Calm", "description": "Theta waves for deep relaxation", "duration": 360, "startFrequency": 8.0, "endFrequency": 6.0, "intensity": 0.6, "color": "#4facfe"}
  ]'::jsonb, 900),
  
  ('Morning Boost', 'Energizing protocol for alertness', 'focus', 3, 3, true, '[
    {"name": "Awakening", "description": "Gentle start", "duration": 180, "startFrequency": 8.0, "endFrequency": 12.0, "intensity": 0.5, "color": "#fa709a"},
    {"name": "Energize", "description": "Beta activation", "duration": 240, "startFrequency": 12.0, "endFrequency": 18.0, "intensity": 0.7, "color": "#fee140"},
    {"name": "Peak Alertness", "description": "High beta", "duration": 180, "startFrequency": 18.0, "endFrequency": 20.0, "intensity": 0.8, "color": "#30cfd0"}
  ]'::jsonb, 600);

-- Get protocol and user IDs for sessions
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  protocol1_id UUID;
  protocol2_id UUID;
  protocol3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE email = 'test@example.com';
  SELECT id INTO user2_id FROM users WHERE email = 'gatewayuser@example.com';
  
  -- Get protocol IDs
  SELECT id INTO protocol1_id FROM protocols WHERE name = 'Deep Focus';
  SELECT id INTO protocol2_id FROM protocols WHERE name = 'Calm Mind';
  SELECT id INTO protocol3_id FROM protocols WHERE name = 'Morning Boost';
  
  -- Insert test sessions
  INSERT INTO sessions (user_id, protocol_id, status, current_phase, started_at, ended_at, duration, completed, metrics) VALUES
    (user1_id, protocol1_id, 'completed', 4, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 40 minutes', 1200, true, '{"coherence": 78.5, "focus": 84.2, "arousal": 68.5}'::jsonb),
    (user1_id, protocol2_id, 'completed', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 45 minutes', 900, true, '{"coherence": 87.2, "focus": 74.0, "arousal": 39.5}'::jsonb),
    (user2_id, protocol3_id, 'active', 2, NOW() - INTERVAL '10 minutes', NULL, NULL, false, '{"coherence": 70.0, "focus": 78.0, "arousal": 60.0}'::jsonb),
    (user2_id, protocol1_id, 'paused', 1, NOW() - INTERVAL '30 minutes', NULL, NULL, false, '{"coherence": 65.0, "focus": 72.0, "arousal": 55.0}'::jsonb);
END $$;

-- Insert daily metrics
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
BEGIN
  SELECT id INTO user1_id FROM users WHERE email = 'test@example.com';
  SELECT id INTO user2_id FROM users WHERE email = 'gatewayuser@example.com';
  
  INSERT INTO daily_metrics (user_id, date, total_sessions, completed_sessions, total_duration, avg_coherence, avg_focus, avg_arousal) VALUES
    (user1_id, CURRENT_DATE - INTERVAL '2 days', 1, 1, 1200, 0.7850, 0.8420, 0.6850),
    (user1_id, CURRENT_DATE - INTERVAL '1 day', 1, 1, 900, 0.8720, 0.7400, 0.3950),
    (user1_id, CURRENT_DATE, 0, 0, 0, NULL, NULL, NULL),
    (user2_id, CURRENT_DATE, 2, 0, 600, 0.6750, 0.7500, 0.5750);
END $$;

-- Update protocol usage counts
UPDATE protocols SET usage_count = 2 WHERE name = 'Deep Focus';
UPDATE protocols SET usage_count = 1 WHERE name = 'Calm Mind';
UPDATE protocols SET usage_count = 1 WHERE name = 'Morning Boost';

-- Verification queries
SELECT 'Test data seeded successfully!' AS status;
SELECT 'Users: ' || COUNT(*) AS count FROM users;
SELECT 'Protocols: ' || COUNT(*) AS count FROM protocols;
SELECT 'Sessions: ' || COUNT(*) AS count FROM sessions;
SELECT 'Daily Metrics: ' || COUNT(*) AS count FROM daily_metrics;
