import type { APIRoute } from 'astro';
import { deleteAsset } from '../../../../utils/assets';

export const POST: APIRoute = async ({ params, redirect }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response('Asset ID is required', { status: 400 });
    }

    await deleteAsset(id);
    return redirect('/admin/assets');
  } catch (error) {
    console.error('Error deleting asset:', error);
    return new Response('Error deleting asset', { status: 500 });
  }
};