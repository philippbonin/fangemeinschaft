# Testing Documentation

## Overview

The testing suite uses Jest and Prisma mocking for comprehensive testing coverage.

## Test Structure

```
tests/
├── api/              # API endpoint tests
├── a11y/             # Accessibility tests
├── journeys/         # User journey tests
├── setup.ts          # Test setup and mocking
└── helpers.ts        # Test helper functions
```

## Configuration

### Jest Configuration
```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/dist/'
  ]
};
```

### Test Setup
```typescript
// tests/setup.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

jest.mock('../src/lib/prisma', () => ({
  prisma: prismaMock
}));
```

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:api
npm run test:a11y

# Watch mode
npm run test:watch
```

## Test Types

### 1. API Tests

Test all API endpoints using mocked Prisma client:

```typescript
import { prismaMock } from '../setup';

describe('News API', () => {
  const testNews = {
    id: '1',
    title: 'Test News',
    content: 'Test Content',
    image: 'test.jpg',
    category: 'Test',
    date: new Date()
  };

  test('should create news', async () => {
    prismaMock.news.create.mockResolvedValue(testNews);
    const news = await createNews(testNews);
    expect(news).toEqual(testNews);
  });
});
```

### 2. Accessibility Tests

Test accessibility compliance:

```typescript
test('pages should be accessible', async () => {
  await page.goto('/');
  await page.addScriptTag({ path: require.resolve('axe-core') });
  
  const results = await page.evaluate(() => {
    return new Promise(resolve => {
      axe.run((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });
  
  expect(results.violations).toEqual([]);
});
```

### 3. User Journey Tests

Test complete user flows:

```typescript
test('admin can create news', async () => {
  await loginAsAdmin();
  await page.goto('/admin/news/create');
  
  await page.fill('input[name="title"]', 'Test News');
  await page.fill('textarea[name="content"]', 'Test content');
  await page.selectOption('select[name="category"]', 'Team News');
  
  await page.click('button[type="submit"]');
  
  expect(page.url()).toContain('/admin/news');
});
```

## Test Helpers

```typescript
// tests/helpers.ts
export async function createTestData() {
  const user = await createTestUser();
  const news = await createTestNews();
  return { user, news };
}

export async function cleanupTestData() {
  await prisma.user.deleteMany();
  await prisma.news.deleteMany();
}
```

## Best Practices

1. Test Setup
   - Use `beforeEach` for clean state
   - Mock external services
   - Clean up after tests

2. Mocking
   - Use Prisma mocks for database
   - Mock authentication
   - Mock external APIs

3. Assertions
   - Test success cases
   - Test error cases
   - Verify side effects

4. Organization
   - Group related tests
   - Use descriptive names
   - Follow AAA pattern (Arrange, Act, Assert)

## Example Test Suite

```typescript
describe('News Management', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  test('should create news', async () => {
    const data = {
      title: 'Test News',
      content: 'Test content',
      category: 'Team News'
    };

    prismaMock.news.create.mockResolvedValue({
      id: '1',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const news = await createNews(data);
    expect(news.title).toBe(data.title);
  });

  test('should handle validation errors', async () => {
    const data = {
      title: '', // Invalid
      content: 'Test'
    };

    await expect(createNews(data)).rejects.toThrow(ValidationError);
  });
});
```

## Coverage Requirements

Minimum coverage requirements:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

```bash
# Generate coverage report
npm run test -- --coverage
```

## CI Integration

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