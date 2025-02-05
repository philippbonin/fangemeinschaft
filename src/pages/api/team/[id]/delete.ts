// src/pages/api/team/[id]/delete.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deletePlayer } from '../../../../utils/team';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Player ID is required', { status: 400 });
    }

    await deletePlayer(id, request);
    return redirect('/admin/team');
  } catch (error) {
    return handlePrismaError(error, 'Player', 'delete');
  }
};
