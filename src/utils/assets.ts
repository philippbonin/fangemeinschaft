import { pool } from '../config/database';
import type { Asset, AssetResponse } from '../types/asset';

export async function getAssets(): Promise<AssetResponse[]> {
  const conn = await pool.getConnection();
  try {
    console.log('Fetching assets from database...'); // Debug log
    
    // Get all assets from the database
    const assets = await conn.query(
      'SELECT id, name, mime_type, size, created_at, updated_at FROM assets ORDER BY created_at DESC'
    );
    
    console.log('Found assets:', assets.length); // Debug log
    
    // Map each asset to include a URL
    return assets.map(asset => ({
      ...asset,
      url: `/api/assets/${asset.id}` // URL to fetch the actual asset data
    }));
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  } finally {
    conn.release();
  }
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const conn = await pool.getConnection();
  try {
    console.log('Fetching asset by ID:', id); // Debug log
    
    const [asset] = await conn.query(
      'SELECT * FROM assets WHERE id = ?',
      [id]
    );
    
    console.log('Found asset:', asset ? 'yes' : 'no'); // Debug log
    return asset || null;
  } catch (error) {
    console.error('Error fetching asset by ID:', error);
    return null;
  } finally {
    conn.release();
  }
}

export async function createAsset(asset: { name: string; data: Buffer; mime_type: string; size: number }): Promise<AssetResponse> {
  const conn = await pool.getConnection();
  try {
    // Generate UUID for the asset
    const [{ uuid }] = await conn.query('SELECT UUID() as uuid');
    
    // Insert the asset with the generated UUID
    await conn.query(
      'INSERT INTO assets (id, name, data, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [uuid, asset.name, asset.data, asset.mime_type, asset.size]
    );
    
    return {
      id: uuid,
      name: asset.name,
      url: `/api/assets/${uuid}`,
      mime_type: asset.mime_type,
      size: asset.size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  } finally {
    conn.release();
  }
}

export async function deleteAsset(id: string): Promise<boolean> {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('DELETE FROM assets WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  } finally {
    conn.release();
  }
}