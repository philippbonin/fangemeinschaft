import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createNews } from '../../../utils/news';
import { handlePrismaError } from '../../../lib/errors';


export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      date: new Date()
    };

    await createNews({ 
      data},request);
    return redirect('/admin/news');
  } catch (error) {
    console.error('Error uploading asset:', error);
    return handlePrismaError(error, 'Asset', 'create');
  }
};