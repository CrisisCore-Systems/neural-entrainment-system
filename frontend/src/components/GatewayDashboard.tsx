import { useState, useEffect } from 'react';
import { GATEWAY_PROTOCOLS, hasGatewayAccess, getNextUnlockRequirement } from '../config/gatewayProtocols';
import { useAuthStore } from '../store/authStore';
import '../styles/GatewayDashboard.css';

interface GatewaySession {
  id: number;
  focusLevel: number;
  date: string;
  duration: number;
  stateDepth?: number;
  phenomenaReported: string[];
  notes: string;
}

interface UserGatewayProfile {
  userId: number;
  gatewayAccess: boolean;
  gatewayLevel: number; // Max focus level unlocked
  totalSessions: number;
  gatewaySessions: GatewaySession[];
}

interface GatewayDashboardProps {
  onExit?: () => void;
  onStartSession?: (protocolId: string) => void;
}

export default function GatewayDashboard({ onExit, onStartSession }: GatewayDashboardProps) {
  const { user } = useAuthStore();
  
  // Compute initial gateway level
  const getInitialGatewayLevel = () => {
    if (!user) return 0;
    const hasAccess = user.gatewayAccess;
    const currentLevel = user.gatewayLevel || 0;
    
    // If user has gateway access but no level set, unlock Focus 10 by default
    if (hasAccess && currentLevel === 0) {
      return 10;
    }
    return currentLevel;
  };
  
  const [profile, setProfile] = useState<UserGatewayProfile>({
    userId: 0,
    gatewayAccess: user?.gatewayAccess || false,
    gatewayLevel: getInitialGatewayLevel(),
    totalSessions: user?.totalStandardSessions || 0,
    gatewaySessions: [
      {
        id: 1,
        focusLevel: 10,
        date: '2025-10-30',
        duration: 30,
        stateDepth: 7,
        phenomenaReported: ['Vibrations', 'Energy Sensations'],
        notes: 'First successful F10. Felt strong vibrations at 15-minute mark.',
      },
      {
        id: 2,
        focusLevel: 12,
        date: '2025-10-28',
        duration: 35,
        stateDepth: 6,
        phenomenaReported: ['Time Distortion', 'Expanded Awareness'],
        notes: 'Time seemed to compress. Received intuitive insights about project.',
      },
      {
        id: 3,
        focusLevel: 12,
        date: '2025-10-25',
        duration: 35,
        stateDepth: 8,
        phenomenaReported: ['Expanded Awareness', 'Archetypal Imagery'],
        notes: 'Deeper than previous F12. Saw geometric patterns with symbolic meaning.',
      },
    ],
  });

  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [showJournal, setShowJournal] = useState(false);

  // Check if user has gateway access
  useEffect(() => {
    console.log('Gateway Dashboard - User data:', user);
    if (user) {
      // Handle both camelCase and snake_case from backend
      const gatewayAccess = (user as any).gateway_access || user.gatewayAccess || false;
      let gatewayLevel = (user as any).gateway_level || user.gatewayLevel || 0;
      const totalSessions = (user as any).total_standard_sessions || user.totalStandardSessions || 0;
      
      // If user has gateway access but no level set, unlock Focus 10 by default
      if (gatewayAccess && gatewayLevel === 0) {
        console.log('Gateway Access granted but level is 0, defaulting to level 10 (Focus 10 unlocked)');
        gatewayLevel = 10;
      }
      
      console.log('Gateway Access:', gatewayAccess);
      console.log('Gateway Level:', gatewayLevel);
      console.log('Total Sessions:', totalSessions);
      
      setProfile((prev) => ({
        ...prev,
        gatewayAccess,
        gatewayLevel,
        totalSessions,
      }));
    }
  }, [user]);

  if (!profile.gatewayAccess) {
    return (
      <div className="gateway-access-denied">
        <div className="access-denied-content">
          <div className="icon-lock">🔒</div>
          <h1>Gateway Process - Admin Access Required</h1>
          <p>
            The Gateway Process is an advanced consciousness exploration program
            reserved for experienced practitioners with proper training.
          </p>
          <div className="requirements">
            <h3>Requirements for Access:</h3>
            <ul>
              <li>✓ Complete 50+ standard sessions</li>
              <li>✓ No history of seizures or psychiatric conditions</li>
              <li>✓ Admin approval and Gateway training</li>
              <li>✓ Signed advanced consent form</li>
              <li>✗ Understanding of OBE/NDE phenomena</li>
            </ul>
          </div>
          <p className="contact-admin">
            Contact your administrator to request Gateway access.
          </p>
          <button onClick={onExit || (() => {})} className="btn-return">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const nextUnlock = getNextUnlockRequirement(profile.gatewayLevel);
  const progressPercent = (profile.totalSessions / nextUnlock.sessionsRequired) * 100;

  const renderProtocolCard = (protocolKey: string) => {
    const protocol = GATEWAY_PROTOCOLS[protocolKey];
    const isUnlocked = hasGatewayAccess(profile.gatewayLevel, protocol.focusLevel);
    const sessionCount = profile.gatewaySessions.filter(
      s => s.focusLevel === protocol.focusLevel
    ).length;

    const difficultyColors: Record<string, string> = {
      beginner: '#4ade80',
      intermediate: '#fbbf24',
      advanced: '#fb923c',
      expert: '#f87171',
      master: '#a78bfa',
    };

    return (
      <div
        key={protocolKey}
        className={`gateway-protocol-card ${!isUnlocked ? 'locked' : ''} ${
          selectedProtocol === protocolKey ? 'selected' : ''
        }`}
        onClick={() => {
          if (isUnlocked) {
            console.log('[GatewayDashboard] Protocol card clicked:', protocolKey);
            setSelectedProtocol(protocolKey);
            console.log('[GatewayDashboard] Protocol selected:', protocolKey);
          } else {
            console.log('[GatewayDashboard] Protocol locked, cannot select:', protocolKey);
          }
        }}
      >
        <div className="protocol-header">
          <div className="focus-badge" style={{ 
            backgroundColor: difficultyColors[protocol.difficulty] 
          }}>
            FOCUS {protocol.focusLevel}
          </div>
          {!isUnlocked && <div className="lock-icon">🔒</div>}
        </div>
        
        <h3 className="protocol-name">
          {protocol.name.split(':')[1] || protocol.name}
        </h3>
        
        <p className="protocol-description">{protocol.description}</p>
        
        <div className="protocol-stats">
          <div className="stat">
            <span className="stat-label">Sessions:</span>
            <span className="stat-value">{sessionCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Duration:</span>
            <span className="stat-value">
              {Math.round(protocol.phases.reduce((sum, p) => sum + p.duration, 0) / 60)} min
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Difficulty:</span>
            <span className="stat-value" style={{ color: difficultyColors[protocol.difficulty] }}>
              {protocol.difficulty}
            </span>
          </div>
        </div>

        {!isUnlocked && (
          <div className="unlock-requirements">
            <p>📋 Prerequisites:</p>
            <ul>
              {protocol.prerequisites.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {(() => {
          console.log('[GatewayDashboard] Button check for', protocolKey, ':', {
            isUnlocked,
            selectedProtocol,
            shouldShowButton: isUnlocked && selectedProtocol === protocolKey,
            shouldShowClickText: isUnlocked && !selectedProtocol
          });
          return null;
        })()}

        {isUnlocked && selectedProtocol === protocolKey && (
          <button
            className="btn-begin-session"
            style={{
              position: 'relative',
              zIndex: 10,
              backgroundColor: '#a78bfa',
              color: 'white',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: '2px solid #ec4899',
              cursor: 'pointer',
              animation: 'pulse 2s infinite'
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log('[GatewayDashboard] Begin Session clicked for protocol:', protocolKey);
              console.log('[GatewayDashboard] Protocol details:', protocol);
              console.log('[GatewayDashboard] onStartSession handler exists:', !!onStartSession);
              if (onStartSession) {
                console.log('[GatewayDashboard] Calling onStartSession...');
                onStartSession(protocolKey);
              } else {
                console.error('[GatewayDashboard] onStartSession is not defined!');
                alert('Navigation handler not configured. Check console for details.');
              }
            }}
          >
            🚀 BEGIN SESSION NOW →
          </button>
        )}

        {isUnlocked && !selectedProtocol && (
          <div className="click-to-select">
            👆 Click to select protocol
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="gateway-dashboard">
      {/* Header */}
      <header className="gateway-header">
        <div className="header-content">
          <h1 className="gateway-title">
            <span className="icon-gateway">🌌</span>
            Gateway Process
          </h1>
          <p className="gateway-subtitle">
            "Exploring the Far Reaches of Consciousness"
          </p>
        </div>
        <button onClick={onExit || (() => {})} className="btn-exit">
          Exit Gateway ←
        </button>
      </header>

      {/* Progress Section */}
      <section className="progress-section">
        <h2>Your Progress</h2>
        <div className="progress-card">
          <div className="progress-info">
            <div className="current-level">
              <span className="label">Current Level:</span>
              <span className="value">Focus {profile.gatewayLevel} Unlocked</span>
            </div>
            <div className="session-count">
              <span className="label">Total Sessions:</span>
              <span className="value">{profile.totalSessions}</span>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <p className="progress-text">
              {profile.totalSessions} / {nextUnlock.sessionsRequired} sessions to unlock Focus {nextUnlock.nextLevel}
            </p>
          </div>
        </div>
      </section>

      {/* Protocol Cards */}
      <section className="protocols-section">
        <h2>Focus Levels</h2>
        <div className="protocols-grid">
          {renderProtocolCard('focus10')}
          {renderProtocolCard('focus12')}
          {renderProtocolCard('focus15')}
          {renderProtocolCard('focus21')}
          {renderProtocolCard('focus27')}
        </div>
      </section>

      {/* Recent Phenomena */}
      <section className="phenomena-section">
        <h2>Recent Phenomena</h2>
        <div className="phenomena-list">
          {profile.gatewaySessions.slice(0, 5).map((session) => (
            <div key={session.id} className="phenomenon-item">
              <div className="phenomenon-header">
                <span className="focus-label">Focus {session.focusLevel}</span>
                <span className="date">{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="phenomenon-tags">
                {session.phenomenaReported.map((phenom, i) => (
                  <span key={i} className="tag">{phenom}</span>
                ))}
              </div>
              {session.stateDepth && (
                <div className="state-depth">
                  Depth: {session.stateDepth}/10
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="actions-section">
        <button 
          className="btn-journal"
          onClick={() => setShowJournal(!showJournal)}
        >
          📝 Journal Entries ({profile.gatewaySessions.length})
        </button>
        <button className="btn-stats">
          📊 Progress Statistics
        </button>
        <button className="btn-resources">
          📚 Integration Resources
        </button>
      </section>

      {/* Journal Modal */}
      {showJournal && (
        <div className="modal-overlay" onClick={() => setShowJournal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gateway Journal Entries</h2>
              <button onClick={() => setShowJournal(false)} className="btn-close">
                ✕
              </button>
            </div>
            <div className="journal-entries">
              {profile.gatewaySessions.map((session) => (
                <div key={session.id} className="journal-entry">
                  <div className="entry-header">
                    <h3>Focus {session.focusLevel} Session</h3>
                    <span className="entry-date">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="entry-meta">
                    <span>Duration: {session.duration} min</span>
                    {session.stateDepth && <span>Depth: {session.stateDepth}/10</span>}
                  </div>
                  <div className="entry-phenomena">
                    {session.phenomenaReported.map((p, i) => (
                      <span key={i} className="tag">{p}</span>
                    ))}
                  </div>
                  <p className="entry-notes">{session.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Safety Footer */}
      <footer className="gateway-footer">
        <p className="safety-reminder">
          ⚠️ <strong>Safety Reminder:</strong> Use grounding affirmation "I return to physical awareness NOW" 
          if you feel uncomfortable. Emergency stop available at all times.
        </p>
        <p className="disclaimer">
          Gateway experiences are for consciousness exploration only and are not medical treatment. 
          Always integrate experiences with proper support.
        </p>
      </footer>
    </div>
  );
}
