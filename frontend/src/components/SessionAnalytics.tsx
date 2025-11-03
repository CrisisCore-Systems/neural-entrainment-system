/**
 * Session Analytics Dashboard
 * Displays session history, stats, and progress charts
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { eventBus, EVENTS } from '../utils/eventBus';
import './SessionAnalytics.css';

interface SessionStats {
  total_sessions: number;
  completed_sessions: number;
  total_duration: number;
  avg_coherence: number;
  avg_focus: number;
}

interface Session {
  id: string;
  protocol_name: string;
  started_at: string;
  ended_at: string;
  duration: number;
  completed: boolean;
  status: string;
  avg_coherence: number;
  avg_focus: number;
}

export const SessionAnalytics: React.FC = () => {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();

    // Listen for session completion events to refresh stats
    const handleSessionUpdate = () => {
      console.log('[SessionAnalytics] Refreshing stats...');
      loadStats();
    };

    eventBus.on(EVENTS.SESSION_COMPLETED, handleSessionUpdate);
    eventBus.on(EVENTS.SESSION_STOPPED, handleSessionUpdate);

    return () => {
      eventBus.off(EVENTS.SESSION_COMPLETED, handleSessionUpdate);
      eventBus.off(EVENTS.SESSION_STOPPED, handleSessionUpdate);
    };
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats from backend
      const [statsResponse, sessionsResponse] = await Promise.all([
        apiClient.getSessionStats(),
        apiClient.getSessions(),
      ]);

      if (statsResponse.error) {
        setError(statsResponse.error);
      } else {
        setStats(statsResponse.data as SessionStats);
      }

      if (!sessionsResponse.error && sessionsResponse.data) {
        setRecentSessions(sessionsResponse.data.sessions.slice(0, 5));
      }
    } catch (err) {
      console.error('[SessionAnalytics] Error loading stats:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={loadStats} className="retry-button">Retry</button>
      </div>
    );
  }

  if (!stats || stats.total_sessions === 0) {
    return (
      <div className="analytics-empty">
        <h3>No Sessions Yet</h3>
        <p>Complete your first neural entrainment session to see your analytics here!</p>
      </div>
    );
  }

  return (
    <div className="session-analytics">
      <div className="analytics-header">
        <h2>Session Analytics</h2>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.total_sessions || 0}</div>
          <div className="stat-label">Total Sessions</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completed_sessions || 0}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatDuration(stats.total_duration || 0)}</div>
          <div className="stat-label">Total Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧠</div>
          <div className="stat-value">{((stats.avg_coherence || 0) * 100).toFixed(0)}%</div>
          <div className="stat-label">Avg Coherence</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{((stats.avg_focus || 0) * 100).toFixed(0)}%</div>
          <div className="stat-label">Avg Focus</div>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="recent-sessions">
          <h3>Recent Sessions</h3>
          <div className="session-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-icon">
                  {session.completed ? '✅' : '⏸️'}
                </div>
                <div className="session-details">
                  <div className="session-name">{session.protocol_name}</div>
                  <div className="session-meta">
                    {formatTime(session.started_at)} · {formatDuration(session.duration || 0)}
                  </div>
                  <div className="session-status">
                    {session.status}
                  </div>
                </div>
                <div className="session-metrics">
                  {session.avg_coherence && (
                    <div className="metric-badge">
                      <span className="metric-label">Coherence</span>
                      <span className="metric-value">
                        {(session.avg_coherence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {session.avg_focus && (
                    <div className="metric-badge">
                      <span className="metric-label">Focus</span>
                      <span className="metric-value">
                        {(session.avg_focus * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
