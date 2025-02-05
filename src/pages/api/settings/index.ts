import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

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

    const settings = await prisma.settings.findFirst();
    
    if (settings) {
      await prisma.settings.update({
        where: { id: settings.id },
        data,
        _ctx: { req: request } // Pass request context to Prisma
      });
    } else {
      await prisma.settings.create({ data });
    }

    return redirect('/admin/settings');
  } catch (error) {
    console.error('Error updating settings:', error);
    return new Response('Error updating settings', { status: 500 });
  }
};