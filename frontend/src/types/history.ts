/**
 * Session History Types
 * For tracking and analyzing past neural entrainment sessions
 */

import type { CognitiveMetrics } from './session';

export interface SessionRecord {
  id: string;
  protocolId: string;
  protocolName: string;
  startTime: number;
  endTime: number;
  duration: number; // seconds
  completed: boolean;
  phasesCompleted: number;
  totalPhases: number;
  finalMetrics: CognitiveMetrics;
  averageMetrics: CognitiveMetrics;
}

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  totalDuration: number; // seconds
  currentStreak: number; // days
  longestStreak: number; // days
  lastSessionDate: number | null;
  averageCoherence: number;
  averageFocus: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  sessionCount: number;
  totalDuration: number;
  averageCoherence: number;
  averageFocus: number;
}
