# Project Structure and Testing Documentation

## Project Configuration Files

### astro.config.mjs
- **Purpose**: Configures Astro framework settings
- **Key Features**:
  - Server-side rendering (SSR) configuration
  - Integration with React and Tailwind
  - Node.js adapter configuration
  - Build timestamp injection
  - Documentation copying to output directory

### jest.config.js
- **Purpose**: Jest testing framework configuration
- **Key Features**:
  - TypeScript support with ts-jest
  - ESM module support
  - React JSX support
  - Test environment configuration
  - Coverage reporting setup

### jest.setup.js & jest.setup.ts
- **Purpose**: Test environment initialization
- **Features**:
  - Jest DOM extensions
  - Global fetch mocking
  - Console error handling
  - Test environment customization

### tailwind.config.mjs
- **Purpose**: Tailwind CSS configuration
- **Key Features**:
  - Custom color scheme
  - Font configuration
  - Plugin integration (forms, typography)
  - Content paths for purging

### tsconfig.json
- **Purpose**: TypeScript configuration
- **Key Features**:
  - React JSX support
  - Module resolution settings
  - Strict type checking
  - Path aliases
  - Test type definitions

## Testing System

### Test Directory Structure
```
tests/
├── api/              # API endpoint tests
│   ├── auth.test.ts
│   ├── news.test.ts
│   ├── matches.test.ts
│   └── ...
├── a11y/             # Accessibility tests
│   └── index.test.ts
├── journeys/         # User journey tests
│   ├── admin.test.ts
│   ├── index.test.ts
│   └── personas.ts
├── setup.ts          # Test configuration
└── helpers.ts        # Test utilities
```

### API Tests
- Located in `tests/api/`
- Test all API endpoints
- Use Prisma mocking
- Cover CRUD operations
- Validate responses
- Test error handling

Example API test:
```typescript
describe('News API', () => {
  test('should create news', async () => {
    const news = await createNews({
      title: 'Test',
      content: 'Content'
    });
    expect(news).toHaveProperty('id');
  });
});
```

### Accessibility Tests
- Located in `tests/a11y/`
- Use axe-core for testing
- Check WCAG compliance
- Test all public pages
- Validate user interactions

Example accessibility test:
```typescript
test('pages should be accessible', async () => {
  const results = await runAccessibilityTest('/');
  expect(results.violations).toEqual([]);
});
```

### User Journey Tests
- Located in `tests/journeys/`
- Test complete user flows
- Use Puppeteer for browser automation
- Cover critical paths
- Test different user personas

Example journey test:
```typescript
test('admin can create news', async () => {
  await loginAsAdmin();
  await createNewsArticle();
  expect(page.url()).toContain('/admin/news');
});
```

### Test Setup
- Located in `tests/setup.ts`
- Configures test environment
- Sets up mocks
- Initializes test database
- Configures test utilities

Example setup:
```typescript
beforeEach(() => {
  mockReset(prismaMock);
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## Running Tests

### Command Overview
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:api      # API tests only
npm run test:a11y     # Accessibility tests
npm run test:watch    # Watch mode

# Generate coverage report
npm run test -- --coverage
```

### Test Coverage Requirements
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Best Practices

### Writing Tests
1. Follow AAA pattern (Arrange, Act, Assert)
2. Use descriptive test names
3. Test edge cases
4. Mock external dependencies
5. Clean up after tests

### API Testing
1. Test success cases
2. Test error cases
3. Validate responses
4. Check authentication
5. Test rate limiting

### Accessibility Testing
1. Test keyboard navigation
2. Check ARIA attributes
3. Validate color contrast
4. Test screen reader support
5. Check focus management

### User Journey Testing
1. Test critical paths
2. Validate user flows
3. Check error handling
4. Test responsive design
5. Validate form submissions

## Continuous Integration

The testing system integrates with CI/CD:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Extending the Test Suite

### Adding New Tests
1. Create test file in appropriate directory
2. Import required utilities
3. Write test cases
4. Add to test suite
5. Update documentation

### Creating Test Utilities
1. Add to `tests/helpers.ts`
2. Write reusable functions
3. Add TypeScript types
4. Document usage
5. Add examples

### Modifying Test Configuration
1. Update `jest.config.js`
2. Modify `jest.setup.ts`
3. Update test commands
4. Document changes
5. Update CI configuration