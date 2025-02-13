// src/pages/api/news/[id]/delete.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deleteNews } from '../../../../utils/news';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('News ID is required', { status: 400 });
    }

    await deleteNews(id, request);
    return redirect('/admin/news');
  } catch (error) {
    return handlePrismaError(error, 'News', 'delete');
  }
};
