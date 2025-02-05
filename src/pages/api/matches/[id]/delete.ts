// src/pages/api/matches/[id]/delete.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deleteMatch } from '../../../../utils/matches';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Match ID is required', { status: 400 });
    }

    await deleteMatch(id, request);
    return redirect('/admin/matches');
  } catch (error) {
    return handlePrismaError(error, 'Match', 'delete');
  }
};
