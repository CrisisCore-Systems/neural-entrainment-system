import { useState, useEffect } from 'react'
import { SessionControl } from './components/SessionControl'
import { SessionAnalytics } from './components/SessionAnalytics'
import { Auth } from './components/Auth'
import { ProtocolSelector } from './components/ProtocolSelector'
import GatewayDashboard from './components/GatewayDashboard'
import GatewaySession from './components/GatewaySession'
import { MonetizationPlanGenerator } from './components/MonetizationPlanGenerator'
import { useAuthStore } from './store/authStore'
import './styles/theme.css'
import './App.css'

interface Protocol {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: number;
  total_duration: number;
  safety_rating: number;
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

function App() {
  const [view, setView] = useState<'protocols' | 'session' | 'analytics' | 'gateway' | 'gateway-session' | 'monetization'>('protocols')
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [selectedGatewayProtocol, setSelectedGatewayProtocol] = useState<string | null>(null)
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth />
  }

  const handleProtocolSelect = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
    setView('session')
  }

  const handleBackToProtocols = () => {
    setView('protocols')
    setSelectedProtocol(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="user-info">
          <span className="username">{user?.username}</span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      
      <nav className="app-nav">
        <button
          className={view === 'protocols' ? 'active' : ''}
          onClick={() => setView('protocols')}
        >
          Protocols
        </button>
        <button
          className={view === 'session' ? 'active' : ''}
          onClick={() => setView('session')}
          disabled={!selectedProtocol}
        >
          Session
        </button>
        <button
          className={view === 'analytics' ? 'active' : ''}
          onClick={() => setView('analytics')}
        >
          Analytics
        </button>
        <button
          className={view === 'monetization' ? 'active' : ''}
          onClick={() => setView('monetization')}
        >
          💰 Monetization
        </button>
        {(user?.isAdmin || user?.gatewayAccess) && (
          <button
            className={`gateway-button ${view === 'gateway' ? 'active' : ''}`}
            onClick={() => setView('gateway')}
          >
            🌌 Gateway
          </button>
        )}
      </nav>
      
      {view === 'protocols' && (
        <ProtocolSelector 
          onSelect={handleProtocolSelect}
          onOpenGateway={() => setView('gateway')}
        />
      )}
      {view === 'session' && selectedProtocol && (
        <SessionControl 
          protocol={selectedProtocol}
          onBack={handleBackToProtocols}
        />
      )}
      {view === 'analytics' && <SessionAnalytics />}
      {view === 'monetization' && (
        <MonetizationPlanGenerator onBack={() => setView('protocols')} />
      )}
      {view === 'gateway' && (
        <GatewayDashboard 
          onExit={() => {
            console.log('[App] Gateway Exit button clicked');
            setView('protocols');
            console.log('[App] View changed to: protocols');
          }}
          onStartSession={(protocolId) => {
            console.log('[App] Gateway onStartSession called with protocolId:', protocolId);
            setSelectedGatewayProtocol(protocolId);
            console.log('[App] selectedGatewayProtocol set to:', protocolId);
            setView('gateway-session');
            console.log('[App] View changed to: gateway-session');
          }}
        />
      )}
      {view === 'gateway-session' && selectedGatewayProtocol && (
        <>
          {console.log('[App] Rendering GatewaySession component with protocolId:', selectedGatewayProtocol)}
          {console.log('[App] view state:', view)}
          {console.log('[App] selectedGatewayProtocol state:', selectedGatewayProtocol)}
          <GatewaySession 
            protocolId={selectedGatewayProtocol}
            onExit={() => {
              console.log('[App] Gateway Session Exit button clicked');
              setSelectedGatewayProtocol(null);
              setView('gateway');
              console.log('[App] View changed back to: gateway');
            }}
          />
        </>
      )}
    </div>
  )
}

export default App
