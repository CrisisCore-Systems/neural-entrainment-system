/**
 * Authentication Component - Enhanced UI/UX
 * Login and Registration with modern animations and micro-interactions
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import './Auth.css';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    medicalDisclaimerAccepted: false,
    hasEpilepsy: false,
    hasHeartCondition: false,
    hasMentalHealthCondition: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { login, register, isLoading, error, clearError } = useAuthStore();

  // Password strength calculator
  useEffect(() => {
    if (mode === 'register') {
      const pwd = formData.password;
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (pwd.length >= 12) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^A-Za-z0-9]/.test(pwd)) strength++;
      setPasswordStrength(Math.min(strength, 4));
    }
  }, [formData.password, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsAnimating(true);

    if (mode === 'login') {
      await login(formData.email, formData.password);
    } else {
      if (!formData.medicalDisclaimerAccepted) {
        alert('You must accept the medical disclaimer to proceed.');
        setIsAnimating(false);
        return;
      }
      await register(formData);
    }
    
    setIsAnimating(false);
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearError();
    setFormData({
      email: '',
      password: '',
      username: '',
      medicalDisclaimerAccepted: false,
      hasEpilepsy: false,
      hasHeartCondition: false,
      hasMentalHealthCondition: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const passwordStrengthColor = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'][passwordStrength];
  const passwordStrengthLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength];

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="neural-grid"></div>
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="auth-card glass-strong">
        {/* Logo/Brand */}
        <div className="auth-logo">
          <div className="logo-icon">⚡</div>
        </div>
        
        <h1 className="auth-title gradient-text">CrisisCore Neural Interface</h1>
        <p className="auth-subtitle">Advanced Neural Entrainment Platform</p>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => handleModeSwitch('login')}
          >
            <span className="tab-icon">🔐</span>
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => handleModeSwitch('register')}
          >
            <span className="tab-icon">✨</span>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group animate-slide-in">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Choose a unique username"
                className="input-enhanced"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <span className="label-icon">✉️</span>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="input-enhanced"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔑</span>
              Password
              {mode === 'register' && formData.password && (
                <span 
                  className="password-strength-badge"
                  style={{ backgroundColor: passwordStrengthColor }}
                >
                  {passwordStrengthLabel}
                </span>
              )}
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Enter your password'}
                className="input-enhanced"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {mode === 'register' && formData.password && (
              <div className="password-strength-meter">
                <div 
                  className="strength-fill"
                  style={{ 
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: passwordStrengthColor
                  }}
                />
              </div>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div className="medical-disclaimer animate-slide-in glass">
                <div className="disclaimer-header">
                  <span className="disclaimer-icon">⚕️</span>
                  <h3>Medical Screening</h3>
                </div>
                <p className="disclaimer-text">
                  Neural entrainment uses binaural beats and visual stimulation. Please indicate if you have any of the following conditions:
                </p>

                <div className="medical-conditions">
                  <label className="checkbox-label medical-checkbox">
                    <input
                      type="checkbox"
                      name="hasEpilepsy"
                      checked={formData.hasEpilepsy}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <span className="condition-icon">⚠️</span>
                      I have epilepsy or a history of seizures
                    </span>
                  </label>

                  <label className="checkbox-label medical-checkbox">
                    <input
                      type="checkbox"
                      name="hasHeartCondition"
                      checked={formData.hasHeartCondition}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <span className="condition-icon">💓</span>
                      I have a heart condition or use a pacemaker
                    </span>
                  </label>

                  <label className="checkbox-label medical-checkbox">
                    <input
                      type="checkbox"
                      name="hasMentalHealthCondition"
                      checked={formData.hasMentalHealthCondition}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <span className="condition-icon">🧠</span>
                      I have a mental health condition
                    </span>
                  </label>
                </div>

                <label className="checkbox-label disclaimer-accept">
                  <input
                    type="checkbox"
                    name="medicalDisclaimerAccepted"
                    checked={formData.medicalDisclaimerAccepted}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    <strong>I understand</strong> that this is not a medical device and should not be used as a substitute for professional medical advice. I accept full responsibility for my use of this platform.
                  </span>
                </label>
              </div>
            </>
          )}

          {error && (
            <div className="error-message animate-shake">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`submit-button glow ${isAnimating ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <span className="button-icon">{mode === 'login' ? '🚀' : '✨'}</span>
                {mode === 'login' ? 'Enter Neural Interface' : 'Begin Your Journey'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="security-badge">
            <span className="badge-icon">🔒</span>
            <span className="badge-text">Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
