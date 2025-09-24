# Testing Guide - Cylink

This document provides a comprehensive guide for running tests in the Cylink project.

## 🧪 Testing Stack

- **Jest + React Testing Library**: Unit and integration testing
- **Cypress**: End-to-end (E2E) testing
- **TypeScript**: Type-safe testing

## 📋 Prerequisites

Before running tests, ensure you have:

1. **Node.js** v18+ installed
2. **Development server** running on `http://localhost:3000`
3. **WSL/Linux environment** with X11 forwarding (for Cypress GUI)

## 🚀 Running Tests

### Unit & Integration Tests (Jest)

```bash
# Run all Jest tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Cypress)

#### Option 1: Cypress Test Runner (GUI) - Recommended for Development

```bash
# Start development server first
npm run dev

# In another terminal, open Cypress GUI
npm run cypress:open
```

#### Option 2: Headless Mode - For CI/CD

```bash
# Start development server first
npm run dev

# Run E2E tests headless
npm run test:e2e

# Run with virtual display (WSL/Linux)
npm run test:e2e:headless
```

#### Option 3: Specific Browser

```bash
# Run with Chrome
npm run cypress:run:chrome

# Run with Firefox
npm run cypress:run:firefox

# Run with Edge
npm run cypress:run:edge
```

### Run All Tests

```bash
# Run both Jest and Cypress tests
npm run test:all
```

## 📁 Test Structure

```
cypress/
├── e2e/                    # E2E tests
│   ├── auth.cy.ts         # Authentication flow
│   ├── url-management.cy.ts # URL creation/management
│   ├── dashboard.cy.ts    # Dashboard functionality
│   └── qr-code.cy.ts      # QR code generation
├── component/              # Component tests
│   └── Button.cy.tsx      # Button component tests
├── support/               # Support files
│   ├── e2e.ts            # E2E support
│   ├── component.ts      # Component support
│   └── commands.ts       # Custom commands
└── fixtures/             # Test data
    ├── users.json        # User test data
    └── urls.json         # URL test data

src/
├── components/
│   └── __tests__/        # Jest unit tests
│       └── Button.test.tsx
└── types/
    └── jest.d.ts         # Jest type definitions
```

## 🔧 Configuration Files

- **`jest.config.js`**: Jest configuration
- **`jest.setup.js`**: Jest setup and mocks
- **`cypress.config.ts`**: Cypress configuration
- **`tsconfig.json`**: TypeScript configuration

## 🎯 Test Categories

### Jest Tests (Unit & Integration)

- Component rendering
- User interactions
- Form validation
- Custom hooks
- Utility functions
- API service functions

### Cypress Tests (E2E)

- Complete user workflows
- Authentication flows
- URL management
- QR code generation
- Dashboard interactions
- Cross-browser compatibility

## 🐛 Troubleshooting

### WSL/Linux Issues

If you encounter issues running Cypress in WSL:

1. **Install X11 dependencies**:

   ```bash
   sudo apt-get update
   sudo apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3-dev libxss1 libasound2-dev libxtst6 xauth xvfb
   ```

2. **Use headless mode**:

   ```bash
   npm run test:e2e:headless
   ```

3. **Enable X11 forwarding** (if using WSL with GUI):
   ```bash
   export DISPLAY=:0
   npm run cypress:open
   ```

### Common Issues

1. **Port conflicts**: Ensure port 3000 is available
2. **Memory issues**: Increase Node.js memory limit
3. **Timeout errors**: Increase timeout values in config
4. **Type errors**: Ensure all dependencies are installed

## 📊 Coverage Reports

Jest coverage reports are generated in the `coverage/` directory:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🔄 Continuous Integration

For CI/CD pipelines, use:

```bash
# Install dependencies
npm ci

# Run all tests
npm run test:all

# Or run separately
npm test
npm run test:e2e:headless
```

## 📝 Writing Tests

### Jest Test Example

```typescript
import { render, screen } from '@testing-library/react'
import Button from '@/components/atoms/Button'

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })
})
```

### Cypress Test Example

```typescript
describe('Authentication Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

## 🎉 Best Practices

1. **Write tests first** (TDD approach)
2. **Use data-cy attributes** for reliable element selection
3. **Mock external dependencies** appropriately
4. **Keep tests independent** and isolated
5. **Use descriptive test names**
6. **Clean up after tests**
7. **Test both happy path and error cases**

## ⚠️ WSL-Specific Issues

### Cypress SIGILL Error

If you encounter `SIGILL` error when running Cypress in WSL:

**Problem**: Cypress may not work properly in WSL environment due to missing system dependencies.

**Solutions**:

1. **Focus on Jest testing** (Recommended for WSL):

   ```bash
   # Jest works reliably in WSL
   npm test
   npm run test:watch
   npm run test:coverage
   ```

2. **Run Cypress on Windows** or use GitHub Actions for E2E tests

3. **Install system dependencies** (if needed):

   ```bash
   sudo apt-get update
   sudo apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3-dev libxss1 libasound2-dev libxtst6 xauth xvfb
   ```

4. **Use alternative testing approach**:
   - Jest for unit and integration tests
   - Manual testing for E2E flows
   - Cypress E2E tests in CI/CD pipeline

### Recommended WSL Workflow

```bash
# 1. Run Jest tests (works perfectly in WSL)
npm test

# 2. Run Jest in watch mode for development
npm run test:watch

# 3. Generate coverage report
npm run test:coverage

# 4. For E2E testing, use manual testing or run on Windows
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [WSL Testing Guide](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting)
