// src/pages/api/fanclubs/[id]/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { updateFanclub } from '../../../../utils/fanclubs';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Fanclub ID is required', { status: 400 });
    }

    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      president: formData.get('president') as string,
      phone: formData.get('phone') as string,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string
    };

    await updateFanclub(id, data, request);
    return redirect('/admin/fanclubs');
  } catch (error) {
    return handlePrismaError(error, 'Fanclub', 'update');
  }
};
