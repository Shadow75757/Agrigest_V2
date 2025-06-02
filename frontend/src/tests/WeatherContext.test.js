import { renderHook, act } from '@testing-library/react-hooks';
import { WeatherProvider, WeatherContext } from '../context/WeatherContext';

describe('WeatherContext', () => {
  it('should update location correctly', () => {
    const wrapper = ({ children }) => <WeatherProvider>{children}</WeatherProvider>;
    const { result } = renderHook(() => React.useContext(WeatherContext), { wrapper });
    
    act(() => {
      result.current.updateLocation({ city: 'porto' });
    });
    
    expect(result.current.location.city).toBe('porto');
  });

  it('should handle login success', async () => {
    // Mock da função fetch
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