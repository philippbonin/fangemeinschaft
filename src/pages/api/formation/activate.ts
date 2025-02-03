import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return new Response('Formation ID is required', { status: 400 });
    }

    await prisma.$transaction([
      prisma.formation.updateMany({
        where: { active: true },
        data: { active: false }
      }),
      prisma.formation.update({
        where: { id },
        data: { active: true }
      })
    ]);

    return redirect('/admin/formation');
  } catch (error) {
    console.error('Error activating formation:', error);
    return new Response('Error activating formation', { status: 500 });
  }
};