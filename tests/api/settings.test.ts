import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getSettings, updateSettings } from '../../src/utils/settings';
import { validateResponse, validateRequest } from '../helpers/openapi';

describe('Settings API', () => {
  const testSettings = {
    id: '1',
    logoUrl: '/test-logo.png',
    chatEnabled: true,
    buildLabelEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should get settings with valid response schema', async () => {
    prismaMock.settings.findFirst.mockResolvedValue(testSettings);
    const settings = await getSettings();
    expect(validateResponse('/settings', 'GET', 200, settings)).toBe(true);
  });

  test('should update settings with valid request and response schema', async () => {
    const updateData = {
      logoUrl: '/new-logo.png',
      chatEnabled: false,
      buildLabelEnabled: false
    };
    expect(validateRequest('/settings', 'PUT', updateData)).toBe(true);

    prismaMock.settings.update.mockResolvedValue({ ...testSettings, ...updateData });
    const settings = await updateSettings(updateData);
    expect(validateResponse('/settings', 'PUT', 200, settings)).toBe(true);
  });
});