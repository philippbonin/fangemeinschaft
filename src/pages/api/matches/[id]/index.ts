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
      return new Response('Match ID is required', { status: 400 });
    }

    const formData = await request.formData();
    const data = {
      date: new Date(`${formData.get('date')}T${formData.get('time')}`),
      competition: formData.get('competition') as string,
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      venue: formData.get('venue') as string,
      homeScore: formData.has('homeScore') ? parseInt(formData.get('homeScore') as string) : null,
      awayScore: formData.has('awayScore') ? parseInt(formData.get('awayScore') as string) : null,
      played: formData.has('homeScore') && formData.has('awayScore')
    };

    await prisma.match.update({
      where: { id },
      data
    });

    return redirect('/admin/matches');
  } catch (error) {
    console.error('Error updating match:', error);
    return new Response('Error updating match', { status: 500 });
  }
};