// src/pages/api/team/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createPlayer } from '../../../utils/team';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      number: parseInt(formData.get('number') as string),
      position: formData.get('position') as string,
      image: formData.get('image') as string
    };

    await createPlayer(data, request);
    return redirect('/admin/team');
  } catch (error) {
    return handlePrismaError(error, 'Player', 'create');
  }
};
