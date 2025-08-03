import { 
  fetchWithRetry, 
  addRequestInterceptor, 
  addResponseInterceptor, 
  addErrorInterceptor,
  clearInterceptors,
  RequestOptions 
} from '@/lib/api-client';
import { NetworkError, AuthenticationError, AuthorizationError } from '@/lib/error-handler';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock CSRF token function
jest.mock('@/lib/csrf', () => ({
  getCSRFToken: () => 'mock-csrf-token',
}));

// Mock rate limit
jest.mock('@/lib/rate-limit', () => ({
  rateLimitedFetch: jest.fn((fetchFn) => fetchFn),
}));

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    clearInterceptors();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should make successful request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
        }),
      });

      const response = await fetchWithRetry('/test');
      
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        signal: expect.any(AbortSignal),
      }));
      expect(response.ok).toBe(true);
    });

    it('should handle request options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
        }),
      });

      const options: RequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      };

      await fetchWithRetry('/test', options);
      
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'mock-csrf-token',
        }),
        body: '{"test":"data"}',
        signal: expect.any(AbortSignal),
      }));
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        clone: () => ({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          headers: new Headers(),
        }),
      });

      await expect(fetchWithRetry('/nonexistent')).rejects.toThrow('Resource not found');
    });

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers(),
        clone: () => ({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          headers: new Headers(),
        }),
      });

      await expect(fetchWithRetry('/protected')).rejects.toThrow(AuthenticationError);
    });

    it('should handle authorization errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: new Headers(),
        clone: () => ({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          headers: new Headers(),
        }),
      });

      await expect(fetchWithRetry('/admin')).rejects.toThrow(AuthorizationError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(fetchWithRetry('/test')).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((resolve) => 
          setTimeout(() => resolve({
            ok: true,
            status: 200,
            headers: new Headers(),
            clone: () => ({
              ok: true,
              status: 200,
              headers: new Headers(),
            }),
          }), 15000)
        )
      );

      const promise = fetchWithRetry('/slow-endpoint', { timeout: 1000 });
      
      jest.advanceTimersByTime(1000);
      
      await expect(promise).rejects.toThrow('Request timeout after 1000ms');
    });
  });

  describe('Retry mechanism', () => {
    it('should retry failed requests', async () => {
      mockFetch
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          clone: () => ({
            ok: true,
            status: 200,
            headers: new Headers(),
          }),
        });

      const response = await fetchWithRetry('/test', { retries: 2 });
      
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(response.ok).toBe(true);
    });

    it('should respect maximum retry attempts', async () => {
      mockFetch.mockRejectedValue(new TypeError('Network error'));

      await expect(
        fetchWithRetry('/test', { retries: 1 })
      ).rejects.toThrow('Network error');
      
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should retry retryable HTTP errors', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: new Headers(),
          clone: () => ({
            ok: false,
            status: 500,
            headers: new Headers(),
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          clone: () => ({
            ok: true,
            status: 200,
            headers: new Headers(),
          }),
        });

      const response = await fetchWithRetry('/test', { retries: 1 });
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });

    it('should not retry non-retryable errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers(),
        clone: () => ({
          ok: false,
          status: 400,
          headers: new Headers(),
        }),
      });

      await expect(fetchWithRetry('/test', { retries: 3 })).rejects.toThrow();
      
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries for 400
    });
  });

  describe('Request/Response interceptors', () => {
    it('should apply request interceptors', async () => {
      addRequestInterceptor((url, options) => ({
        url,
        options: {
          ...options,
          headers: { ...options.headers, 'X-Custom-Header': 'test' },
        },
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
        }),
      });

      await fetchWithRetry('/test');
      
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'X-Custom-Header': 'test',
        }),
      }));
    });

    it('should apply response interceptors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
          intercepted: true,
        }),
      };

      addResponseInterceptor((response) => {
        const cloned = response.clone();
        return { ...cloned, intercepted: true } as Response;
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await fetchWithRetry('/test');
      
      expect(result.intercepted).toBe(true);
    });

    it('should apply error interceptors', async () => {
      addErrorInterceptor((error) => {
        throw new Error(`Intercepted: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });

      mockFetch.mockRejectedValueOnce(new Error('Original error'));

      await expect(fetchWithRetry('/test')).rejects.toThrow('Intercepted: Original error');
    });
  });

  describe('CSRF protection', () => {
    it('should include CSRF token for non-GET requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
        }),
      });

      await fetchWithRetry('/test', { method: 'POST' });
      
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'X-CSRF-Token': 'mock-csrf-token',
        }),
      }));
    });

    it('should not include CSRF token for GET requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        clone: () => ({
          ok: true,
          status: 200,
          headers: new Headers(),
        }),
      });

      await fetchWithRetry('/test', { method: 'GET' });
      
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.not.objectContaining({
        headers: expect.objectContaining({
          'X-CSRF-Token': expect.any(String),
        }),
      }));
    });
  });
});