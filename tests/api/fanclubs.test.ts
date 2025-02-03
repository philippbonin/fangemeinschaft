import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getFanclubs, getFanclubById, createFanclub, updateFanclub, deleteFanclub } from '../../src/utils/fanclubs';
import { validateResponse, validateRequest } from '../helpers/openapi';

describe('Fanclubs API', () => {
  const testFanclub = {
    id: '1',
    name: 'Test Fanclub',
    president: 'John Doe',
    phone: '123456789',
    mobile: '987654321',
    email: 'test@fanclub.com',
    website: 'https://test-fanclub.com',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should get all fanclubs with valid response schema', async () => {
    prismaMock.fanclub.findMany.mockResolvedValue([testFanclub]);
    const fanclubs = await getFanclubs();
    expect(validateResponse('/fanclubs', 'GET', 200, fanclubs)).toBe(true);
  });

  test('should get fanclub by id with valid response schema', async () => {
    prismaMock.fanclub.findUnique.mockResolvedValue(testFanclub);
    const fanclub = await getFanclubById('1');
    expect(validateResponse('/fanclubs/{id}', 'GET', 200, fanclub)).toBe(true);
  });

  test('should create fanclub with valid request and response schema', async () => {
    const { id, createdAt, updatedAt, ...createData } = testFanclub;
    expect(validateRequest('/fanclubs', 'POST', createData)).toBe(true);

    prismaMock.fanclub.create.mockResolvedValue(testFanclub);
    const fanclub = await createFanclub(createData);
    expect(validateResponse('/fanclubs', 'POST', 201, fanclub)).toBe(true);
  });

  test('should update fanclub with valid request and response schema', async () => {
    const updateData = { president: 'Jane Doe', phone: '999888777' };
    expect(validateRequest('/fanclubs/{id}', 'PUT', updateData)).toBe(true);

    prismaMock.fanclub.update.mockResolvedValue({ ...testFanclub, ...updateData });
    const fanclub = await updateFanclub('1', updateData);
    expect(validateResponse('/fanclubs/{id}', 'PUT', 200, fanclub)).toBe(true);
  });

  test('should delete fanclub', async () => {
    prismaMock.fanclub.delete.mockResolvedValue(testFanclub);
    const result = await deleteFanclub('1');
    expect(result).toBe(true);
  });
});