// src/pages/api/team/[id]/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { updatePlayer } from '../../../../utils/team';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Player ID is required', { status: 400 });
    }

    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      number: parseInt(formData.get('number') as string),
      position: formData.get('position') as string,
      image: formData.get('image') as string
    };

    await updatePlayer(id, data, request);
    return redirect('/admin/team');
  } catch (error) {
    return handlePrismaError(error, 'Player', 'update');
  }
};
