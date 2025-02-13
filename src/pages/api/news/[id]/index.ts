// src/pages/api/news/[id]/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { updateNews } from '../../../../utils/news';
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

    const formData = await request.formData();
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string
    };

    await updateNews(id, data, request);
    return redirect('/admin/news');
  } catch (error) {
    return handlePrismaError(error, 'News', 'update');
  }
};
