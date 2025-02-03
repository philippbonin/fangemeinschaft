import type { APIRoute } from 'astro';
import { updateNextMatch } from '../../../utils/db';
import { stadiums } from '../../../utils/stadiums';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const venueId = formData.get('venue') as string;
    
    // Find stadium by ID to get the name
    const stadium = stadiums.find(s => s.id === venueId);
    if (!stadium) {
      return new Response('Invalid venue', { status: 400 });
    }

    const data = {
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      venue: stadium.name,
      competition: formData.get('competition') as string,
      ticketLink: formData.get('ticketLink') as string,
      moreInfoContent: formData.get('moreInfoContent') as string,
    };

    await updateNextMatch(data);
    return redirect('/admin');
  } catch (error) {
    console.error('Error updating next match:', error);
    return new Response('Error updating next match', { status: 500 });
  }
};