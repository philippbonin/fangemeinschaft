import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { updateSettings } from '../../../utils/settings';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const data = {
      logoUrl: formData.get('logoUrl') as string,
      chatEnabled: formData.get('chatEnabled') === 'true',
      buildLabelEnabled: formData.get('buildLabelEnabled') === 'true'
    };

    await updateSettings(data, request);
    return redirect('/admin/settings');
  } catch (error) {
    return handlePrismaError(error, 'Settings', 'update');
  }
};