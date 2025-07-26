# Testing Guidelines for TaxExclusive Project

This document provides guidelines and best practices for testing in the TaxExclusive project.

## Testing Setup

The project uses the following testing tools:

- **Jest**: The testing framework
- **React Testing Library**: For testing React components
- **jest-environment-jsdom**: For simulating a DOM environment in tests

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
pnpm test

# Run tests in watch mode (useful during development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Test Coverage

We aim for high test coverage, but focus on testing critical paths and business logic rather than chasing 100% coverage. The coverage report can be generated using:

```bash
pnpm test:coverage
```

This will create a coverage report in the `coverage` directory, which you can view by opening `coverage/lcov-report/index.html` in your browser.

## Test File Organization

- Test files should be placed in the `__tests__` directory at the root of the project
- Test files should be named after the component or module they test, with a `.test.tsx` or `.test.ts` extension
- For complex components, consider creating a subdirectory in `__tests__` to organize related tests

## Testing Approaches

### Component Testing

When testing React components, follow these guidelines:

1. **Focus on behavior, not implementation details**:
   - Test what the component does, not how it's implemented
   - Avoid testing component state directly
   - Use user-centric queries (getByRole, getByText) instead of test IDs when possible

2. **Test from the user's perspective**:
   - Test interactions as a user would perform them
   - Use `fireEvent` or `userEvent` to simulate user interactions

3. **Mock external dependencies**:
   - Mock API calls, context providers, and other external dependencies
   - Use Jest's mocking capabilities to isolate the component being tested

Example component test:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "@/components/my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("responds to user interaction", () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(screen.getByText("Button Clicked")).toBeInTheDocument();
  });
});
```

### Snapshot Testing

Snapshot testing is useful for detecting unexpected changes in component rendering:

```tsx
import renderer from "react-test-renderer";
import MyComponent from "@/components/my-component";

it("matches snapshot", () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

When a snapshot test fails, carefully review the changes to determine if they are expected or not. If the changes are expected, update the snapshot with:

```bash
pnpm test -- -u
```

### API and Utility Function Testing

When testing API calls and utility functions:

1. **Mock external dependencies**:
   - Mock fetch or axios for API calls
   - Provide mock implementations that return predictable data

2. **Test success and error cases**:
   - Test both successful responses and error handling
   - Verify that errors are properly caught and handled

3. **Verify correct parameters**:
   - Check that the correct URLs, headers, and body are used in API calls

Example API test:

```tsx
import { fetchData } from "@/lib/api";

// Mock fetch
global.fetch = jest.fn();

describe("fetchData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches data successfully", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test data" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchData();

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/data"));
    expect(result).toEqual({ data: "test data" });
  });

  it("handles errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    await expect(fetchData()).rejects.toThrow("Network error");
  });
});
```

## Mocking

### Mocking Next.js Components and Hooks

When testing components that use Next.js features:

```tsx
// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: "/",
  }),
  usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

### Mocking Context Providers

When testing components that use React Context:

```tsx
// Create a wrapper with the context provider
const wrapper = ({ children }) => (
  <MyContext.Provider value={mockContextValue}>{children}</MyContext.Provider>
);

// Use the wrapper in tests
render(<MyComponent />, { wrapper });
```

## Best Practices

1. **Keep tests simple and focused**:
   - Each test should verify one specific behavior
   - Avoid testing multiple behaviors in a single test

2. **Use descriptive test names**:
   - Test names should describe what is being tested
   - Use the pattern "it should..." or "it does..." for test names

3. **Arrange, Act, Assert**:
   - Arrange: Set up the test environment
   - Act: Perform the action being tested
   - Assert: Verify the expected outcome

4. **Clean up after tests**:
   - Reset mocks and clean up side effects in beforeEach/afterEach
   - Ensure tests don't affect each other

5. **Test edge cases**:
   - Test boundary conditions
   - Test error handling
   - Test with empty or invalid inputs

## Continuous Integration

Tests are automatically run in the CI pipeline on every pull request. Pull requests with failing tests cannot be merged.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
