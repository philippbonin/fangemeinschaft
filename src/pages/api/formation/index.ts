import type { APIRoute } from 'astro';
import { createFormation } from '../../../utils/formations';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const positions = JSON.parse(formData.get('positions') as string);

    const formation = {
      players: positions,
      gameDetails: {
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        place: formData.get('place') as string,
        homeTeam: formData.get('homeTeam') as string,
        awayTeam: formData.get('awayTeam') as string
      },
      active: false
    };

    await createFormation(formation);
    return redirect('/admin/formation');
  } catch (error) {
    console.error('Error creating formation:', error);
    return new Response('Error creating formation', { status: 500 });
  }
};