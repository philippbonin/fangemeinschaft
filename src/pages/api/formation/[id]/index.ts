import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/prisma';
import { isAuthenticated } from '../../../../lib/auth';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Formation ID is required', { status: 400 });
    }

    const formData = await request.formData();
    const positions = JSON.parse(formData.get('positions') as string);

    await prisma.formation.update({
      where: { id },
      data: {
        players: {
          deleteMany: {},
          create: positions.map(p => ({
            playerId: p.playerId,
            positionX: p.positionX,
            positionY: p.positionY
          }))
        }
      }
    });

    return redirect('/admin/formation');
  } catch (error) {
    console.error('Error updating formation:', error);
    return new Response('Error updating formation', { status: 500 });
  }
};