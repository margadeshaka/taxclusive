# Comprehensive Testing Documentation

This document outlines the complete testing strategy and implementation for the Taxclusive Next.js application.

## Test Architecture Overview

The testing suite follows a comprehensive multi-layered approach covering:

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and data flow
- **End-to-End Tests**: Complete user journeys
- **Performance Tests**: Core Web Vitals and bundle analysis
- **Accessibility Tests**: WCAG compliance and screen reader support
- **Security Tests**: XSS, CSRF, and injection prevention
- **Visual Regression Tests**: UI consistency across changes

## Test Categories

### 1. Unit Tests (`__tests__/`)

**Location**: `__tests__/lib/`, `__tests__/components/`, `__tests__/hooks/`

**Coverage**:
- Utility functions (`lib/helpers/utils.ts`)
- API client (`lib/api-client.ts`)
- Custom hooks (`hooks/use-blogs.tsx`, etc.)
- UI components (`components/ui/`, `components/features/`)
- Form validation and sanitization

**Tools**: Jest, React Testing Library, MSW (Mock Service Worker)

**Run Commands**:
```bash
pnpm test                    # Run all unit tests
pnpm test:watch             # Watch mode for development
pnpm test:coverage          # Generate coverage report
```

### 2. Integration Tests (`__tests__/api/`)

**Location**: `__tests__/api/`

**Coverage**:
- Contact form API (`/api/contact`)
- Newsletter subscription (`/api/newsletter`) 
- Appointment booking (`/api/appointment`)
- Query submission (`/api/query`)
- Admin blog management (`/api/admin/blogs`)
- Admin testimonial management (`/api/admin/testimonials`)
- Admin user management (`/api/admin/users`)

**Features Tested**:
- Request validation
- Authentication & authorization
- Error handling
- Rate limiting
- CSRF protection
- Input sanitization

### 3. End-to-End Tests (`e2e/`)

**Location**: `e2e/`

**Coverage**:
- Complete user journeys from landing to conversion
- Admin authentication and CRUD operations
- Form submissions and validations
- Mobile responsive behavior
- Error handling scenarios
- Cross-browser compatibility

**Tools**: Playwright

**Key Test Files**:
- `comprehensive-user-journeys.spec.ts` - Complete visitor and admin flows
- `admin-auth.spec.ts` - Authentication flows
- `admin-blogs.spec.ts` - Blog management
- `forms.spec.ts` - All form interactions
- `navigation.spec.ts` - Site navigation
- `role-based-access.spec.ts` - Permission testing

**Run Commands**:
```bash
pnpm test:e2e              # Run all E2E tests
pnpm test:e2e:ui           # Run with Playwright UI
pnpm test:e2e:debug        # Debug mode
```

### 4. Performance Tests (`__tests__/performance/`)

**Location**: `__tests__/performance/`

**Coverage**:
- Bundle size analysis
- Core Web Vitals (LCP, FID, CLS, FCP, TTI)
- Image optimization
- API response times
- Memory management
- Database query performance

**Tools**: Jest, Lighthouse CI

**Metrics Monitored**:
- JavaScript bundle < 1.5MB total
- Individual route chunks < 150KB
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- API responses < 200ms

**Run Commands**:
```bash
pnpm test:performance      # Run performance tests
pnpm lighthouse            # Run Lighthouse CI
```

### 5. Accessibility Tests (`__tests__/accessibility/`)

**Location**: `__tests__/accessibility/`

**Coverage**:
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- Focus management
- ARIA attributes
- Semantic HTML structure

**Tools**: Jest, jest-axe, Playwright

**Features Tested**:
- Proper heading hierarchy
- Form labels and validation
- Alt text for images
- Keyboard accessibility
- Skip links
- Loading state announcements
- Modal focus trapping

**Run Commands**:
```bash
pnpm test:accessibility    # Run accessibility tests
```

### 6. Security Tests (`__tests__/security/`)

**Location**: `__tests__/security/`

**Coverage**:
- XSS prevention
- CSRF protection
- SQL/NoSQL injection prevention
- Input sanitization
- Authentication security
- Session management
- API security
- File upload validation

**Tools**: Jest

**Attack Vectors Tested**:
- Script injection attempts
- HTML injection
- SQL injection patterns
- NoSQL injection
- Path traversal
- CSRF token validation
- Rate limiting bypass attempts

**Run Commands**:
```bash
pnpm test:security         # Run security tests
```

## Test Data Management

### Mock Service Worker (MSW)

**Location**: `__tests__/mocks/`

**Files**:
- `handlers.ts` - API endpoint mocks
- `server.ts` - MSW server setup

**Coverage**:
- All public API endpoints
- Admin API endpoints with authentication
- Error scenarios (500, timeout, network errors)
- Rate limiting simulation

### Test Factories

**Location**: `__tests__/fixtures/test-factories.ts`

**Features**:
- Realistic test data generation using Faker.js
- Consistent data structures
- Batch creation functions
- Predefined test scenarios
- API response factories

**Available Factories**:
```typescript
createMockBlog()           // Generate blog post data
createMockTestimonial()    // Generate testimonial data
createMockUser()           // Generate user data
createMockContactForm()    // Generate form data
createApiResponse()        // Generate API responses
createPaginatedResponse()  // Generate paginated data
```

