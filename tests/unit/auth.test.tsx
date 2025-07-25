import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/login/page';
import RegisterPage from '../../app/register/page';
import { AuthProvider } from '../../lib/contexts/AuthContext';

// Mock useAuth hook
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../lib/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    register: mockRegister,
    loginWithGoogle: mockLoginWithGoogle,
    logout: mockLogout,
  }),
}));

describe('Auth Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginPage', () => {
    it('renders login form correctly', () => {
      render(<LoginPage />);

      expect(screen.getByText('GRANADA INN')).toBeInTheDocument();
      expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar con google/i })).toBeInTheDocument();
    });

    it('handles email login form submission', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('handles Google login', async () => {
      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continuar con google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockLoginWithGoogle).toHaveBeenCalled();
      });
    });

    it('shows link to register page', () => {
      render(<LoginPage />);

      expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
    });
  });

  describe('RegisterPage', () => {
    it('renders register form correctly', () => {
      render(<RegisterPage />);

      expect(screen.getByText('GRANADA INN')).toBeInTheDocument();
      expect(screen.getByText('Únete a nosotros')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    it('validates password confirmation', async () => {
      render(<RegisterPage />);

      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
      const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('validates password length', async () => {
      render(<RegisterPage />);

      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
      const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('La contraseña debe tener al menos 6 caracteres'),
        ).toBeInTheDocument();
      });
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('handles successful registration', async () => {
      render(<RegisterPage />);

      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
      const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows link to login page', () => {
      render(<RegisterPage />);

      expect(screen.getByText('Inicia sesión aquí')).toBeInTheDocument();
    });
  });
});
