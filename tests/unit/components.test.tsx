import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

// Mock the useAuth hook to return a test user
jest.mock('../../lib/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    loginWithGoogle: jest.fn(),
  }),
}));

describe('Components', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    ) as jest.Mock;
  });

  describe('HomePage', () => {
    it('renders basic elements without crashing', () => {
      render(<HomePage />);

      // Test that multiple Granada Inn elements are present (header, hero, footer)
      const elements = screen.getAllByText(/Granada Inn/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('renders booking form elements', () => {
      render(<HomePage />);

      // Test that booking form elements are present
      expect(screen.getByText(/Reserva tu estancia/i)).toBeTruthy();
      expect(screen.getByText(/Check In/i)).toBeTruthy();
      expect(screen.getByText(/Check Out/i)).toBeTruthy();
    });

    it('shows login prompt when user is not authenticated', () => {
      render(<HomePage />);

      // Should show login prompt for booking
      expect(screen.getByText(/INICIAR SESIÓN PARA RESERVAR/i)).toBeTruthy();
    });
  });
});
