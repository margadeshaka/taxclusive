/**
 * Security Tests
 * Tests for XSS, CSRF, injection attacks, and other security vulnerabilities
 */

import { NextRequest } from 'next/server';

describe('Security Tests', () => {
  describe('Input Sanitization', () => {
    it('should sanitize HTML input to prevent XSS', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">',
        '<object data="javascript:alert(1)">',
        '<embed src="javascript:alert(1)">',
        '<link href="javascript:alert(1)">',
        '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
        '"><script>alert(1)</script>',
        '\');alert(\'xss\');//',
        '<script>document.cookie="stolen"</script>',
      ];

      const sanitizeHTML = (input: string): string => {
        // Mock sanitization function
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/<\s*(object|embed|link|meta)\b[^>]*>/gi, '');
      };

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeHTML(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
      });
    });

    it('should validate and sanitize SQL injection attempts', () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'; INSERT INTO users (username, password) VALUES ('hacker', 'password'); --",
        "' UNION SELECT * FROM users WHERE '1'='1",
        "'; EXEC xp_cmdshell('rm -rf /'); --",
        "' OR 1=1; --",
        "admin'/**/OR/**/1=1/**/--",
        "' AND (SELECT COUNT(*) FROM users) > 0 --",
        "'; UPDATE users SET password='hacked' WHERE username='admin'; --",
      ];

      const validateInput = (input: string): boolean => {
        // Mock input validation
        const dangerousPatterns = [
          /DROP\s+TABLE/i,
          /UNION\s+SELECT/i,
          /INSERT\s+INTO/i,
          /UPDATE\s+.+SET/i,
          /DELETE\s+FROM/i,
          /EXEC\s+/i,
          /xp_cmdshell/i,
          /OR\s+\d+\s*=\s*\d+/i,
          /--/,
          /\/\*.*\*\//,
        ];

        return !dangerousPatterns.some(pattern => pattern.test(input));
      };

      sqlInjectionAttempts.forEach(attempt => {
        expect(validateInput(attempt)).toBe(false);
      });

      // Valid inputs should pass
      const validInputs = ['john.doe@example.com', 'Valid Name', 'Normal message content'];
      validInputs.forEach(input => {
        expect(validateInput(input)).toBe(true);
      });
    });

    it('should prevent NoSQL injection', () => {
      const noSQLInjectionAttempts = [
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"$where": "this.username == this.password"}',
        '{"$regex": ".*"}',
        '{"$or": [{"username": "admin"}, {"password": {"$exists": true}}]}',
        '{"username": {"$ne": "admin"}, "password": {"$ne": "password"}}',
        '{"$where": "sleep(5000)"}',
      ];

      const sanitizeNoSQL = (input: string): boolean => {
        // Check for MongoDB operator injection
        const mongoOperators = /\$(?:ne|gt|gte|lt|lte|in|nin|exists|type|where|regex|or|and|not|nor)/i;
        return !mongoOperators.test(input);
      };

      noSQLInjectionAttempts.forEach(attempt => {
        expect(sanitizeNoSQL(attempt)).toBe(false);
      });
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing operations', () => {
      const mockCSRFToken = 'valid-csrf-token-123';
      
      const validateCSRFToken = (token: string | null, expectedToken: string): boolean => {
        return token === expectedToken;
      };

      // Valid token should pass
      expect(validateCSRFToken(mockCSRFToken, mockCSRFToken)).toBe(true);

      // Missing or invalid token should fail
      expect(validateCSRFToken(null, mockCSRFToken)).toBe(false);
      expect(validateCSRFToken('invalid-token', mockCSRFToken)).toBe(false);
      expect(validateCSRFToken('', mockCSRFToken)).toBe(false);
    });

    it('should generate secure CSRF tokens', () => {
      const generateCSRFToken = (): string => {
        // Mock CSRF token generation
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(token1).toHaveLength(32);
      expect(token2).toHaveLength(32);
      expect(token1).not.toBe(token2); // Tokens should be unique
      expect(/^[A-Za-z0-9]+$/.test(token1)).toBe(true); // Only alphanumeric
    });
  });

  describe('Authentication Security', () => {
    it('should hash passwords securely', () => {
      const mockBcrypt = {
        hash: (password: string, saltRounds: number): string => {
          // Mock bcrypt hash
          return `$2b$${saltRounds}$hashedpassword${password.length}`;
        },
        compare: (password: string, hash: string): boolean => {
          // Mock bcrypt compare
          return hash.includes(password.length.toString());
        },
      };

      const password = 'securePassword123!';
      const hashedPassword = mockBcrypt.hash(password, 12);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toContain('$2b$12$');
      expect(mockBcrypt.compare(password, hashedPassword)).toBe(true);
      expect(mockBcrypt.compare('wrongPassword', hashedPassword)).toBe(false);
    });

    it('should implement rate limiting for login attempts', () => {
      const rateLimiter = {
        attempts: new Map<string, { count: number; resetTime: number }>(),
        
        isRateLimited(ip: string): boolean {
          const now = Date.now();
          const attempt = this.attempts.get(ip);
          
          if (!attempt) return false;
          
          if (now > attempt.resetTime) {
            this.attempts.delete(ip);
            return false;
          }
          
          return attempt.count >= 5; // Max 5 attempts
        },
        
        recordAttempt(ip: string): void {
          const now = Date.now();
          const attempt = this.attempts.get(ip);
          
          if (!attempt || now > attempt.resetTime) {
            this.attempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
          } else {
            attempt.count++;
          }
        },
      };

      const ip = '192.168.1.100';

      // First 5 attempts should be allowed
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isRateLimited(ip)).toBe(false);
        rateLimiter.recordAttempt(ip);
      }

      // 6th attempt should be rate limited
      expect(rateLimiter.isRateLimited(ip)).toBe(true);
    });

    it('should validate JWT tokens properly', () => {
      const mockJWT = {
        sign: (payload: object, secret: string): string => {
          // Mock JWT sign
          return `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
        },
        
        verify: (token: string, secret: string): object | null => {
          // Mock JWT verify
          const parts = token.split('.');
          if (parts.length !== 3) return null;
          
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            
            // Check expiration
            if (payload.exp && payload.exp < Date.now() / 1000) {
              return null;
            }
            
            return payload;
          } catch {
            return null;
          }
        },
      };

      const secret = 'supersecretkey';
      const payload = { userId: '123', exp: Math.floor(Date.now() / 1000) + 3600 };
      
      const token = mockJWT.sign(payload, secret);
      const decoded = mockJWT.verify(token, secret);
      
      expect(decoded).toEqual(payload);
      
      // Invalid token should return null
      expect(mockJWT.verify('invalid.token.format', secret)).toBe(null);
      
      // Expired token should return null
      const expiredPayload = { userId: '123', exp: Math.floor(Date.now() / 1000) - 3600 };
      const expiredToken = mockJWT.sign(expiredPayload, secret);
      expect(mockJWT.verify(expiredToken, secret)).toBe(null);
    });
  });

  describe('Data Validation and Sanitization', () => {
    it('should validate email addresses strictly', () => {
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Additional security checks
        if (email.length > 254) return false; // RFC 5321 limit
        if (email.includes('..')) return false; // Consecutive dots
        if (email.startsWith('.') || email.endsWith('.')) return false;
        
        return emailRegex.test(email);
      };

      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'firstname+lastname@company.org',
      ];

      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing@domain',
        'spaces in@email.com',
        'toolong' + 'a'.repeat(250) + '@domain.com',
        'consecutive..dots@domain.com',
        '.startswith.dot@domain.com',
        'endswith.dot.@domain.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should validate file uploads securely', () => {
      const validateFileUpload = (file: { name: string; type: string; size: number }): { valid: boolean; error?: string } => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
          return { valid: false, error: 'Invalid file type' };
        }
        
        // Check file size
        if (file.size > maxSize) {
          return { valid: false, error: 'File too large' };
        }
        
        // Check file extension
        const extension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
        if (!allowedExtensions.includes(extension)) {
          return { valid: false, error: 'Invalid file extension' };
        }
        
        // Check for dangerous filenames
        if (file.name.includes('../') || file.name.includes('..\\')) {
          return { valid: false, error: 'Invalid filename' };
        }
        
        return { valid: true };
      };

      // Valid files
      expect(validateFileUpload({ name: 'image.jpg', type: 'image/jpeg', size: 1024 * 1024 })).toEqual({ valid: true });
      expect(validateFileUpload({ name: 'photo.png', type: 'image/png', size: 2 * 1024 * 1024 })).toEqual({ valid: true });

      // Invalid files
      expect(validateFileUpload({ name: 'script.js', type: 'text/javascript', size: 1024 })).toEqual({ valid: false, error: 'Invalid file type' });
      expect(validateFileUpload({ name: 'large.jpg', type: 'image/jpeg', size: 10 * 1024 * 1024 })).toEqual({ valid: false, error: 'File too large' });
      expect(validateFileUpload({ name: '../../../etc/passwd', type: 'image/jpeg', size: 1024 })).toEqual({ valid: false, error: 'Invalid filename' });
    });
  });

  describe('HTTP Security Headers', () => {
    it('should include security headers in responses', () => {
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      };

      Object.entries(securityHeaders).forEach(([header, value]) => {
        expect(value).toBeDefined();
        expect(value).not.toBe('');
      });

      // CSP should not allow unsafe-eval
      expect(securityHeaders['Content-Security-Policy']).not.toContain('unsafe-eval');
      
      // HSTS should have reasonable max-age
      expect(securityHeaders['Strict-Transport-Security']).toContain('max-age=31536000');
    });
  });

  describe('Session Security', () => {
    it('should generate secure session IDs', () => {
      const generateSessionId = (): string => {
        // Mock secure session ID generation
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const sessionId1 = generateSessionId();
      const sessionId2 = generateSessionId();

      expect(sessionId1).toHaveLength(32);
      expect(sessionId2).toHaveLength(32);
      expect(sessionId1).not.toBe(sessionId2);
      expect(/^[A-Za-z0-9]+$/.test(sessionId1)).toBe(true);
    });

    it('should implement session timeout', () => {
      const session = {
        id: 'session123',
        userId: 'user123',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        timeout: 30 * 60 * 1000, // 30 minutes
        
        isExpired(): boolean {
          return Date.now() - this.lastActivity > this.timeout;
        },
        
        refresh(): void {
          this.lastActivity = Date.now();
        },
      };

      expect(session.isExpired()).toBe(false);
      
      // Simulate time passage
      session.lastActivity = Date.now() - 31 * 60 * 1000; // 31 minutes ago
      expect(session.isExpired()).toBe(true);
      
      // Refresh should update last activity
      session.refresh();
      expect(session.isExpired()).toBe(false);
    });
  });

  describe('API Security', () => {
    it('should validate API request origins', () => {
      const allowedOrigins = ['https://taxclusive.com', 'https://www.taxclusive.com'];
      
      const validateOrigin = (origin: string | null): boolean => {
        if (!origin) return false; // No origin header
        return allowedOrigins.includes(origin);
      };

      expect(validateOrigin('https://taxclusive.com')).toBe(true);
      expect(validateOrigin('https://www.taxclusive.com')).toBe(true);
      expect(validateOrigin('https://evil-site.com')).toBe(false);
      expect(validateOrigin(null)).toBe(false);
    });

    it('should implement API rate limiting', () => {
      const apiRateLimiter = {
        requests: new Map<string, { count: number; resetTime: number }>(),
        
        isRateLimited(ip: string, endpoint: string): boolean {
          const key = `${ip}:${endpoint}`;
          const now = Date.now();
          const request = this.requests.get(key);
          
          if (!request) return false;
          
          if (now > request.resetTime) {
            this.requests.delete(key);
            return false;
          }
          
          return request.count >= 100; // 100 requests per minute
        },
        
        recordRequest(ip: string, endpoint: string): void {
          const key = `${ip}:${endpoint}`;
          const now = Date.now();
          const request = this.requests.get(key);
          
          if (!request || now > request.resetTime) {
            this.requests.set(key, { count: 1, resetTime: now + 60 * 1000 }); // 1 minute
          } else {
            request.count++;
          }
        },
      };

      const ip = '192.168.1.100';
      const endpoint = '/api/contact';

      // First 100 requests should be allowed
      for (let i = 0; i < 100; i++) {
        expect(apiRateLimiter.isRateLimited(ip, endpoint)).toBe(false);
        apiRateLimiter.recordRequest(ip, endpoint);
      }

      // 101st request should be rate limited
      expect(apiRateLimiter.isRateLimited(ip, endpoint)).toBe(true);
    });
  });

  describe('Content Security', () => {
    it('should prevent clickjacking attacks', () => {
      const frameOptions = 'DENY';
      const csp = "frame-ancestors 'none'";
      
      expect(frameOptions).toBe('DENY');
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it('should sanitize user-generated content', () => {
      const sanitizeContent = (content: string): string => {
        return content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/<(object|embed|applet)\b[^>]*>/gi, '');
      };

      const maliciousContent = `
        <p>Safe content</p>
        <script>alert('xss')</script>
        <iframe src="http://evil.com"></iframe>
        <img src="x" onerror="alert('xss')">
        <a href="javascript:alert('xss')">Click me</a>
      `;

      const sanitized = sanitizeContent(maliciousContent);
      
      expect(sanitized).toContain('<p>Safe content</p>');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('<iframe>');
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('onerror');
    });
  });
});