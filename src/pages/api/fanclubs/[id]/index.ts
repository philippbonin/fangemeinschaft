import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/prisma';
import { isAuthenticated } from '../../../../lib/auth';

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

    await prisma.fanclub.update({
      where: { id },
      data
    });

    return redirect('/admin/fanclubs');
  } catch (error) {
    console.error('Error updating fanclub:', error);
    return new Response('Error updating fanclub', { status: 500 });
  }
};