import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import HomePage from '../../app/page';

// Mock fetch
global.fetch = jest.fn();

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    from: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn(),
      from: jest.fn(),
    })),
  },
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn(() => []),
    refresh: jest.fn(),
  },
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          _id: '1',
          name: 'Suite Premium',
          type: 'suite',
          price: 200,
          maxGuests: 4,
          amenities: ['WiFi', 'TV', 'Minibar'],
          images: ['/images/suite.jpg'],
        },
        {
          _id: '2',
          name: 'Habitación Deluxe',
          type: 'deluxe',
          price: 150,
          maxGuests: 2,
          amenities: ['WiFi', 'TV'],
          images: ['/images/deluxe.jpg'],
        },
      ],
    });
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Granada INN/i)).toBeTruthy();
    });
  });

  it('displays hotel name', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      const hotelNameElements = screen.getAllByText(/Granada INN/i);
      expect(hotelNameElements.length).toBeGreaterThan(0);
    });
  });

  it('displays welcome message', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Experiencia única/i)).toBeTruthy();
    });
  });

  it('displays room information', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Suite Premium/i)).toBeTruthy();
      expect(screen.getByText(/Habitación Deluxe/i)).toBeTruthy();
    });
  });

  it('displays room prices', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/200€/i)).toBeTruthy();
      expect(screen.getByText(/150€/i)).toBeTruthy();
    });
  });

  it('displays amenities', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/WiFi/i)).toBeTruthy();
      expect(screen.getByText(/TV/i)).toBeTruthy();
    });
  });

  it('displays contact information', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/958 123 456/i)).toBeTruthy();
      expect(screen.getByText(/info@granadainn.com/i)).toBeTruthy();
    });
  });

  it('displays address', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Carretera A-92/i)).toBeTruthy();
      expect(screen.getByText(/Granada/i)).toBeTruthy();
    });
  });

  it('displays services section', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Servicios destacados/i)).toBeTruthy();
      expect(screen.getByText(/Restaurante tradicional/i)).toBeTruthy();
      expect(screen.getByText(/Habitaciones confortables/i)).toBeTruthy();
    });
  });

  it('displays events section', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Eventos y celebraciones/i)).toBeTruthy();
    });
  });

  it('displays garden section', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Jardín y exteriores/i)).toBeTruthy();
    });
  });

  it('displays footer', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/© 2024 Granada Inn/i)).toBeTruthy();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Granada INN/i)).toBeTruthy();
    });
  });
});
