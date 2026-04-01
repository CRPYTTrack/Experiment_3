import { renderHook, act } from '@testing-library/react';
import useLogin from './useLogin';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as api from '../services/api';

jest.mock('../context/AuthContext');
jest.mock('react-router-dom');
jest.mock('react-toastify');
jest.mock('../services/api');

describe('useLogin Hook', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should initialize with empty error and loading false', () => {
    const { result } = renderHook(() => useLogin('user', 'pass', false));
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockToken = { token: 'token123', user: { id: 1 } };
    api.authAPI.login.mockResolvedValue(mockToken);

    const { result } = renderHook(() => useLogin('user', 'pass', false));

    await act(async () => {
      const form = { preventDefault: jest.fn() };
      await result.current.handleSubmit(form);
    });

    expect(mockLogin).toHaveBeenCalledWith('token123', { id: 1 });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should set error on failed login', async () => {
    const error = new Error('Login failed');
    error.response = { data: { error: 'Invalid credentials' } };
    api.authAPI.login.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin('user', 'wrong', false));

    await act(async () => {
      const form = { preventDefault: jest.fn() };
      await result.current.handleSubmit(form);
    });

    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should toggle form on successful login', async () => {
    const mockToken = { token: 'token123', user: { id: 1 } };
    const toggleForm = jest.fn();
    api.authAPI.login.mockResolvedValue(mockToken);

    const { result } = renderHook(() => useLogin('user', 'pass', true, toggleForm));

    await act(async () => {
      const form = { preventDefault: jest.fn() };
      await result.current.handleSubmit(form);
    });

    expect(toggleForm).toHaveBeenCalled();
  });
});
