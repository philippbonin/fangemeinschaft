// src/pages/api/formation/activate.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { setActiveFormation } from '../../../utils/formations';
import { handlePrismaError } from '../../../lib/errors';

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

    await setActiveFormation(id, request);
    return redirect('/admin/formation');
  } catch (error) {
    return handlePrismaError(error, 'Formation', 'update');
  }
};
