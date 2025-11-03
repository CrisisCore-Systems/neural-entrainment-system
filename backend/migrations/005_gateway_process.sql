-- Gateway Process Database Schema
-- Migration: Add Gateway functionality

-- Add gateway access columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gateway_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gateway_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS gateway_training_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gateway_consent_signed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS total_standard_sessions INTEGER DEFAULT 0;

-- Create gateway_sessions table
CREATE TABLE IF NOT EXISTS gateway_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  protocol_id VARCHAR(50) NOT NULL, -- 'focus10', 'focus12', etc.
  focus_level INTEGER NOT NULL, -- 10, 12, 15, 21, 27
  duration_seconds INTEGER NOT NULL,
  state_depth INTEGER CHECK (state_depth >= 1 AND state_depth <= 10), -- Subjective depth rating
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'terminated'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create gateway_phenomena table (experiences reported)
CREATE TABLE IF NOT EXISTS gateway_phenomena (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_session_id UUID REFERENCES gateway_sessions(id) ON DELETE CASCADE NOT NULL,
  phenomenon_category VARCHAR(100) NOT NULL, -- 'Vibrations', 'OBE', 'Entity Contact', etc.
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10), -- How strong was the experience
  timestamp_offset INTEGER, -- Seconds into session when it occurred
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gateway_affirmations table (which affirmations used)
CREATE TABLE IF NOT EXISTS gateway_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_session_id UUID REFERENCES gateway_sessions(id) ON DELETE CASCADE NOT NULL,
  affirmation_text TEXT NOT NULL,
  used_during_phase VARCHAR(100), -- 'Entry', 'Deepening', etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gateway_journal_entries table
CREATE TABLE IF NOT EXISTS gateway_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_session_id UUID REFERENCES gateway_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  entry_text TEXT NOT NULL,
  insights TEXT,
  integration_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create gateway_progression table (track unlocks)
CREATE TABLE IF NOT EXISTS gateway_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  focus_level INTEGER NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  required_sessions_completed INTEGER,
  UNIQUE(user_id, focus_level)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gateway_sessions_user_id ON gateway_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_gateway_sessions_focus_level ON gateway_sessions(focus_level);
CREATE INDEX IF NOT EXISTS idx_gateway_phenomena_session_id ON gateway_phenomena(gateway_session_id);
CREATE INDEX IF NOT EXISTS idx_gateway_phenomena_category ON gateway_phenomena(phenomenon_category);
CREATE INDEX IF NOT EXISTS idx_gateway_journal_entries_user_id ON gateway_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_gateway_progression_user_id ON gateway_progression(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gateway_sessions_updated_at BEFORE UPDATE ON gateway_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gateway_journal_entries_updated_at BEFORE UPDATE ON gateway_journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional - remove in production)
-- Grant gateway access to test user
UPDATE users 
SET gateway_access = TRUE,
    gateway_level = 12,
    gateway_training_completed = TRUE,
    gateway_consent_signed_at = NOW(),
    total_standard_sessions = 33
WHERE email = 'test3@example.com';

-- Insert progression unlocks for test user
INSERT INTO gateway_progression (user_id, focus_level, unlocked_at, required_sessions_completed)
SELECT id, 10, NOW() - INTERVAL '10 days', 20
FROM users WHERE email = 'test3@example.com'
ON CONFLICT (user_id, focus_level) DO NOTHING;

INSERT INTO gateway_progression (user_id, focus_level, unlocked_at, required_sessions_completed)
SELECT id, 12, NOW() - INTERVAL '5 days', 25
FROM users WHERE email = 'test3@example.com'
ON CONFLICT (user_id, focus_level) DO NOTHING;

-- Insert sample gateway sessions
INSERT INTO gateway_sessions (user_id, protocol_id, focus_level, duration_seconds, state_depth, completed_at, status)
SELECT 
  id,
  'focus10',
  10,
  1800,
  7,
  NOW() - INTERVAL '2 days',
  'completed'
FROM users WHERE email = 'test3@example.com';

-- Insert phenomena for that session
INSERT INTO gateway_phenomena (gateway_session_id, phenomenon_category, intensity, timestamp_offset, description)
VALUES 
  (1, 'Vibrations', 8, 900, 'Strong vibrations starting at solar plexus, radiating outward'),
  (1, 'Energy Sensations', 6, 1200, 'Tingling in hands and feet, warmth spreading through body');

-- Insert journal entry
INSERT INTO gateway_journal_entries (gateway_session_id, user_id, entry_text, insights, integration_notes)
SELECT 
  1,
  id,
  'First successful Focus 10 session. The vibrations were intense but I stayed calm. Around the 15-minute mark, I felt a clear separation between my awareness and my physical body. My body was completely relaxed but my mind was alert and observing.',
  'Realized that I have more control over my state than I thought. The vibrations are a sign of progress, not something to fear.',
  'Need to practice REBAL more consistently. Will do daily relaxation exercises to improve body awareness.'
