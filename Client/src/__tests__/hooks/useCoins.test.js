import { renderHook, waitFor } from '@testing-library/react';
import useCoins from '../../hooks/useCoins';

global.fetch = jest.fn();

test('useCoins fetches market data', async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => [{ id: 'bitcoin', name: 'Bitcoin' }],
  });

  const { result } = renderHook(() => useCoins({ bitcoin: 1 }));
  await waitFor(() => expect(result.current.loading).toBe(false));

  expect(result.current.coins[0].id).toBe('bitcoin');
  expect(result.current.error).toBe(null);
});
