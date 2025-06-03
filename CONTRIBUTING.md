# Contributing to TaxExclusive

Thank you for your interest in contributing to TaxExclusive! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)
10. [Feature Requests](#feature-requests)

## Code of Conduct

We expect all contributors to follow our Code of Conduct. Please be respectful and considerate of others when contributing to this project.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm package manager

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/taxexclusive.git
   cd taxexclusive
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream git@github.com:margadeshaka/taxexclusive.git
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes in your feature branch
2. Run tests to ensure your changes don't break existing functionality:
   ```bash
   pnpm test
   ```
3. Run the linter to ensure your code follows our coding standards:
   ```bash
   pnpm lint
   ```
4. Commit your changes following our [commit guidelines](#commit-guidelines)
5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a pull request from your fork to the original repository

## Coding Standards

We follow a set of coding standards to ensure consistency across the codebase:

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces for all data structures
- Use type annotations for function parameters and return types
- Avoid using `any` type when possible

### React

- Use functional components with hooks
- Use named exports for components
- Define prop types using TypeScript interfaces
- Use React.memo for performance optimization when appropriate

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the project's design tokens and color scheme
- Use responsive design principles

### File Structure

- Place components in the appropriate directory based on their purpose
- Follow the established naming conventions for files and directories
- Keep files focused on a single responsibility

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:

- `feat(blog): add pagination to blog list`
- `fix(auth): resolve login redirect issue`
- `docs(api): update API documentation`

## Pull Request Process

1. Ensure your code follows our coding standards
2. Update documentation if necessary
3. Include tests for new features or bug fixes
4. Ensure all tests pass
5. Update the README.md or other documentation if necessary
6. The pull request will be reviewed by at least one maintainer
7. Address any feedback from the review
8. Once approved, your pull request will be merged

## Testing

We use Jest and React Testing Library for testing. Please follow these guidelines for testing:

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Use React Testing Library's user-centric testing approach
- Focus on testing behavior, not implementation details
- Aim for high test coverage, but prioritize meaningful tests over coverage percentage

## Documentation

Good documentation is essential for the project's maintainability:

- Update the README.md when adding new features or changing existing ones
- Add JSDoc comments to all functions, components, and complex code
- Document props for all components
- Update API documentation when changing API endpoints
- Create or update user documentation for user-facing changes

## Issue Reporting

When reporting issues, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or code snippets if applicable
6. Environment information (browser, OS, etc.)

## Feature Requests

When requesting new features, please include:

1. A clear and descriptive title
2. A detailed description of the feature
3. The problem the feature would solve
4. Any alternatives you've considered
5. Any additional context or screenshots

Thank you for contributing to TaxExclusive!