FROM users WHERE email = 'test3@example.com'
ON CONFLICT DO NOTHING;

-- Add more sample sessions
INSERT INTO gateway_sessions (user_id, protocol_id, focus_level, duration_seconds, state_depth, completed_at, status)
SELECT 
  id,
  'focus12',
  12,
  2100,
  6,
  NOW() - INTERVAL '5 days',
  'completed'
FROM users WHERE email = 'test3@example.com';

INSERT INTO gateway_phenomena (gateway_session_id, phenomenon_category, intensity, timestamp_offset, description)
VALUES 
  (2, 'Time Distortion', 7, 1500, 'Time seemed to compress - 20 minutes felt like 5'),
  (2, 'Expanded Awareness', 8, 1800, 'Sudden expansion of awareness, felt connected to everything');

INSERT INTO gateway_journal_entries (gateway_session_id, user_id, entry_text, insights)
SELECT 
  2,
  id,
  'Focus 12 session brought unexpected insights. During the expansion phase, received clear intuitive information about a work project that has been stuck. The solution appeared fully formed, not as words but as complete understanding.',
  'Information comes in non-verbal formats - feelings, knowings, symbolic imagery. Need to trust these perceptions.'
FROM users WHERE email = 'test3@example.com';

-- Add one more session
INSERT INTO gateway_sessions (user_id, protocol_id, focus_level, duration_seconds, state_depth, completed_at, status)
SELECT 
  id,
  'focus12',
  12,
  2100,
  8,
  NOW() - INTERVAL '7 days',
  'completed'
FROM users WHERE email = 'test3@example.com';

INSERT INTO gateway_phenomena (gateway_session_id, phenomenon_category, intensity, timestamp_offset, description)
VALUES 
  (3, 'Expanded Awareness', 9, 1200, 'Deepest state yet - awareness expanded far beyond normal perception'),
  (3, 'Archetypal Imagery', 7, 1500, 'Geometric patterns appeared with symbolic meanings - felt deeply significant');

INSERT INTO gateway_journal_entries (gateway_session_id, user_id, entry_text)
SELECT 
  3,
  id,
  'Deepest Focus 12 yet. The sacred geometry visualizations seemed to resonate with something inside me. Saw intricate geometric patterns that felt meaningful beyond understanding. This level of depth is new - stayed present but felt very far from ordinary awareness.'
FROM users WHERE email = 'test3@example.com';

-- View for gateway analytics
CREATE OR REPLACE VIEW gateway_user_stats AS
SELECT 
  u.id AS user_id,
  u.email,
  u.gateway_level,
  u.total_standard_sessions,
  COUNT(DISTINCT gs.id) AS total_gateway_sessions,
  COUNT(DISTINCT CASE WHEN gs.focus_level = 10 THEN gs.id END) AS focus10_sessions,
  COUNT(DISTINCT CASE WHEN gs.focus_level = 12 THEN gs.id END) AS focus12_sessions,
  COUNT(DISTINCT CASE WHEN gs.focus_level = 15 THEN gs.id END) AS focus15_sessions,
  COUNT(DISTINCT CASE WHEN gs.focus_level = 21 THEN gs.id END) AS focus21_sessions,
  COUNT(DISTINCT CASE WHEN gs.focus_level = 27 THEN gs.id END) AS focus27_sessions,
  AVG(gs.state_depth) AS avg_state_depth,
  COUNT(DISTINCT gp.phenomenon_category) AS unique_phenomena_count,
  MAX(gs.completed_at) AS last_gateway_session
FROM users u
LEFT JOIN gateway_sessions gs ON u.id = gs.user_id AND gs.status = 'completed'
LEFT JOIN gateway_phenomena gp ON gs.id = gp.gateway_session_id
WHERE u.gateway_access = TRUE
GROUP BY u.id, u.email, u.gateway_level, u.total_standard_sessions;

-- Comments for documentation
COMMENT ON TABLE gateway_sessions IS 'Records of Gateway Process sessions (Focus 10-27)';
COMMENT ON TABLE gateway_phenomena IS 'Phenomena reported during Gateway sessions (OBE, vibrations, entity contact, etc.)';
COMMENT ON TABLE gateway_affirmations IS 'Affirmations used during Gateway sessions';
COMMENT ON TABLE gateway_journal_entries IS 'User journal entries documenting Gateway experiences';
COMMENT ON TABLE gateway_progression IS 'Tracks which Focus levels users have unlocked';
COMMENT ON COLUMN users.gateway_level IS 'Highest Focus level user has unlocked (0, 10, 12, 15, 21, 27)';
COMMENT ON COLUMN users.gateway_access IS 'Whether user has been granted admin access to Gateway Process';
COMMENT ON COLUMN gateway_sessions.state_depth IS 'Subjective depth rating 1-10 reported by user post-session';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Gateway Process schema created successfully!';
  RAISE NOTICE 'Test user test3@example.com granted access with 3 sample sessions';
END $$;
