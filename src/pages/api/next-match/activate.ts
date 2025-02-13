// src/pages/api/next-match/activate.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { setActiveNextMatch } from '../../../utils/nextMatch';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return new Response('Match ID is required', { status: 400 });
    }

    await setActiveNextMatch(id, request);
    return redirect('/admin/next-match/edit');
  } catch (error) {
    return handlePrismaError(error, 'NextMatch', 'update');
  }
};
