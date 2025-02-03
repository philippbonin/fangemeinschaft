import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Define proper types for mocked database connection
interface MockedConnection {
  query: jest.Mock;
  release: jest.Mock;
  beginTransaction: jest.Mock;
  commit: jest.Mock;
  rollback: jest.Mock;
}

// Create mock connection
const mockConnection: MockedConnection = {
  query: jest.fn().mockResolvedValue([]),
  release: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn()
};

// Mock database module
jest.mock('./src/config/database', () => {
  return {
    pool: {
      getConnection: jest.fn().mockResolvedValue(mockConnection)
    },
    getConnection: jest.fn().mockResolvedValue(mockConnection)
  };
});

// Mock Response for fetch
class MockResponse implements Response {
  ok = true;
  status = 200;
  statusText = 'OK';
  headers = new Headers();
  body = null;
  bodyUsed = false;
  redirected = false;
  type = 'default' as ResponseType;
  url = '';

  constructor() {
    this.json = () => Promise.resolve({});
    this.text = () => Promise.resolve('');
    this.blob = () => Promise.resolve(new Blob());
    this.arrayBuffer = () => Promise.resolve(new ArrayBuffer(0));
    this.formData = () => Promise.resolve(new FormData());
    this.clone = () => new MockResponse();
  }
}

// Mock fetch globally with proper types
const mockFetch = jest.fn(() => Promise.resolve(new MockResponse()));
global.fetch = mockFetch as unknown as typeof fetch;

// Mock console.error
const originalError = console.error;
console.error = jest.fn((...args) => {
  originalError(...args);
  throw new Error(args.join(' '));
});