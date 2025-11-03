/**
 * Database Schema Initialization
 * Creates all tables for neural entrainment system
 */

-- Users table with medical screening
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Medical screening
  has_epilepsy BOOLEAN DEFAULT FALSE,
  has_heart_condition BOOLEAN DEFAULT FALSE,
  has_mental_health_condition BOOLEAN DEFAULT FALSE,
  medical_disclaimer_accepted BOOLEAN DEFAULT FALSE,
  medical_disclaimer_date TIMESTAMP WITH TIME ZONE,
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255)
);

-- Protocols table (entrainment programs)
CREATE TABLE IF NOT EXISTS protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- e.g., 'focus', 'relaxation', 'sleep'
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  safety_rating INTEGER CHECK (safety_rating BETWEEN 1 AND 5),
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Phase configurations (JSONB for flexibility)
  phases JSONB NOT NULL,
  total_duration INTEGER, -- seconds
  
  -- Usage stats
  usage_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES protocols(id),
  
  -- Session timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- seconds
  
  -- Session state
  status VARCHAR(50) DEFAULT 'active', -- active, paused, completed, stopped
  current_phase INTEGER DEFAULT 0,
  phases_completed INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  
  -- Real-time metrics (JSONB for flexibility)
  metrics JSONB,
  
  -- Average scores
  avg_coherence DECIMAL(5,4),
  avg_focus DECIMAL(5,4),
  avg_arousal DECIMAL(5,4),
  
  -- Device info
  device_type VARCHAR(100),
  browser VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily metrics aggregation
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Session counts
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- seconds
  
  -- Average metrics
  avg_coherence DECIMAL(5,4),
  avg_focus DECIMAL(5,4),
  avg_arousal DECIMAL(5,4),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Audio preferences
  default_volume DECIMAL(3,2) DEFAULT 0.5,
  audio_enabled BOOLEAN DEFAULT TRUE,
  
  -- Visual preferences
  visual_enabled BOOLEAN DEFAULT TRUE,
  visual_intensity DECIMAL(3,2) DEFAULT 0.8,
  
  -- Session preferences
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  daily_goal_minutes INTEGER DEFAULT 30,
  
  -- Notifications
  email_notifications BOOLEAN DEFAULT TRUE,
  session_reminders BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session ratings and feedback
CREATE TABLE IF NOT EXISTS session_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES protocols(id),
  
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_protocol_id ON sessions(protocol_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date ON daily_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_protocols_category ON protocols(category);
CREATE INDEX IF NOT EXISTS idx_protocols_is_public ON protocols(is_public);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON protocols
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_metrics_updated_at BEFORE UPDATE ON daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
