-- Additional Neural Entrainment Protocols
-- Adds protocols for sleep, creativity, meditation, energy, and study

-- Sleep Preparation Protocol
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
  'Sleep Preparation',
  'Delta wave protocol designed to facilitate natural sleep onset. Gradually lowers frequency to delta range for deep rest.',
  'sleep',
  1,
  5,
  true,
  '[
    {
      "name": "Evening Wind Down",
      "duration": 90,
      "description": "Releasing daily tensions",
      "startFrequency": 12,
      "endFrequency": 8,
      "intensity": 0.5,
      "color": "#667eea"
    },
    {
      "name": "Theta Transition",
      "duration": 120,
      "description": "Entering drowsy state",
      "startFrequency": 8,
      "endFrequency": 5,
      "intensity": 0.6,
      "color": "#764ba2"
    },
    {
      "name": "Delta Gateway",
      "duration": 180,
      "description": "Approaching sleep threshold",
      "startFrequency": 5,
      "endFrequency": 3,
      "intensity": 0.7,
      "color": "#f093fb"
    },
    {
      "name": "Deep Delta",
      "duration": 240,
      "description": "Sleep state frequencies",
      "startFrequency": 3,
      "endFrequency": 2,
      "intensity": 0.75,
      "color": "#4facfe"
    },
    {
      "name": "Sleep Stabilization",
      "duration": 180,
      "description": "Maintaining deep rest",
      "startFrequency": 2,
      "endFrequency": 1.5,
      "intensity": 0.7,
      "color": "#00f2fe"
    },
    {
      "name": "Rest Integration",
      "duration": 90,
      "description": "Settling into sleep",
      "startFrequency": 1.5,
      "endFrequency": 1,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  900
);

-- Creative Flow Protocol
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
  'Creative Flow State',
  'Alpha-theta crossover protocol optimized for creative thinking and artistic expression. Balances relaxed awareness with mental clarity.',
  'creativity',
  2,
  5,
  true,
  '[
    {
      "name": "Creative Warm-up",
      "duration": 60,
      "description": "Relaxed mental preparation",
      "startFrequency": 12,
      "endFrequency": 10,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Alpha Doorway",
      "duration": 90,
      "description": "Entering calm creativity",
      "startFrequency": 10,
      "endFrequency": 9,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Flow Activation",
      "duration": 240,
      "description": "Peak creative state",
      "startFrequency": 9,
      "endFrequency": 8,
      "intensity": 0.8,
      "color": "#f093fb"
    },
    {
      "name": "Creative Depth",
      "duration": 180,
      "description": "Deep artistic immersion",
      "startFrequency": 8,
      "endFrequency": 7,
      "intensity": 0.85,
      "color": "#4facfe"
    },
    {
      "name": "Integration Phase",
      "duration": 120,
      "description": "Solidifying insights",
      "startFrequency": 7,
      "endFrequency": 9,
      "intensity": 0.7,
      "color": "#00f2fe"
    },
    {
      "name": "Creative Return",
      "duration": 90,
      "description": "Gentle reorientation",
      "startFrequency": 9,
      "endFrequency": 12,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  780
);

-- Deep Meditation Protocol
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
  'Deep Meditation',
  'Advanced theta protocol for experienced meditators. Facilitates profound meditative states and inner exploration.',
  'meditation',
  4,
  5,
  true,
  '[
    {
      "name": "Centering",
      "duration": 120,
      "description": "Establishing meditation baseline",
      "startFrequency": 10,
      "endFrequency": 8,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Deepening",
      "duration": 180,
      "description": "Descending into stillness",
      "startFrequency": 8,
      "endFrequency": 6,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Theta Immersion",
      "duration": 300,
      "description": "Deep meditative absorption",
      "startFrequency": 6,
      "endFrequency": 5,
      "intensity": 0.8,
      "color": "#f093fb"
    },
    {
      "name": "Inner Silence",
      "duration": 360,
      "description": "Profound stillness",
      "startFrequency": 5,
      "endFrequency": 4.5,
      "intensity": 0.85,
      "color": "#4facfe"
    },
    {
      "name": "Awareness Expansion",
      "duration": 240,
      "description": "Spacious presence",
      "startFrequency": 4.5,
      "endFrequency": 5,
      "intensity": 0.8,
      "color": "#00f2fe"
    },
    {
      "name": "Gradual Return",
      "duration": 300,
      "description": "Gentle reemergence",
      "startFrequency": 5,
      "endFrequency": 10,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  1500
);

