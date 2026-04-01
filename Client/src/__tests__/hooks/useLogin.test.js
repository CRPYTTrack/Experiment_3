import { renderHook, act } from '@testing-library/react';
import useLogin from '../../hooks/useLogin';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('../../services/api', () => ({ authAPI: { login: jest.fn() } }));

test('useLogin submits successfully', async () => {
  const login = jest.fn();
  const navigate = jest.fn();
  useAuth.mockReturnValue({ login });
  useNavigate.mockReturnValue(navigate);
  authAPI.login.mockResolvedValue({ token: 't1', user: { id: 1 } });

  const { result } = renderHook(() => useLogin('u', 'p', false));
  await act(async () => {
    await result.current.handleSubmit({ preventDefault: jest.fn() });
  });

  expect(login).toHaveBeenCalledWith('t1', { id: 1 });
  expect(navigate).toHaveBeenCalledWith('/dashboard');
});
