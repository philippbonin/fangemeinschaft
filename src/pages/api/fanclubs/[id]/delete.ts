// src/pages/api/fanclubs/[id]/delete.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deleteFanclub } from '../../../../utils/fanclubs';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Fanclub ID is required', { status: 400 });
    }

    await deleteFanclub(id, request);
    return redirect('/admin/fanclubs');
  } catch (error) {
    return handlePrismaError(error, 'Fanclub', 'delete');
  }
};
