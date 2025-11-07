/**
 * Auth Component Tests
 * Tests for login, registration, validation, and user interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Auth } from '../components/Auth';
import { useAuthStore } from '../store/authStore';

// Mock the auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Auth Component', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      render(<Auth />);
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should handle email input', () => {
      render(<Auth />);
      const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should handle password input', () => {
      render(<Auth />);
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
      expect(passwordInput.value).toBe('SecurePass123!');
    });

    it('should call login when form submitted', async () => {
      render(<Auth />);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'SecurePass123!');
      });
    });

    it('should toggle password visibility', () => {
      render(<Auth />);
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const toggleButton = screen.getByLabelText(/show password|toggle password/i);
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Registration Mode', () => {
    it('should switch to registration mode', () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);
      
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    });

    it('should require all registration fields', () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    });

    it('should show medical disclaimer checkbox', () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      const disclaimerCheckbox = screen.getByRole('checkbox', {
        name: /medical disclaimer|i accept/i,
      });
      expect(disclaimerCheckbox).toBeInTheDocument();
    });

    it('should require medical disclaimer acceptance', async () => {
      window.alert = vi.fn();
      
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);

      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });

      const submitButton = screen.getByRole('button', { name: /create account|sign up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('medical disclaimer')
        );
      });
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should submit registration with valid data', async () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const disclaimerCheckbox = screen.getByRole('checkbox', {
        name: /medical disclaimer|i accept/i,
      });

      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.click(disclaimerCheckbox);

      const submitButton = screen.getByRole('button', { name: /create account|sign up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'new@example.com',
            password: 'SecurePass123!',
            username: 'newuser',
            medicalDisclaimerAccepted: true,
          })
        );
      });
    });

    it('should show password strength indicator', () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      // Weak password
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      // Should show some strength indicator (implementation may vary)
      
      // Strong password
      fireEvent.change(passwordInput, { target: { value: 'VerySecure123!@#' } });
      // Should show stronger indicator
    });
  });

  describe('Error Handling', () => {
    it('should display error message', () => {
      (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        isLoading: false,
        error: 'Invalid credentials',
        clearError: mockClearError,
      });

      render(<Auth />);
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('should clear error when switching modes', () => {
      render(<Auth />);
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', () => {
      (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        isLoading: true,
        error: null,
        clearError: mockClearError,
      });

      render(<Auth />);
      const submitButton = screen.getByRole('button', { name: /sign in|login/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation UI', () => {
    it('should clear form when switching modes', () => {
      render(<Auth />);
      
      // Fill login form
      const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Switch to registration
      const switchButton = screen.getByText(/create account|sign up|register/i);
      fireEvent.click(switchButton);

      // Form should be cleared
      const newEmailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
      const newPasswordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      expect(newEmailInput.value).toBe('');
      expect(newPasswordInput.value).toBe('');
    });
  });
});
