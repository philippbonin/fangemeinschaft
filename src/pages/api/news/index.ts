import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

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

    await prisma.news.create({ data });
    return redirect('/admin/news');
  } catch (error) {
    console.error('Error creating news:', error);
    return new Response('Error creating news', { status: 500 });
  }
};