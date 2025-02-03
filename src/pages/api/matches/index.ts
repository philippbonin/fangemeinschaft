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
      date: new Date(`${formData.get('date')}T${formData.get('time')}`),
      competition: formData.get('competition') as string,
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      venue: formData.get('venue') as string,
      played: false
    };

    await prisma.match.create({ data });
    return redirect('/admin/matches');
  } catch (error) {
    console.error('Error creating match:', error);
    return new Response('Error creating match', { status: 500 });
  }
};