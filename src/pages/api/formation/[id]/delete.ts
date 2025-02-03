import type { APIRoute } from 'astro';
import { deleteFormation } from '../../../../utils/formations';

export const POST: APIRoute = async ({ params, redirect }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response('Formation ID is required', { status: 400 });
    }

    await deleteFormation(id);
    return redirect('/admin/formation');
  } catch (error) {
    console.error('Error deleting formation:', error);
    return new Response('Error deleting formation', { status: 500 });
  }
};