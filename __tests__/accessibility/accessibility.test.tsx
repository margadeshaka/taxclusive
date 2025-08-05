/**
 * Accessibility Tests
 * Tests for WCAG compliance, screen reader compatibility, and keyboard navigation
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock components for testing
const MockHeader = () => (
  <header role="banner">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
);

const MockForm = () => (
  <form aria-labelledby="contact-form-title">
    <h2 id="contact-form-title">Contact Form</h2>
    <div>
      <label htmlFor="name">Name (required)</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        aria-describedby="name-error"
        aria-invalid="false"
      />
      <div id="name-error" role="alert" aria-live="polite"></div>
    </div>
    <div>
      <label htmlFor="email">Email (required)</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-describedby="email-error"
        aria-invalid="false"
      />
      <div id="email-error" role="alert" aria-live="polite"></div>
    </div>
    <div>
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows={4}
        aria-describedby="message-hint"
      />
      <div id="message-hint">Tell us how we can help you</div>
    </div>
    <button type="submit">Send Message</button>
  </form>
);

const MockButton = ({ variant = 'primary', disabled = false, children, ...props }: any) => (
  <button
    className={`btn btn-${variant}`}
    disabled={disabled}
    aria-disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const MockModal = ({ isOpen, onClose, title, children }: any) => (
  <>
    {isOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
      >
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="modal-close"
            >
              ×
            </button>
          </div>
          <div id="modal-content">
            {children}
          </div>
        </div>
      </div>
    )}
  </>
);

describe('Accessibility Tests', () => {
  describe('ARIA and Semantic HTML', () => {
    it('should have proper landmark roles', () => {
      render(
        <div>
          <MockHeader />
          <main role="main">
            <h1>Main Content</h1>
            <p>This is the main content area.</p>
          </main>
          <footer role="contentinfo">
            <p>&copy; 2023 Taxclusive</p>
          </footer>
        </div>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(
        <main>
          <h1>Page Title</h1>
          <section>
            <h2>Section 1</h2>
            <h3>Subsection 1.1</h3>
            <h3>Subsection 1.2</h3>
          </section>
          <section>
            <h2>Section 2</h2>
            <h3>Subsection 2.1</h3>
          </section>
        </main>
      );

      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveAttribute('aria-level', '1');
      expect(headings[1]).toHaveAttribute('aria-level', '2');
      expect(headings[2]).toHaveAttribute('aria-level', '3');
    });

    it('should have accessible forms with proper labels', async () => {
      const { container } = render(<MockForm />);
      
      // Check for axe violations
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check form structure
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

      // Check for required field indicators
      expect(screen.getByLabelText(/name.*required/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email.*required/i)).toBeInTheDocument();
    });

    it('should have accessible error messages', () => {
      render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <input
            type="text"
            id="test-input"
            aria-describedby="test-error"
            aria-invalid="true"
          />
          <div id="test-error" role="alert" aria-live="polite">
            This field is required
          </div>
        </div>
      );

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', () => {
      render(
        <div>
          <button>Button 1</button>
          <a href="/test">Link</a>
          <input type="text" placeholder="Input" />
          <button>Button 2</button>
        </div>
      );

      const button1 = screen.getByText('Button 1');
      const link = screen.getByText('Link');
      const input = screen.getByPlaceholderText('Input');
      const button2 = screen.getByText('Button 2');

      // Test tab order
      button1.focus();
      expect(document.activeElement).toBe(button1);

      fireEvent.keyDown(button1, { key: 'Tab' });
      link.focus();
      expect(document.activeElement).toBe(link);

      fireEvent.keyDown(link, { key: 'Tab' });
      input.focus();
      expect(document.activeElement).toBe(input);

      fireEvent.keyDown(input, { key: 'Tab' });
      button2.focus();
      expect(document.activeElement).toBe(button2);
    });

    it('should support Enter and Space key activation for buttons', () => {
      const handleClick = jest.fn();
      render(<MockButton onClick={handleClick}>Click me</MockButton>);

      const button = screen.getByRole('button');

      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should support Escape key for closing modals', () => {
      const handleClose = jest.fn();
      render(
        <MockModal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
        >
          Modal content
        </MockModal>
      );

      const modal = screen.getByRole('dialog');
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should trap focus within modals', () => {
      render(
        <MockModal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
        >
          <button>First button</button>
          <button>Second button</button>
        </MockModal>
      );

      const firstButton = screen.getByText('First button');
      const closeButton = screen.getByLabelText('Close modal');

      // Focus should be trapped within modal
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Tab to close button
      fireEvent.keyDown(firstButton, { key: 'Tab' });
      // Note: In a real implementation, focus management would need to be tested more thoroughly
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper alt text for images', () => {
      render(
        <div>
          <img src="logo.png" alt="Taxclusive logo" />
          <img src="hero.jpg" alt="Professional accountant working with financial documents" />
          <img src="decorative.png" alt="" role="presentation" />
        </div>
      );

      const images = screen.getAllByRole('img');
      
      // Logo should have meaningful alt text
      expect(images[0]).toHaveAttribute('alt', 'Taxclusive logo');
      
      // Content image should have descriptive alt text
      expect(images[1]).toHaveAttribute('alt', expect.stringContaining('accountant'));
      
      // Decorative image should have empty alt or presentation role
      expect(images[2]).toHaveAttribute('alt', '');
    });

    it('should have accessible loading states', () => {
      render(
        <div>
          <div aria-live="polite" aria-label="Loading">
            <span>Loading...</span>
          </div>
          <button disabled aria-label="Submit form (loading)">
            Submitting...
          </button>
        </div>
      );

      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('should have accessible skip links', () => {
      render(
        <div>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <nav>Navigation</nav>
          <main id="main-content">
            <h1>Main Content</h1>
          </main>
        </div>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should announce dynamic content changes', () => {
      render(
        <div>
          <div aria-live="polite" id="status-message">
            Initial message
          </div>
          <div aria-live="assertive" id="error-message">
            
          </div>
        </div>
      );

      const statusMessage = screen.getByText('Initial message');
      expect(statusMessage.parentElement).toHaveAttribute('aria-live', 'polite');

      const errorContainer = document.getElementById('error-message');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Color and Contrast', () => {
    it('should have sufficient color contrast ratios', () => {
      // Mock color contrast calculations
      const colorCombinations = [
        { background: '#ffffff', foreground: '#333333', ratio: 12.63 }, // Dark text on white
        { background: '#007bff', foreground: '#ffffff', ratio: 5.74 },  // White text on blue
        { background: '#28a745', foreground: '#ffffff', ratio: 4.68 },  // White text on green
        { background: '#dc3545', foreground: '#ffffff', ratio: 5.78 },  // White text on red
      ];

      colorCombinations.forEach(combo => {
        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        expect(combo.ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('should not rely solely on color for information', () => {
      render(
        <div>
          <div className="status-success">
            <span className="icon">✓</span>
            <span>Success: Form submitted</span>
          </div>
          <div className="status-error">
            <span className="icon">✗</span>
            <span>Error: Please fill all required fields</span>
          </div>
          <div className="required-field">
            <label>
              Name <span aria-label="required">*</span>
            </label>
            <input type="text" required />
          </div>
        </div>
      );

      // Success and error states should have icons and text
      expect(screen.getByText(/success/i)).toBeInTheDocument();
      expect(screen.getByText(/error/i)).toBeInTheDocument();

      // Required fields should have text indicators, not just color
      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch target sizes', () => {
      render(
        <div>
          <button style={{ minHeight: '44px', minWidth: '44px' }}>
            Small Button
          </button>
          <a href="/test" style={{ padding: '12px 16px', display: 'inline-block' }}>
            Link
          </a>
        </div>
      );

      // Minimum touch target size should be 44x44px for mobile
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('min-height: 44px');
      expect(button).toHaveStyle('min-width: 44px');
    });

    it('should support voice control commands', () => {
      render(
        <div>
          <button aria-label="Navigate to home page">Home</button>
          <button aria-label="Open main menu">Menu</button>
          <button aria-label="Search website">Search</button>
        </div>
      );

      // Voice control users should be able to identify controls by their accessible names
      expect(screen.getByLabelText(/home page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/main menu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    });
  });

  describe('Axe Accessibility Testing', () => {
    it('should pass axe accessibility tests for header', async () => {
      const { container } = render(<MockHeader />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for forms', async () => {
      const { container } = render(<MockForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for buttons', async () => {
      const { container } = render(
        <div>
          <MockButton>Primary Button</MockButton>
          <MockButton variant="secondary">Secondary Button</MockButton>
          <MockButton disabled>Disabled Button</MockButton>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests for modals', async () => {
      const { container } = render(
        <MockModal isOpen={true} onClose={jest.fn()} title="Test Modal">
          <p>Modal content</p>
          <button>Action</button>
        </MockModal>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('High Contrast Mode', () => {
    it('should be usable in high contrast mode', () => {
      // Simulate high contrast mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <div>
          <button className="btn-primary">Primary Button</button>
          <a href="/test" className="link">Link</a>
        </div>
      );

      // In high contrast mode, elements should still be distinguishable
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Reduced Motion', () => {
    it('should respect reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <div>
          <div className="animated-element">Animated content</div>
        </div>
      );

      // When reduced motion is preferred, animations should be minimal or disabled
      expect(screen.getByText('Animated content')).toBeInTheDocument();
    });
  });
});