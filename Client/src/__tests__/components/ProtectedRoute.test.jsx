import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

test('ProtectedRoute renders children for authenticated user', () => {
  useAuth.mockReturnValue({ isAuthenticated: true, loading: false });
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});
