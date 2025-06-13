// Import necessary testing utilities and context providers
import { renderHook, act } from '@testing-library/react-hooks';
import { WeatherProvider, WeatherContext } from '../context/WeatherContext';

// Unit tests for the WeatherContext functionality
describe('WeatherContext', () => {

  // Test updating the location state inside WeatherContext
  it('should update location correctly', () => {
    const wrapper = ({ children }) => <WeatherProvider>{children}</WeatherProvider>;
    const { result } = renderHook(() => React.useContext(WeatherContext), { wrapper });

    act(() => {
      result.current.updateLocation({ city: 'porto' });
    });

    expect(result.current.location.city).toBe('porto');
  });

  // Test handling a successful login inside WeatherContext
  it('should handle login success', async () => {
    // Mocking the global fetch function to simulate API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token', user: { username: 'admin' } }),
      })
    );

    const wrapper = ({ children }) => <WeatherProvider>{children}</WeatherProvider>;
    const { result, waitForNextUpdate } = renderHook(() => React.useContext(WeatherContext), { wrapper });

    await act(async () => {
      result.current.login({ username: 'a', password: '1' });
      await waitForNextUpdate();
    });

    expect(result.current.user).toEqual({ username: 'admin' });
  });
});

/**
 * Unit tests for WeatherContext state and authentication logic.
 *
 * These tests verify the core state manipulation and async login behavior
 * exposed by the WeatherContext when used via `WeatherProvider`.
 *
 * Tests:
 *
 * - Updates the location state and verifies the new value.
 * - Mocks a successful API login call and verifies the user state updates.
 */
