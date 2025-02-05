import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createFormation } from '../../../utils/formations';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const positions = JSON.parse(formData.get('positions') as string);
    const matchId = formData.get('matchId') as string;

    const data = {
      matchId,
      players: positions
    };

    await createFormation(data, request);
    return redirect('/admin/formation');
  } catch (error) {
    return handlePrismaError(error, 'Formation', 'create');
  }
};