import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createFanclub } from '../../../utils/fanclubs';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
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

    await createFanclub(data, request);
    return redirect('/admin/fanclubs');
  } catch (error) {
    return handlePrismaError(error, 'Fanclub', 'create');
  }
};