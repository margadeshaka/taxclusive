import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '@/components/features/home/hero-section';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('HeroSection', () => {
  it('renders hero content correctly', () => {
    render(<HeroSection />);

    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for description text
    expect(screen.getByText(/professional chartered accountancy/i)).toBeInTheDocument();

    // Check for CTA buttons
    expect(screen.getByRole('link', { name: /book consultation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore services/i })).toBeInTheDocument();
  });

  it('has correct CTA button links', () => {
    render(<HeroSection />);

    const consultationLink = screen.getByRole('link', { name: /book consultation/i });
    const servicesLink = screen.getByRole('link', { name: /explore services/i });

    expect(consultationLink).toHaveAttribute('href', '/appointment');
    expect(servicesLink).toHaveAttribute('href', '/services');
  });

  it('renders hero image with correct attributes', () => {
    render(<HeroSection />);

    const heroImage = screen.getByAltText(/taxclusive hero/i);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src');
  });

  it('has proper semantic structure', () => {
    render(<HeroSection />);

    // Should be wrapped in a section
    const section = screen.getByRole('banner');
    expect(section).toBeInTheDocument();

    // Should have proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
  });

  it('is responsive and has proper styling', () => {
    render(<HeroSection />);

    const section = screen.getByRole('banner');
    
    // Check for responsive classes (this is a basic check)
    expect(section).toHaveClass(/flex|grid|container/);
  });

  it('handles button interactions', () => {
    render(<HeroSection />);

    const consultationButton = screen.getByRole('link', { name: /book consultation/i });
    const servicesButton = screen.getByRole('link', { name: /explore services/i });

    // Check that buttons are clickable
    expect(consultationButton).not.toBeDisabled();
    expect(servicesButton).not.toBeDisabled();

    // Simulate clicks (won't navigate in test environment)
    fireEvent.click(consultationButton);
    fireEvent.click(servicesButton);

    // Buttons should still be present after clicks
    expect(consultationButton).toBeInTheDocument();
    expect(servicesButton).toBeInTheDocument();
  });

  it('meets accessibility requirements', () => {
    render(<HeroSection />);

    // Check for alt text on images
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });

    // Check for proper link text (not just "click here")
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link.textContent).not.toMatch(/^(click here|read more|learn more)$/i);
    });

    // Check that interactive elements are keyboard accessible
    const consultationButton = screen.getByRole('link', { name: /book consultation/i });
    expect(consultationButton).toHaveAttribute('href');
  });

  it('matches snapshot', () => {
    const { container } = render(<HeroSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});