-- Energy Boost Protocol
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
  'Energy Activation',
  'High-beta protocol for quick mental energization and alertness. Ideal for combating afternoon fatigue.',
  'energy',
  2,
  5,
  true,
  '[
    {
      "name": "Wake-up Call",
      "duration": 45,
      "description": "Initial activation",
      "startFrequency": 12,
      "endFrequency": 15,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Energy Rise",
      "duration": 90,
      "description": "Building alertness",
      "startFrequency": 15,
      "endFrequency": 18,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Peak Activation",
      "duration": 180,
      "description": "Maximum mental energy",
      "startFrequency": 18,
      "endFrequency": 20,
      "intensity": 0.8,
      "color": "#f093fb"
    },
    {
      "name": "Sustained Vitality",
      "duration": 240,
      "description": "Maintained high alertness",
      "startFrequency": 20,
      "endFrequency": 18,
      "intensity": 0.75,
      "color": "#4facfe"
    },
    {
      "name": "Energy Stabilization",
      "duration": 120,
      "description": "Balanced alertness",
      "startFrequency": 18,
      "endFrequency": 15,
      "intensity": 0.7,
      "color": "#00f2fe"
    },
    {
      "name": "Integration",
      "duration": 75,
      "description": "Smooth transition",
      "startFrequency": 15,
      "endFrequency": 14,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  750
);

-- Study & Learning Protocol
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
  'Study Enhancement',
  'Beta protocol optimized for learning, memory consolidation, and information retention. Perfect for study sessions.',
  'study',
  2,
  5,
  true,
  '[
    {
      "name": "Mental Preparation",
      "duration": 60,
      "description": "Preparing for learning",
      "startFrequency": 12,
      "endFrequency": 14,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Focus Activation",
      "duration": 120,
      "description": "Entering study mode",
      "startFrequency": 14,
      "endFrequency": 16,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Learning Peak",
      "duration": 360,
      "description": "Optimal learning state",
      "startFrequency": 16,
      "endFrequency": 17,
      "intensity": 0.75,
      "color": "#f093fb"
    },
    {
      "name": "Memory Consolidation",
      "duration": 240,
      "description": "Encoding information",
      "startFrequency": 17,
      "endFrequency": 15,
      "intensity": 0.7,
      "color": "#4facfe"
    },
    {
      "name": "Retention Phase",
      "duration": 180,
      "description": "Solidifying memory",
      "startFrequency": 15,
      "endFrequency": 13,
      "intensity": 0.65,
      "color": "#00f2fe"
    },
    {
      "name": "Integration",
      "duration": 90,
      "description": "Smooth conclusion",
      "startFrequency": 13,
      "endFrequency": 12,
      "intensity": 0.6,
      "color": "#43e97b"
    }
  ]'::jsonb,
  1050
);

-- Power Nap Protocol
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
  'Power Nap',
  'Short alpha-theta protocol for quick rejuvenation. 20-minute restorative break without entering deep sleep.',
  'rest',
  1,
  5,
  true,
  '[
    {
      "name": "Quick Settle",
      "duration": 180,
      "description": "Rapid relaxation",
      "startFrequency": 12,
      "endFrequency": 8,
      "intensity": 0.6,
      "color": "#667eea"
    },
    {
      "name": "Light Theta",
      "duration": 420,
      "description": "Restorative rest",
      "startFrequency": 8,
      "endFrequency": 6,
      "intensity": 0.7,
      "color": "#764ba2"
    },
    {
      "name": "Rest Peak",
      "duration": 480,
      "description": "Maximum restoration",
      "startFrequency": 6,
      "endFrequency": 6,
      "intensity": 0.75,
      "color": "#f093fb"
    },
    {
      "name": "Gentle Wake",
      "duration": 120,
      "description": "Starting to resurface",
      "startFrequency": 6,
      "endFrequency": 10,
      "intensity": 0.6,
      "color": "#4facfe"
    }
  ]'::jsonb,
  1200
);

-- Stress Relief Protocol
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
  'Stress Relief',
  'Alpha-dominant protocol for rapid stress reduction and nervous system regulation. Promotes calm and balance.',
  'stress',
  1,
  5,
  true,
  '[
    {
      "name": "Tension Release",
      "duration": 90,
      "description": "Releasing physical tension",
      "startFrequency": 14,
      "endFrequency": 12,
      "intensity": 0.5,
      "color": "#667eea"
    },
    {
      "name": "Alpha Entry",
      "duration": 120,
      "description": "Entering calm state",
      "startFrequency": 12,
      "endFrequency": 10,
      "intensity": 0.65,
      "color": "#764ba2"
    },
    {
      "name": "Deep Relaxation",
      "duration": 240,
      "description": "Profound stress relief",
      "startFrequency": 10,
      "endFrequency": 9,
      "intensity": 0.75,
      "color": "#f093fb"
    },
    {
      "name": "Calm Integration",
      "duration": 180,
      "description": "Stabilizing peace",
      "startFrequency": 9,
      "endFrequency": 9,
      "intensity": 0.7,
      "color": "#4facfe"
    },
    {
      "name": "Balance Restoration",
      "duration": 150,
      "description": "Returning to balance",
      "startFrequency": 9,
      "endFrequency": 11,
      "intensity": 0.6,
      "color": "#00f2fe"
    },
    {
      "name": "Refreshed Return",
      "duration": 120,
      "description": "Renewed baseline",
      "startFrequency": 11,
      "endFrequency": 12,
      "intensity": 0.5,
      "color": "#43e97b"
    }
  ]'::jsonb,
  900
);

-- Verify all protocols
SELECT name, category, difficulty, safety_rating, total_duration 
FROM protocols 
ORDER BY category, name;
