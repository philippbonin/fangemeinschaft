import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>()
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>();

// Mock Redis client
jest.mock('../src/lib/cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  clearCache: jest.fn()
}));

// Mock JWT functions
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn().mockReturnValue({ userId: '1', email: 'test@example.com' })
}));

// Global test setup
beforeAll(() => {
  // Setup any global test requirements
});

afterAll(async () => {
  await prisma.$disconnect();
});