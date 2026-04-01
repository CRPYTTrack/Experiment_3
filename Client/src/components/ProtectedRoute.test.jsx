import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext');

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;

  it('should show loading while authentication is loading', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(container.querySelector('a[href="/login"]')).toBeInTheDocument();
  });
});
