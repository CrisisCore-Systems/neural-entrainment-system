export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAdmin?: boolean;
  gatewayAccess?: boolean;
  gatewayLevel?: number;
  gatewayTrainingCompleted?: boolean;
  totalStandardSessions?: number;
  created_at?: string;
  last_login?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Backend API Protocol type (from database)
export interface Protocol {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: number;
  total_duration: number;
  safety_rating: number;
  usage_count: number;
  is_public: boolean;
  phases: Array<{
    name: string;
    description: string;
    duration: number;
    startFrequency: number;
    endFrequency: number;
    intensity: number;
    color: string;
  }>;
}

// Backend API Session type (from database)
export interface Session {
  id: string;
  protocol_id: string;
  user_id: string;
  protocol_name?: string;
  status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
  start_time?: string;
  started_at?: string;
  end_time?: string;
  ended_at?: string;
  duration?: number;
  current_phase?: number;
  metrics?: Record<string, unknown>;
  coherence?: number;
  focus?: number;
  arousal?: number;
}

export interface SessionMetrics {
  coherence: number;
  focus: number;
  arousal: number;
  timestamp: string;
}

