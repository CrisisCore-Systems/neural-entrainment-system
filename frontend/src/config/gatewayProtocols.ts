/**
 * Gateway Process Configuration
 * Based on Monroe Institute's Focus Levels for consciousness exploration
 * 
 * Focus 10: Mind Awake/Body Asleep
 * Focus 12: Expanded Awareness
 * Focus 15: No Time
 * Focus 21: Bridge to Other Energy Systems
 * Focus 27: The Park / Planning Center
 */

export interface GatewayPhase {
  name: string;
  duration: number; // seconds
  beatFreq: number | [number, number]; // Hz or sweep range
  carrierType: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  secondaryBeat?: number; // For dual-layer (e.g., Focus 21)
  isochronic?: {
    enabled: boolean;
    intensity: number; // 0-1
  };
  spatial?: {
    enabled: boolean;
    pattern: 'circular' | 'figure8' | 'linear';
    speed: number; // rotations per minute
  };
  ambient?: {
    type: 'white' | 'pink' | 'brown';
    volume: number; // 0-1
    secondary?: 'white' | 'pink' | 'brown';
    secondaryVolume?: number;
  };
  preset: 'warm' | 'bright' | 'deep' | 'ethereal' | 'natural';
  reverb?: number; // 0-1, optional enhanced reverb
}

export interface GatewayProtocol {
  id: string;
  name: string;
  focusLevel: 10 | 12 | 15 | 21 | 27;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  prerequisites: string[];
  phases: GatewayPhase[];
  visual: 'SacredSeedOfLife' | 'SacredFlowerOfLife' | 'SacredFibonacciSpiral' | 'SacredMetatronsCube' | 'SacredSriYantra' | 'SacredMerkaba';
  affirmations: string[];
  phenomena: string[]; // Expected experiences
  warnings: string[];
}

