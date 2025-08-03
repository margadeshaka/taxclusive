import { 
  formatDate, 
  slugify, 
  truncateText, 
  validateEmail, 
  validatePhone,
  capitalizeWords,
  generateRandomString,
  debounce,
  throttle,
  deepClone,
  formatFileSize,
  isEmpty
} from '@/lib/helpers/utils';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date)).toMatch(/December 25, 2023/);
    });

    it('handles invalid dates', () => {
      expect(() => formatDate(new Date('invalid'))).not.toThrow();
    });

    it('formats with custom format', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2023-12-25');
    });
  });

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Tax & Financial Services')).toBe('tax-financial-services');
      expect(slugify('GST/VAT Registration')).toBe('gst-vat-registration');
    });

    it('handles special characters', () => {
      expect(slugify('C++ Programming')).toBe('c-programming');
      expect(slugify('50% Discount!')).toBe('50-discount');
      expect(slugify('Test@123#')).toBe('test-123');
    });

    it('handles empty strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
    });

    it('removes multiple consecutive dashes', () => {
      expect(slugify('Hello --- World')).toBe('hello-world');
      expect(slugify('Test  -  -  Test')).toBe('test-test');
    });
  });

  describe('truncateText', () => {
    const longText = 'This is a very long text that needs to be truncated for display purposes.';

    it('truncates text to specified length', () => {
      const result = truncateText(longText, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 50)).toBe(shortText);
    });

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('handles custom suffix', () => {
      const result = truncateText(longText, 20, '...');
      expect(result).toContain('...');
    });

    it('truncates at word boundaries', () => {
      const result = truncateText(longText, 20, '...', true);
      expect(result).not.toMatch(/\w\.\.\.$/); // Should not end with partial word
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('firstname+lastname@company.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test..test@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(validateEmail('a@b.co')).toBe(true);
      expect(validateEmail('test@domain')).toBe(false);
      expect(validateEmail('test@domain.')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcd')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('123-456-78901234567890')).toBe(false);
    });

    it('handles international formats', () => {
      expect(validatePhone('+44 20 1234 5678')).toBe(true);
      expect(validatePhone('+91 98765 43210')).toBe(true);
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('tax and financial services')).toBe('Tax And Financial Services');
      expect(capitalizeWords('UPPERCASE TEXT')).toBe('Uppercase Text');
    });

    it('handles single words', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
      expect(capitalizeWords('HELLO')).toBe('Hello');
    });

    it('handles empty strings', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('generateRandomString', () => {
    it('generates string of specified length', () => {
      expect(generateRandomString(10)).toHaveLength(10);
      expect(generateRandomString(5)).toHaveLength(5);
    });

    it('generates different strings each time', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).not.toBe(str2);
    });

    it('generates string with default length', () => {
      expect(generateRandomString()).toHaveLength(8);
    });

    it('only contains valid characters', () => {
      const str = generateRandomString(100);
      const validChars = /^[A-Za-z0-9]+$/;
      expect(validChars.test(str)).toBe(true);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous call when called again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('limits function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('deepClone', () => {
    it('clones primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('clones arrays', () => {
      const original = [1, 2, 3, [4, 5]];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[3]).not.toBe(original[3]);
    });

    it('clones objects', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('clones dates', () => {
      const original = new Date('2023-01-01');
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
    });

    it('handles large values', () => {
      expect(formatFileSize(1099511627776)).toBe('1 TB');
    });
  });

  describe('isEmpty', () => {
    it('identifies empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('identifies non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });
});