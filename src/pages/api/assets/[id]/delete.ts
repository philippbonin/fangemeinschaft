import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deleteAsset } from '../../../../utils/assets';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Asset ID is required', { status: 400 });
    }

    const success = await deleteAsset(id, request);
    if (!success) {
      return new Response('Asset not found', { status: 404 });
    }

    return redirect('/admin/assets');
  } catch (error) {
    console.error('Error deleting asset:', error);
    return handlePrismaError(error, 'Asset', 'delete');
  }
};