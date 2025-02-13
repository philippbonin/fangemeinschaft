import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createMatch } from '../../../utils/matches';
import { handlePrismaError } from '../../../lib/errors';

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

    await createMatch(data, request);
    return redirect('/admin/matches');
  } catch (error) {
    return handlePrismaError(error, 'Match', 'create');
  }
};