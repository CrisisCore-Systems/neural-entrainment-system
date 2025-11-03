-- Seed Default Protocol
-- Insert the standard 6-phase neural entrainment protocol

INSERT INTO protocols (
  id,
  name,
  description,
  category,
  difficulty,
  safety_rating,
  is_public,
  phases,
  total_duration
) VALUES (
  gen_random_uuid(),
  'Default Neural Entrainment',
  'Standard 6-phase neural entrainment protocol for balanced cognitive enhancement. Begins with calibration, progresses through resonance and depth phases, peaks at coherence, then gently returns to baseline.',
  'balanced',
  3,
  5,
  true,
  '[
    {
      "name": "Neural Calibration",
      "duration": 60,
      "description": "Establishing baseline neural patterns",
      "startFrequency": 14,
      "endFrequency": 12,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Resonance Field",
      "duration": 90,
      "description": "Synchronizing brainwave oscillations",
      "startFrequency": 12,
      "endFrequency": 10,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Depth Descent",
      "duration": 120,
      "description": "Progressive meditative deepening",
      "startFrequency": 10,
      "endFrequency": 8,
      "intensity": 0.8,
      "color": "#f093fb"
    },
    {
      "name": "Integration Matrix",
      "duration": 120,
      "description": "Neural pattern reorganization",
      "startFrequency": 8,
      "endFrequency": 7,
      "intensity": 0.85,
      "color": "#4facfe"
    },
    {
      "name": "Peak Coherence",
      "duration": 90,
      "description": "Maximum neural synchronization",
      "startFrequency": 7,
      "endFrequency": 7,
      "intensity": 0.9,
      "color": "#00f2fe"
    },
    {
      "name": "Return Integration",
      "duration": 120,
      "description": "Gentle return to baseline awareness",
      "startFrequency": 7,
      "endFrequency": 14,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  600
);

-- Add focus-oriented protocol
INSERT INTO protocols (
  id,
  name,
  description,
  category,
  difficulty,
  safety_rating,
  is_public,
  phases,
  total_duration
) VALUES (
  gen_random_uuid(),
  'Focus Enhancement',
  'Beta wave focused protocol for concentration and mental clarity. Maintains higher frequencies throughout for sustained alertness.',
  'focus',
  2,
  5,
  true,
  '[
    {
      "name": "Activation",
      "duration": 45,
      "description": "Mental activation and preparation",
      "startFrequency": 14,
      "endFrequency": 16,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Focus Lock",
      "duration": 180,
      "description": "Deep concentration state",
      "startFrequency": 16,
      "endFrequency": 18,
      "intensity": 0.75,
      "color": "#764ba2"
    },
    {
      "name": "Sustained Attention",
      "duration": 240,
      "description": "Peak focus maintenance",
      "startFrequency": 18,
      "endFrequency": 18,
      "intensity": 0.8,
      "color": "#4facfe"
    },
    {
      "name": "Cognitive Refresh",
      "duration": 120,
      "description": "Mental clarity restoration",
      "startFrequency": 18,
      "endFrequency": 16,
      "intensity": 0.7,
      "color": "#43e97b"
    },
    {
      "name": "Integration",
      "duration": 90,
      "description": "Return to alert baseline",
      "startFrequency": 16,
      "endFrequency": 14,
      "intensity": 0.6,
      "color": "#38f9d7"
    },
    {
      "name": "Completion",
      "duration": 45,
      "description": "Smooth transition to normal state",
      "startFrequency": 14,
      "endFrequency": 12,
      "intensity": 0.5,
      "color": "#667eea"
    }
  ]'::jsonb,
  720
);

-- Add relaxation protocol
INSERT INTO protocols (
  id,
  name,
  description,
  category,
  difficulty,
  safety_rating,
  is_public,
  phases,
  total_duration
) VALUES (
  gen_random_uuid(),
  'Deep Relaxation',
  'Theta-dominant protocol for stress relief and deep relaxation. Guides toward meditative states with gentle transitions.',
  'relaxation',
  1,
  5,
  true,
  '[
    {
      "name": "Settling",
      "duration": 60,
      "description": "Initial relaxation response",
      "startFrequency": 12,
      "endFrequency": 10,
      "intensity": 0.5,
      "color": "#667eea"
    },
    {
      "name": "Alpha Bridge",
      "duration": 90,
      "description": "Crossing into calm awareness",
      "startFrequency": 10,
      "endFrequency": 8,
      "intensity": 0.6,
      "color": "#764ba2"
    },
    {
      "name": "Theta Entrance",
      "duration": 120,
      "description": "Deep relaxation begins",
      "startFrequency": 8,
      "endFrequency": 6,
      "intensity": 0.7,
      "color": "#f093fb"
    },
    {
      "name": "Deep Theta",
      "duration": 180,
      "description": "Profound meditative state",
      "startFrequency": 6,
      "endFrequency": 5,
      "intensity": 0.8,
      "color": "#4facfe"
    },
    {
      "name": "Theta Integration",
      "duration": 120,
      "description": "Stabilizing calm state",
      "startFrequency": 5,
      "endFrequency": 6,
      "intensity": 0.7,
      "color": "#00f2fe"
    },
    {
      "name": "Gentle Return",
      "duration": 150,
      "description": "Gradual return to alertness",
      "startFrequency": 6,
      "endFrequency": 12,
      "intensity": 0.5,
      "color": "#43e97b"
    }
  ]'::jsonb,
  720
);

-- Verify protocols inserted
SELECT name, category, difficulty, safety_rating, total_duration 
FROM protocols 
ORDER BY name;