export const GATEWAY_PROTOCOLS: Record<string, GatewayProtocol> = {
  focus10: {
    id: 'focus10',
    name: 'Focus 10: Mind Awake/Body Asleep',
    focusLevel: 10,
    description: 'Gateway to expanded awareness through physical relaxation with mental alertness. Experience body/mind separation.',
    difficulty: 'beginner',
    prerequisites: [
      'Complete 20+ standard sessions',
      'Comfortable with 30-minute sessions',
      'No seizure history',
    ],
    phases: [
      {
        name: 'Entry & REBAL',
        duration: 300, // 5 min
        beatFreq: [7, 5], // Alpha to theta sweep
        carrierType: 'alpha',
        isochronic: { enabled: true, intensity: 0.3 },
        ambient: { type: 'pink', volume: 0.08 },
        preset: 'warm',
      },
      {
        name: 'Deepening',
        duration: 600, // 10 min
        beatFreq: 5,
        carrierType: 'theta',
        isochronic: { enabled: true, intensity: 0.3 },
        ambient: { type: 'pink', volume: 0.08 },
        preset: 'deep',
      },
      {
        name: 'Mind Awake/Body Asleep',
        duration: 600, // 10 min
        beatFreq: 5,
        carrierType: 'theta',
        isochronic: { enabled: true, intensity: 0.25 },
        ambient: { type: 'pink', volume: 0.06 },
        preset: 'deep',
      },
      {
        name: 'Gentle Return',
        duration: 300, // 5 min
        beatFreq: [5, 10],
        carrierType: 'alpha',
        isochronic: { enabled: false, intensity: 0 },
        ambient: { type: 'pink', volume: 0.04 },
        preset: 'natural',
      },
    ],
    visual: 'SacredSeedOfLife',
    affirmations: [
      'I am more than my physical body',
      'My mind is awake, my body is asleep',
      'I move freely between states of consciousness',
      'I am protected by unconditional love',
    ],
    phenomena: [
      'Vibrations or tingling sensations',
      'Feeling of floating or lightness',
      'Temporary inability to move (sleep paralysis)',
      'Heightened sensory awareness',
      'Body-mind separation',
    ],
    warnings: [
      'May experience intense vibrations - this is normal',
      'Do not panic if you feel paralyzed - it will pass',
      'Use grounding affirmation if uncomfortable',
    ],
  },

  focus12: {
    id: 'focus12',
    name: 'Focus 12: Expanded Awareness',
    focusLevel: 12,
    description: 'State of increased perception and clarity. Enhanced intuition, problem-solving, and non-physical information access.',
    difficulty: 'intermediate',
    prerequisites: [
      'Complete 5+ Focus 10 sessions',
      'Comfortable with body-mind separation',
      'Able to maintain awareness for 35 minutes',
    ],
    phases: [
      {
        name: 'Preparation',
        duration: 300, // 5 min
        beatFreq: [8, 10],
        carrierType: 'alpha',
        spatial: { enabled: true, pattern: 'circular', speed: 2 },
        ambient: { type: 'brown', volume: 0.06 },
        preset: 'bright',
      },
      {
        name: 'Expansion',
        duration: 900, // 15 min
        beatFreq: [10, 12],
        carrierType: 'alpha',
        spatial: { enabled: true, pattern: 'circular', speed: 1.5 },
        ambient: { type: 'brown', volume: 0.06 },
        preset: 'ethereal',
      },
      {
        name: 'Peak Awareness',
        duration: 600, // 10 min
        beatFreq: 12,
        carrierType: 'alpha',
        spatial: { enabled: true, pattern: 'circular', speed: 1 },
        ambient: { type: 'brown', volume: 0.05 },
        preset: 'ethereal',
      },
      {
        name: 'Integration',
        duration: 300, // 5 min
        beatFreq: [12, 10],
        carrierType: 'alpha',
        spatial: { enabled: false, pattern: 'linear', speed: 0 },
        ambient: { type: 'brown', volume: 0.03 },
        preset: 'natural',
      },
    ],
    visual: 'SacredFlowerOfLife',
    affirmations: [
      'I gather and use expanded awareness',
      'I perceive beyond physical senses',
      'I receive clear intuitive information',
      'My consciousness expands effortlessly',
    ],
    phenomena: [
      'Enhanced intuition and insights',
      'Non-verbal information reception',
      'Symbolic or archetypal imagery',
      'Time perception shifts',
      'Remote viewing capabilities',
    ],
    warnings: [
      'Information may come in non-linear formats',
      'Trust your perceptions without forcing interpretation',
      'Integration time is essential post-session',
    ],
  },

  focus15: {
    id: 'focus15',
    name: 'Focus 15: No Time',
    focusLevel: 15,
    description: 'Timeless state beyond physical time-space. Access information from past, present, and future simultaneously.',
    difficulty: 'advanced',
    prerequisites: [
      'Complete 8+ Focus 12 sessions',
      'Comfortable with non-linear perception',
      'Strong grounding practice',
    ],
    phases: [
      {
        name: 'Time Dissolution',
        duration: 600, // 10 min
        beatFreq: [6, 4],
        carrierType: 'theta',
        isochronic: { enabled: true, intensity: 0.4 },
        ambient: { type: 'brown', volume: 0.10 },
        preset: 'deep',
        reverb: 0.25,
      },
      {
        name: 'Timeless State',
        duration: 1200, // 20 min
        beatFreq: 4,
        carrierType: 'delta',
        isochronic: { enabled: true, intensity: 0.4 },
        ambient: { type: 'brown', volume: 0.10 },
        preset: 'deep',
        reverb: 0.30,
      },
      {
        name: 'Temporal Return',
        duration: 600, // 10 min
        beatFreq: [4, 8],
        carrierType: 'theta',
        isochronic: { enabled: true, intensity: 0.2 },
        ambient: { type: 'brown', volume: 0.06 },
        preset: 'warm',
        reverb: 0.15,
      },
    ],
    visual: 'SacredFibonacciSpiral',
    affirmations: [
      'I exist beyond the constraints of time',
      'I access information from all temporal points',
      'Past, present, and future are one',
      'I navigate the timeless with clarity',
    ],
    phenomena: [
      'Complete time disorientation',
      'Simultaneous past/present/future awareness',
      'Life review or preview experiences',
      'Temporal precognition',
      'Non-sequential memory access',
    ],
    warnings: [
      'Disorientation upon return is common',
      'Take extra integration time (20+ minutes)',
      'Ground thoroughly before standing',
      'Do not drive for 30 minutes post-session',
    ],
  },

  focus21: {
    id: 'focus21',
    name: 'Focus 21: Bridge to Other Energy Systems',
    focusLevel: 21,
    description: 'Boundary between physical and non-physical reality. Contact with guides, higher self, and non-physical entities.',
    difficulty: 'expert',
    prerequisites: [
      'Complete 10+ Focus 15 sessions',
      'Strong discernment practices',
      'Clear intention and protection protocols',
      'Admin approval required',
    ],
    phases: [
      {
        name: 'Ascent to Bridge',
        duration: 600, // 10 min
        beatFreq: [10, 40], // Alpha to gamma - paradoxical arousal
        carrierType: 'gamma',
        secondaryBeat: 6, // Theta anchor
        ambient: { type: 'white', volume: 0.05 },
        preset: 'ethereal',
        spatial: { enabled: true, pattern: 'figure8', speed: 2.5 },
      },
      {
        name: 'Bridge Exploration',
        duration: 1200, // 20 min
        beatFreq: 40,
        carrierType: 'gamma',
        secondaryBeat: 6,
        ambient: { type: 'white', volume: 0.05 },
        preset: 'ethereal',
        spatial: { enabled: true, pattern: 'figure8', speed: 2 },
      },
      {
        name: 'Communication Phase',
        duration: 900, // 15 min
        beatFreq: 40,
        carrierType: 'gamma',
        secondaryBeat: 6,
        ambient: { type: 'white', volume: 0.04 },
        preset: 'ethereal',
        spatial: { enabled: true, pattern: 'figure8', speed: 1.5 },
      },
      {
        name: 'Return to Physical',
        duration: 600, // 10 min
        beatFreq: [40, 10],
        carrierType: 'alpha',
        ambient: { type: 'pink', volume: 0.05 },
        preset: 'natural',
        spatial: { enabled: false, pattern: 'linear', speed: 0 },
      },
    ],
    visual: 'SacredMetatronsCube',
    affirmations: [
      'I am receptive to non-physical communication',
      'I meet my guides with clarity and discernment',
      'I bridge physical and non-physical realities',
      'I am protected by unconditional love and light',
      'Only benevolent entities may approach',
    ],
    phenomena: [
      'Presence of non-physical entities',
      'Telepathic communication',
      'Visual or auditory contact with guides',
      'Downloads of complex information',
      'Profound sense of connection',
    ],
    warnings: [
      '⚠️ ADVANCED PRACTITIONERS ONLY',
      'Use protection protocols before entering',
      'Maintain discernment - not all entities are benevolent',
      'Ground thoroughly for 30+ minutes post-session',
      'Seek integration support if experiences are overwhelming',
    ],
  },

  focus27: {
    id: 'focus27',
    name: 'Focus 27: The Park / Planning Center',
    focusLevel: 27,
    description: 'Afterlife reception area and collaborative consciousness space. Life blueprint review and consciousness rescue operations.',
    difficulty: 'master',
    prerequisites: [
      'Complete 15+ Focus 21 sessions',
      'Proven ability to maintain awareness at all focus levels',
      'Clear intention for service or personal development',
      'Admin approval and advanced training',
    ],
    phases: [
      {
        name: 'Journey to The Park',
        duration: 900, // 15 min
        beatFreq: [10, 13],
        carrierType: 'alpha',
        isochronic: { enabled: true, intensity: 0.25 },
        ambient: { 
          type: 'pink', 
          volume: 0.07,
          secondary: 'white',
          secondaryVolume: 0.03,
        },
        preset: 'ethereal',
      },
      {
        name: 'Arrival and Orientation',
        duration: 600, // 10 min
        beatFreq: 13,
        carrierType: 'alpha',
        isochronic: { enabled: true, intensity: 0.25 },
        ambient: { 
          type: 'pink', 
          volume: 0.07,
          secondary: 'white',
          secondaryVolume: 0.03,
        },
        preset: 'ethereal',
      },
      {
        name: 'Work and Collaboration',
        duration: 1800, // 30 min
        beatFreq: 14, // SMR "the zone"
        carrierType: 'alpha',
        isochronic: { enabled: true, intensity: 0.25 },
        ambient: { 
          type: 'pink', 
          volume: 0.06,
          secondary: 'white',
          secondaryVolume: 0.02,
        },
        preset: 'ethereal',
        spatial: { enabled: false, pattern: 'linear', speed: 0 }, // Grounded presence
      },
      {
        name: 'Gentle Return',
        duration: 600, // 10 min
        beatFreq: [14, 10],
        carrierType: 'alpha',
        isochronic: { enabled: false, intensity: 0 },
        ambient: { type: 'pink', volume: 0.04 },
        preset: 'natural',
      },
    ],
    visual: 'SacredSriYantra',
    affirmations: [
      'I enter The Park with purpose and clarity',
      'I collaborate with evolved consciousness',
      'I participate in the greater work',
      'I serve with wisdom and compassion',
      'I return with knowledge and integration',
    ],
    phenomena: [
      'Meeting departed loved ones',
      'Life blueprint review and planning',
      'Consciousness rescue participation',
      'Collaboration with guides and teachers',
      'Access to akashic records',
      'Profound sense of purpose and belonging',
    ],
    warnings: [
      '⚠️ MASTER LEVEL ONLY - 100+ total sessions required',
      'Experiences can be profoundly life-changing',
      'Professional integration support recommended',
      'Allow 48 hours for full integration',
      'Do not undertake lightly - this is sacred work',
    ],
  },
};

