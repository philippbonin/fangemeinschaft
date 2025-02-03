import type { APIRoute } from 'astro';
import { createAsset } from '../../../utils/assets';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
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
      mime_type: file.type || 'application/octet-stream',
      size: file.size
    });

    return redirect('/admin/assets');
  } catch (error) {
    console.error('Error uploading asset:', error);
    return new Response('Error uploading asset', { status: 500 });
  }
};