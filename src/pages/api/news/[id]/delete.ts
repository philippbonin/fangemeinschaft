import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/prisma';
import { isAuthenticated } from '../../../../lib/auth';

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('News ID is required', { status: 400 });
    }

    await prisma.news.delete({ 
      where: { id },
      _ctx: { req: request } // Pass request context to Prisma
    });
    
    return redirect('/admin/news');
  } catch (error) {
    console.error('Error deleting news:', error);
    return new Response('Error deleting news', { status: 500 });
  }
};