/**
 * Determines if user has access to a specific focus level
 */
export function hasGatewayAccess(
  userFocusLevel: number,
  requiredLevel: number
): boolean {
  return userFocusLevel >= requiredLevel;
}

/**
 * Calculate next unlock threshold
 */
export function getNextUnlockRequirement(currentLevel: number): {
  nextLevel: number;
  sessionsRequired: number;
  totalRequired: number;
} {
  const requirements: Record<number, number> = {
    0: 20,   // Need 20 standard to unlock F10
    10: 25,  // Need 25 total (5 F10) to unlock F12
    12: 33,  // Need 33 total (8 F12) to unlock F15
    15: 43,  // Need 43 total (10 F15) to unlock F21
    21: 58,  // Need 58 total (15 F21) to unlock F27
  };

  const nextLevel = currentLevel === 0 ? 10 : currentLevel + (currentLevel === 27 ? 0 : 3);
  
  return {
    nextLevel,
    sessionsRequired: requirements[currentLevel] || 0,
    totalRequired: requirements[currentLevel] || 0,
  };
}

/**
 * Get phenomenon categories for tracking
 */
export const PHENOMENON_CATEGORIES = [
  'Vibrations',
  'Out-of-Body (OBE)',
  'Near-Death-like (NDE)',
  'Entity Contact',
  'Guide Communication',
  'Time Distortion',
  'Expanded Awareness',
  'Remote Viewing',
  'Precognition',
  'Past Life Memory',
  'Life Review',
  'Telepathy',
  'Energy Sensations',
  'Light/Color Visions',
  'Archetypal Imagery',
  'Unconditional Love',
  'Cosmic Consciousness',
  'The Void/Emptiness',
] as const;

export type PhenomenonCategory = typeof PHENOMENON_CATEGORIES[number];
