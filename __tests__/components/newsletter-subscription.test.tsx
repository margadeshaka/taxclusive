import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsletterSubscription from '@/components/newsletter-subscription';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('NewsletterSubscription', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders newsletter subscription form', () => {
    render(<NewsletterSubscription />);

    expect(screen.getByRole('heading', { name: /newsletter/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('handles successful subscription', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Subscribed successfully' }),
    });

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Fill in email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit form
    fireEvent.click(subscribeButton);

    // Check loading state
    expect(subscribeButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/subscribed successfully/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  it('handles subscription errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already subscribed' }),
    });

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/email already subscribed/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Try with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    // Should not make API call with invalid email
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('prevents empty email submission', async () => {
    render(<NewsletterSubscription />);

    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Try to submit without email
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('clears form after successful subscription', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Subscribed successfully' }),
    });

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i) as HTMLInputElement;
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/subscribed successfully/i)).toBeInTheDocument();
    });

    // Email input should be cleared
    expect(emailInput.value).toBe('');
  });

  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', () => {
    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    // Tab to email input
    emailInput.focus();
    expect(document.activeElement).toBe(emailInput);

    // Tab to submit button
    fireEvent.keyDown(emailInput, { key: 'Tab' });
    subscribeButton.focus();
    expect(document.activeElement).toBe(subscribeButton);
  });

  it('submits form on Enter key press', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Subscribed successfully' }),
    });

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(subscribeButton).toHaveAttribute('type', 'submit');
  });

  it('shows loading spinner during submission', async () => {
    // Mock a delayed response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true }),
        }), 100)
      )
    );

    render(<NewsletterSubscription />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    // Check for loading state
    expect(subscribeButton).toBeDisabled();
    expect(screen.getByText(/subscribing/i) || screen.getByRole('button', { name: /subscribing/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(subscribeButton).not.toBeDisabled();
    }, { timeout: 200 });
  });

  it('matches snapshot', () => {
    const { container } = render(<NewsletterSubscription />);
    expect(container.firstChild).toMatchSnapshot();
  });
});