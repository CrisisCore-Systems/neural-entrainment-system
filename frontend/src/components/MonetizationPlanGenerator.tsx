/**
 * Monetization Plan Generator Component
 * Form to collect business idea information and generate monetization strategies
 */

import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import './MonetizationPlanGenerator.css';

interface FormData {
  businessIdea: string;
  targetAudience: string;
  availableResources: string;
  timelineGoals: string;
  industryMarket: string;
  businessModelPreference: string;
  additionalContext: string;
}

const BUSINESS_MODELS = [
  { id: 'subscription', name: 'Subscription', icon: '🔄' },
  { id: 'freemium', name: 'Freemium', icon: '🎁' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'saas', name: 'SaaS', icon: '☁️' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
  { id: 'advertising', name: 'Advertising', icon: '📢' },
  { id: 'affiliate', name: 'Affiliate', icon: '🤝' },
  { id: 'licensing', name: 'Licensing', icon: '📜' },
];

export const MonetizationPlanGenerator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    businessIdea: '',
    targetAudience: '',
    availableResources: '',
    timelineGoals: '',
    industryMarket: '',
    businessModelPreference: '',
    additionalContext: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user } = useAuthStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleModelSelect = (modelId: string) => {
    setFormData((prev) => ({ ...prev, businessModelPreference: modelId }));
    if (errors.businessModelPreference) {
      setErrors((prev) => ({ ...prev, businessModelPreference: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.businessIdea.trim() || formData.businessIdea.trim().length < 10) {
      newErrors.businessIdea = 'Business idea must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${apiUrl}/api/monetization/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit monetization plan');
      }

      const result = await response.json();
      console.log('Monetization plan submitted:', result);
      
      setSubmitSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          businessIdea: '',
          targetAudience: '',
          availableResources: '',
          timelineGoals: '',
          industryMarket: '',
          businessModelPreference: '',
          additionalContext: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Submit error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit monetization plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="monetization-container">
      <div className="monetization-header">
        <h1>
          <span>💰</span>
          Monetization Plan Generator
        </h1>
        <p className="subtitle">Turn your ideas into profitable business strategies</p>
      </div>

      <div className="monetization-form-card">
        {submitSuccess && (
          <div className="success-message">
            <span>✓</span>
            <span>Monetization plan submitted successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Business Idea */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="businessIdea">
                <span className="icon">💡</span>
                Business Idea/Concept
                <span className="required">*</span>
              </label>
              <textarea
                id="businessIdea"
                name="businessIdea"
                className={`form-textarea ${errors.businessIdea ? 'error' : ''}`}
                placeholder="Describe your business idea, product, or service..."
                value={formData.businessIdea}
                onChange={handleChange}
                rows={4}
              />
              {errors.businessIdea && (
                <div className="error-message">
                  <span>⚠</span>
                  {errors.businessIdea}
                </div>
              )}
              <div className="char-count">{formData.businessIdea.length} characters</div>
            </div>

            {/* Target Audience */}
            <div className="form-group">
              <label htmlFor="targetAudience">
                <span className="icon">🎯</span>
                Target Audience
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                className="form-textarea"
                placeholder="Who is your target customer? Demographics, interests, pain points..."
                value={formData.targetAudience}
                onChange={handleChange}
                rows={3}
              />
              <div className="field-hint">
                <span>💡</span>
                <span>Include demographics, interests, and pain points</span>
              </div>
            </div>

            {/* Available Resources */}
            <div className="form-group">
              <label htmlFor="availableResources">
                <span className="icon">💰</span>
                Available Resources
              </label>
              <textarea
                id="availableResources"
                name="availableResources"
                className="form-textarea"
                placeholder="Budget, team size, skills, existing assets..."
                value={formData.availableResources}
                onChange={handleChange}
                rows={3}
              />
              <div className="field-hint">
                <span>💡</span>
                <span>Include budget, team, skills, and assets</span>
              </div>
            </div>

            {/* Timeline & Goals */}
            <div className="form-group">
              <label htmlFor="timelineGoals">
                <span className="icon">⏰</span>
                Timeline & Goals
              </label>
              <textarea
                id="timelineGoals"
                name="timelineGoals"
                className="form-textarea"
                placeholder="When do you want to launch? Revenue goals? Growth timeline..."
                value={formData.timelineGoals}
                onChange={handleChange}
                rows={3}
              />
              <div className="field-hint">
                <span>💡</span>
                <span>Launch date, revenue targets, growth milestones</span>
              </div>
            </div>

            {/* Industry/Market */}
            <div className="form-group">
              <label htmlFor="industryMarket">
                <span className="icon">🏭</span>
                Industry/Market
              </label>
              <input
                type="text"
                id="industryMarket"
                name="industryMarket"
                className="form-input"
                placeholder="e.g., Technology, Healthcare, E-commerce, Education..."
                value={formData.industryMarket}
                onChange={handleChange}
              />
            </div>

            {/* Business Model Preference */}
            <div className="form-group">
              <label>
                <span className="icon">🔧</span>
                Business Model Preference
              </label>
              <div className="business-model-grid">
                {BUSINESS_MODELS.map((model) => (
                  <div
                    key={model.id}
                    className={`model-option ${
                      formData.businessModelPreference === model.id ? 'selected' : ''
                    }`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="model-icon">{model.icon}</div>
                    <div className="model-name">{model.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Context */}
            <div className="form-group">
              <label htmlFor="additionalContext">
                <span className="icon">🚀</span>
                Additional Context
              </label>
              <textarea
                id="additionalContext"
                name="additionalContext"
                className="form-textarea"
                placeholder="Any unique aspects, challenges, competitive advantages..."
                value={formData.additionalContext}
                onChange={handleChange}
                rows={3}
              />
              <div className="field-hint">
                <span>💡</span>
                <span>Unique selling points, challenges, competition</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
              disabled={isSubmitting}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
