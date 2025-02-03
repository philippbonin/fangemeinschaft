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
      name: formData.get('name') as string,
      president: formData.get('president') as string,
      phone: formData.get('phone') as string,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string
    };

    await prisma.fanclub.create({ data });
    return redirect('/admin/fanclubs');
  } catch (error) {
    console.error('Error creating fanclub:', error);
    return new Response('Error creating fanclub', { status: 500 });
  }
};