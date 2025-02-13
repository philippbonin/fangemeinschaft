import type { APIRoute } from 'astro';
import { getAssetById } from '../../../../utils/assets';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response('Asset ID is required', { status: 400 });
    }

    const asset = await getAssetById(id);
    if (!asset) {
      return new Response('Asset not found', { status: 404 });
    }

    // Return the binary data with proper content type
    return new Response(asset.data, {
      status: 200,
      headers: {
        'Content-Type': asset.mimeType,
        'Content-Length': asset.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'ETag': `"${id}"`,
        'Last-Modified': asset.updatedAt.toUTCString()
      }
    });
  } catch (error) {
    console.error('Error serving asset:', error);
    return new Response('Error serving asset', { status: 500 });
  }
};