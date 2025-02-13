// src/pages/api/next-match/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { updateNextMatch } from '../../../utils/nextMatch';
import { handlePrismaError } from '../../../lib/errors';
import { stadiums } from '../../../utils/stadiums';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const venueId = formData.get('venue') as string;
    
    const stadium = stadiums.find(s => s.id === venueId);
    if (!stadium) {
      return new Response('Invalid venue', { status: 400 });
    }

    const data = {
      id: formData.get('id') as string,
      ticketLink: formData.get('ticketLink') as string,
      moreInfoContent: formData.get('moreInfoContent') as string
    };

    await updateNextMatch(data, request);
    return redirect('/admin');
  } catch (error) {
    return handlePrismaError(error, 'NextMatch', 'update');
  }
};
