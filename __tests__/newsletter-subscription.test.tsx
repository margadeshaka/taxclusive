import { render, screen } from '@testing-library/react';
import NewsletterSubscription from '@/components/newsletter-subscription';

describe('NewsletterSubscription', () => {
  it('renders the newsletter subscription form', () => {
    render(<NewsletterSubscription />);
    
    // Check if the heading is rendered
    expect(screen.getByText('Subscribe to Our Newsletter')).toBeInTheDocument();
    
    // Check if the email input is rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    
    // Check if the subscribe button is rendered
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    
    // Check if the privacy policy link is rendered
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});