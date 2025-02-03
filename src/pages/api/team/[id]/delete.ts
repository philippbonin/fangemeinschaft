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
      return new Response('Player ID is required', { status: 400 });
    }

    await prisma.player.delete({ where: { id } });
    return redirect('/admin/team');
  } catch (error) {
    console.error('Error deleting player:', error);
    return new Response('Error deleting player', { status: 500 });
  }
};