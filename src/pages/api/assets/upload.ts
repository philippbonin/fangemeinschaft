import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createAsset } from '../../../utils/assets';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return new Response('File and name are required', { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create asset with binary data
    await createAsset({
      name,
      data: buffer,
      mimeType: file.type || 'application/octet-stream',
      size: file.size
    }, request);

    return redirect('/admin/assets');
  } catch (error) {
    console.error('Error uploading asset:', error);
    return handlePrismaError(error, 'Asset', 'create');
  }
};