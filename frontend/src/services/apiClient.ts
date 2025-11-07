/**
 * API Client Service
 * Handles all backend communication
 */

import type { User, AuthResponse, Protocol, Session } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Generic fetch wrapper
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  /**
   * Authentication endpoints
   */
  async register(data: {
    email: string;
    password: string;
    username: string;
    medicalDisclaimerAccepted: boolean;
    hasEpilepsy?: boolean;
    hasHeartCondition?: boolean;
    hasMentalHealthCondition?: boolean;
  }) {
    const response = await this.request<AuthResponse>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<AuthResponse>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/api/auth/me');
  }

  /**
   * Protocol endpoints
   */
  async getProtocols() {
    return this.request<{ protocols: Protocol[] }>('/api/protocols');
  }

  async getProtocol(id: string) {
    return this.request<{ protocol: Protocol }>(`/api/protocols/${id}`);
  }

  /**
   * Session endpoints
   */
  async getSessions() {
    return this.request<{ sessions: Session[] }>('/api/sessions');
  }

  async createSession(protocolId: string) {
    return this.request<{ session: Session }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ protocolId }),
    });
  }

  async updateSession(sessionId: string, data: {
    status?: string;
    end_time?: string;
    real_time_metrics?: Record<string, number>;
  }) {
    return this.request(`/api/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSessionStats() {
    return this.request<Record<string, unknown>>('/api/sessions/stats');
  }

  /**
   * User preferences endpoints
   */
  async getPreferences() {
    return this.request<{ preferences: Record<string, unknown> }>('/api/users/preferences');
  }

  async updatePreferences(preferences: Record<string, unknown>) {
    return this.request('/api/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request<{ status: string; timestamp: string; uptime: number }>(
      '/health'
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
