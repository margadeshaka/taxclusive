import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(button).toHaveClass('border');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(button).toHaveClass('hover:bg-accent');

    rerender(<Button variant="link">Link</Button>);
    expect(button).toHaveClass('underline-offset-4');
  });

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    expect(button).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(button).toHaveClass('h-11');

    rerender(<Button size="icon">Icon</Button>);
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });

  it('renders as a link when asChild is used with Link', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('custom-class');
  });

  it('passes through HTML button attributes', () => {
    render(
      <Button type="submit" data-testid="submit-button">
        Submit
      </Button>
    );
    
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('handles keyboard events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    
    // Button should be focusable
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('has proper accessibility attributes', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('matches snapshot for each variant', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>Test</Button>);
      expect(container.firstChild).toMatchSnapshot(`button-${variant}`);
    });
  });

  it('matches snapshot for each size', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    sizes.forEach(size => {
      const { container } = render(<Button size={size}>Test</Button>);
      expect(container.firstChild).toMatchSnapshot(`button-${size}`);
    });
  });
});