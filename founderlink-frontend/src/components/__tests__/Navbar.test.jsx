import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import Navbar from '../Navbar';
import { AuthProvider } from '../../context/AuthContext';

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    role: null,
    email: null,
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

test('Navbar renders brand logo', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  const logo = screen.getByAltText(/FounderLink/i);
  expect(logo).toBeInTheDocument();
});

test('Navbar shows Sign In and Get Started buttons when unauthenticated', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  expect(screen.getByText(/SIGN IN/i)).toBeInTheDocument();
  expect(screen.getByText(/GET STARTED/i)).toBeInTheDocument();
});
