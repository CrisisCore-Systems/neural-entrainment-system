-- Gateway Process Database Schema (Clean Version - No Test Data)
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

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_gateway_sessions_updated_at ON gateway_sessions;
DROP TRIGGER IF EXISTS update_gateway_journal_entries_updated_at ON gateway_journal_entries;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_gateway_sessions_updated_at BEFORE UPDATE ON gateway_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gateway_journal_entries_updated_at BEFORE UPDATE ON gateway_journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for gateway analytics
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
