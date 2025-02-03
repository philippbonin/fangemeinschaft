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
      return new Response('Match ID is required', { status: 400 });
    }

    await prisma.match.delete({ where: { id } });
    return redirect('/admin/matches');
  } catch (error) {
    console.error('Error deleting match:', error);
    return new Response('Error deleting match', { status: 500 });
  }
};