### Test Data Seeds

**Location**: `e2e/fixtures/test-data.ts`

**Contains**:
- Admin and editor user credentials
- Sample blog posts and testimonials
- Form submission data
- API endpoint test data

## Configuration Files

### Jest Configuration (`jest.config.js`)

**Features**:
- Coverage thresholds (70% minimum)
- Path aliases (@/* mappings)
- Setup files for mocks and globals
- Coverage reporting (text, lcov, html)
- Test environment setup

### Playwright Configuration (`playwright.config.ts`)

**Features**:
- Multi-browser testing (Chrome, Firefox, Safari, Mobile)
- Sequential execution for database consistency
- Screenshot and video capture on failures
- Trace collection for debugging
- Base URL and timeout configurations

### Lighthouse Configuration (`lighthouserc.js`)

**Features**:
- Performance budget enforcement
- Core Web Vitals monitoring
- Accessibility scoring
- SEO validation
- Security best practices

## CI/CD Integration

### GitHub Actions (`.github/workflows/test.yml`)

**Jobs**:
1. **Unit Tests**: Matrix testing across Node.js versions
2. **E2E Tests**: Full application testing with database
3. **Security Audit**: Dependency vulnerability scanning
4. **Performance Tests**: Lighthouse CI integration
5. **Accessibility Tests**: Automated a11y testing
6. **Bundle Analysis**: Build size monitoring

**Features**:
- PostgreSQL service containers
- Artifact uploads for failed tests
- Coverage reporting to Codecov
- Performance regression detection
- Security vulnerability alerts

## Coverage Requirements

### Current Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Exclusions
- Layout and loading components
- Configuration files
- Development utilities
- Test files themselves

## Running Tests

### Development Workflow

1. **Start with unit tests**:
   ```bash
   pnpm test:watch
   ```

2. **Run integration tests**:
   ```bash
   pnpm test -- api
   ```

3. **Execute E2E tests**:
   ```bash
   pnpm test:e2e
   ```

4. **Full test suite**:
   ```bash
   pnpm test:all
   ```

### Pre-commit Testing

Tests are automatically run via Husky pre-commit hooks:
- Linting and formatting
- Unit test execution
- Type checking

### Production Testing

Before deployment:
```bash
pnpm build                 # Ensure build succeeds
pnpm test:coverage         # Verify coverage
pnpm test:e2e             # Full E2E validation
pnpm lighthouse           # Performance audit
```

## Debugging Tests

### Unit Test Debugging

1. Use `test.only()` to focus on specific tests
2. Add `console.log()` statements for debugging
3. Use Jest's `--verbose` flag for detailed output
4. Check mock implementations in `__tests__/mocks/`

### E2E Test Debugging

1. Use Playwright UI mode:
   ```bash
   pnpm test:e2e:ui
   ```

2. Debug mode with breakpoints:
   ```bash
   pnpm test:e2e:debug
   ```

3. Check test artifacts in `test-results/`
4. Review videos and screenshots for failed tests

### Performance Debugging

1. Analyze Lighthouse reports
2. Check bundle analysis output
3. Monitor Core Web Vitals in development
4. Use browser DevTools for profiling

## Best Practices

### Test Writing Guidelines

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Write Descriptive Test Names**: Explain what is being tested
3. **Test Behavior, Not Implementation**: Focus on user outcomes
4. **Use Realistic Test Data**: Leverage test factories
5. **Mock External Dependencies**: Keep tests isolated
6. **Test Error Scenarios**: Don't just test happy paths

### Maintenance Guidelines

1. **Keep Tests Updated**: Sync with feature changes
2. **Review Test Coverage**: Maintain quality metrics
3. **Optimize Slow Tests**: Ensure fast feedback loops
4. **Clean Up Test Data**: Prevent test pollution
5. **Document Complex Tests**: Add comments for clarity

### Performance Considerations

1. **Parallel Execution**: Use Jest's parallel capabilities
2. **Mock Heavy Operations**: Avoid real API calls in unit tests
3. **Selective Testing**: Use test patterns for targeted runs
4. **Resource Cleanup**: Properly tear down test environments

## Continuous Improvement

### Metrics Tracking
- Test execution time
- Coverage trends
- Flaky test identification
- Performance regression detection

### Regular Reviews
- Monthly test suite performance review
- Quarterly coverage and quality assessment
- Annual testing strategy evaluation
- Continuous tool and framework updates

## Troubleshooting

### Common Issues

1. **Tests Failing in CI but Passing Locally**:
   - Check environment variables
   - Verify database state
   - Review timing issues

2. **Flaky E2E Tests**:
   - Add proper wait conditions
   - Use data-testid attributes
   - Implement retry mechanisms

3. **Coverage Not Meeting Thresholds**:
   - Identify uncovered code paths
   - Add missing test cases
   - Review exclusion patterns

4. **Performance Test Failures**:
   - Check bundle size changes
   - Review image optimization
   - Analyze third-party dependencies

### Support Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [MSW Documentation](https://mswjs.io/)

---

This comprehensive testing setup ensures high-quality, reliable, and performant code delivery for the Taxclusive application.