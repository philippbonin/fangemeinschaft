import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock console.error to catch and fail tests on errors
const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  throw new Error(args.join(' '));
};