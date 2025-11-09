/**
 * Migration: Add Monetization Plans Table
 * Stores user submissions for monetization plan generation
 */

-- Monetization plans table
CREATE TABLE IF NOT EXISTS monetization_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Business information
  business_idea TEXT NOT NULL,
  target_audience TEXT,
  available_resources TEXT,
  timeline_goals TEXT,
  industry_market VARCHAR(255),
  business_model_preference VARCHAR(255),
  additional_context TEXT,
  
  -- Generated plan (to be populated by AI/logic)
  generated_plan JSONB,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'draft', -- draft, processing, completed
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_monetization_plans_user_id ON monetization_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_plans_created_at ON monetization_plans(created_at);
