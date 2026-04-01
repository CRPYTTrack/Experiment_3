import { renderHook, waitFor } from '@testing-library/react';
import useCoins from './useCoins';

global.fetch = jest.fn();

describe('useCoins Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should initialize with empty coins and loading true', () => {
    const { result } = renderHook(() => useCoins({}));
    expect(result.current.coins).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should fetch coins data successfully', async () => {
    const mockData = [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' }];
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useCoins({ bitcoin: 1 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.coins).toEqual(mockData);
  });

  it('should handle empty portfolio', async () => {
    const { result } = renderHook(() => useCoins({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.coins).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should set error on failed fetch', async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useCoins({ bitcoin: 1 }));

    await waitFor(() => {
      expect(result.current.error).toBe('An error occured');
    });
  });

  it('should handle network error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCoins({ bitcoin: 1 }));

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
  });

  it('should fetch multiple coins', async () => {
    const mockData = [
      { id: 'bitcoin', name: 'Bitcoin' },
      { id: 'ethereum', name: 'Ethereum' },
    ];
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useCoins({ bitcoin: 1, ethereum: 2 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('bitcoin,ethereum')
    );
  });
});
