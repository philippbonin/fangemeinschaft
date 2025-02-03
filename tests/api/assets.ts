// tests/api/assets.test.ts
import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getAssets, getAssetById, createAsset, deleteAsset } from '../../src/utils/assets';

describe('Assets API', () => {
  const testAsset = {
    id: '1',
    name: 'test.jpg',
    data: Buffer.from('test'),
    mimeType: 'image/jpeg',
    size: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should get all assets', async () => {
    prismaMock.asset.findMany.mockResolvedValue([testAsset]);
    const assets = await getAssets();
    expect(assets).toHaveLength(1);
    expect(assets[0].name).toBe('test.jpg');
  });

  test('should get asset by id', async () => {
    prismaMock.asset.findUnique.mockResolvedValue(testAsset);
    const asset = await getAssetById('1');
    expect(asset).toEqual(testAsset);
  });

  test('should create asset', async () => {
    const createData = {
      name: 'test.jpg',
      data: Buffer.from('test'),
      mimeType: 'image/jpeg',
      size: 4
    };

    prismaMock.asset.create.mockResolvedValue(testAsset);
    const asset = await createAsset(createData);
    expect(asset).toEqual(testAsset);
  });

  test('should delete asset', async () => {
    prismaMock.asset.delete.mockResolvedValue(testAsset);
    const result = await deleteAsset('1');
    expect(result).toBe(true);
  });
});
