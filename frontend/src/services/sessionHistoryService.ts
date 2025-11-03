/**
 * Session History Service
 * Manages session records in localStorage with analytics
 */

import type { SessionRecord, SessionStats, DailyStats } from '../types/history';

const STORAGE_KEY = 'neural-entrainment-history';

class SessionHistoryService {
  /**
   * Save a completed session
   */
  saveSession(record: SessionRecord): void {
    const history = this.getAllSessions();
    history.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log('[HistoryService] Session saved:', record.id);
  }

  /**
   * Get all session records
   */
  getAllSessions(): SessionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[HistoryService] Error loading sessions:', error);
      return [];
    }
  }

  /**
   * Get recent sessions (last N)
   */
  getRecentSessions(limit: number = 10): SessionRecord[] {
    const sessions = this.getAllSessions();
    return sessions
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }

  /**
   * Get sessions for a specific date range
   */
  getSessionsByDateRange(startDate: Date, endDate: Date): SessionRecord[] {
    const sessions = this.getAllSessions();
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return sessions.filter(s => s.startTime >= start && s.startTime <= end);
  }

  /**
   * Calculate overall statistics
   */
  getStats(): SessionStats {
    const sessions = this.getAllSessions();
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null,
        averageCoherence: 0,
        averageFocus: 0,
        sessionsThisWeek: 0,
        sessionsThisMonth: 0
      };
    }

    const completed = sessions.filter(s => s.completed);
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate average metrics
    const avgCoherence = completed.length > 0
      ? completed.reduce((sum, s) => sum + s.averageMetrics.coherence, 0) / completed.length
      : 0;
    const avgFocus = completed.length > 0
      ? completed.reduce((sum, s) => sum + s.averageMetrics.focus, 0) / completed.length
      : 0;

    // Calculate streaks
    const streaks = this.calculateStreaks(sessions);
    
    // Sessions this week/month
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    const sessionsThisWeek = sessions.filter(s => s.startTime >= weekAgo).length;
    const sessionsThisMonth = sessions.filter(s => s.startTime >= monthAgo).length;

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      totalDuration,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      lastSessionDate: sessions[sessions.length - 1]?.startTime || null,
      averageCoherence: avgCoherence,
      averageFocus: avgFocus,
      sessionsThisWeek,
      sessionsThisMonth
    };
  }

  /**
   * Calculate current and longest streaks
   */
  private calculateStreaks(sessions: SessionRecord[]): { current: number; longest: number } {
    if (sessions.length === 0) return { current: 0, longest: 0 };

    // Get unique days with sessions
    const sessionDays = new Set(
      sessions.map(s => this.formatDate(new Date(s.startTime)))
    );
    
    const sortedDays = Array.from(sessionDays).sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    const today = this.formatDate(new Date());
    const yesterday = this.formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    // Check if current streak is active
    if (sortedDays[sortedDays.length - 1] === today || 
        sortedDays[sortedDays.length - 1] === yesterday) {
      currentStreak = 1;
      
      // Count consecutive days backwards
      for (let i = sortedDays.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedDays[i + 1]);
        const prevDate = new Date(sortedDays[i]);
        const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Find longest streak
    for (let i = 1; i < sortedDays.length; i++) {
      const currentDate = new Date(sortedDays[i]);
      const prevDate = new Date(sortedDays[i - 1]);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    
    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * Get daily statistics for charts
   */
  getDailyStats(days: number = 30): DailyStats[] {
    const sessions = this.getAllSessions();
    const now = Date.now();
    const startDate = now - days * 24 * 60 * 60 * 1000;
    
    const recentSessions = sessions.filter(s => s.startTime >= startDate);
    
    // Group by date
    const statsByDate = new Map<string, DailyStats>();
    
    recentSessions.forEach(session => {
      const dateKey = this.formatDate(new Date(session.startTime));
      
      if (!statsByDate.has(dateKey)) {
        statsByDate.set(dateKey, {
          date: dateKey,
          sessionCount: 0,
          totalDuration: 0,
          averageCoherence: 0,
          averageFocus: 0
        });
      }
      
      const stats = statsByDate.get(dateKey)!;
      stats.sessionCount++;
      stats.totalDuration += session.duration;
      stats.averageCoherence += session.averageMetrics.coherence;
      stats.averageFocus += session.averageMetrics.focus;
    });
    
    // Calculate averages
    statsByDate.forEach(stats => {
      if (stats.sessionCount > 0) {
        stats.averageCoherence /= stats.sessionCount;
        stats.averageFocus /= stats.sessionCount;
      }
    });
    
    return Array.from(statsByDate.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Clear all history (for testing or user request)
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[HistoryService] History cleared');
  }

  /**
   * Export history as JSON
   */
  exportHistory(): string {
    const sessions = this.getAllSessions();
    return JSON.stringify(sessions, null, 2);
  }
}

// Export singleton instance
export const sessionHistoryService = new SessionHistoryService();
