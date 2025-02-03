import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { createSession, isAuthenticated } from '../../src/lib/auth';
import jwt from 'jsonwebtoken';

describe('Auth API', () => {
  const testUser = {
    id: '1',
    email: 'test@example.com',
    password: '$2a$10$test',
    firstName: 'Test',
    lastName: 'User',
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should create session', async () => {
    prismaMock.user.findUnique.mockResolvedValue(testUser);
    prismaMock.user.update.mockResolvedValue(testUser);

    const token = await createSession('test@example.com', 'password');
    expect(token).toBeTruthy();
  });

  test('should verify authentication', async () => {
    const token = jwt.sign({ userId: '1', email: 'test@example.com' }, process.env.JWT_SECRET || 'test');
    const request = new Request('http://localhost', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const isAuth = await isAuthenticated(request);
    expect(isAuth).toBe(true);
  });
});