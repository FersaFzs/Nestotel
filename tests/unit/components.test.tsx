import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

// Mock useAuth
jest.mock('../../lib/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    loginWithGoogle: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('Components', () => {
  describe('HomePage', () => {
    it('renders homepage without crashing', () => {
      const { container } = render(<HomePage />);

      // Just check that the component rendered without errors
      expect(container).toBeTruthy();
      expect(screen.getAllByText('GRANADA INN').length).toBeGreaterThan(0);
    });

    it('renders navigation menu', () => {
      render(<HomePage />);

      // Check navigation by role
      const nav = document.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(screen.getByText('Inicio')).toBeTruthy();
      expect(screen.getAllByText(/Habitaciones/i).length).toBeGreaterThan(0);
    });

    it('renders auth buttons when not logged in', () => {
      render(<HomePage />);

      expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
      expect(screen.getByText('Registrarse')).toBeTruthy();
    });
  });
});
