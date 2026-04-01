import { authAPI, portfolioAPI, watchlistAPI } from './api';
import axios from 'axios';

jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('authAPI', () => {
    it('should login with correct credentials', async () => {
      const mockResponse = { data: { token: 'token123', user: { id: 1 } } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login('user', 'pass');
      expect(result).toEqual(mockResponse.data);
    });

    it('should register new user', async () => {
      const mockResponse = { data: { success: true } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.register('newuser', 'pass123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed login', async () => {
      axios.post.mockRejectedValue(new Error('Login failed'));

      await expect(authAPI.login('user', 'wrong')).rejects.toThrow('Login failed');
    });
  });

  describe('portfolioAPI', () => {
    it('should fetch portfolio', async () => {
      const mockData = { data: { btc: 0.5, eth: 2 } };
      axios.get.mockResolvedValue(mockData);

      const result = await portfolioAPI.get();
      expect(result).toEqual(mockData.data);
    });

    it('should update portfolio', async () => {
      const mockResponse = { data: { success: true } };
      axios.put.mockResolvedValue(mockResponse);

      const result = await portfolioAPI.update('btc', { amount: 1 });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('watchlistAPI', () => {
    it('should fetch watchlist', async () => {
      const mockData = { data: ['bitcoin', 'ethereum'] };
      axios.get.mockResolvedValue(mockData);

      const result = await watchlistAPI.get();
      expect(result).toEqual(mockData.data);
    });
  });
});
