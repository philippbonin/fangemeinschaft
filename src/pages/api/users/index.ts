// src/pages/api/users/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createUser } from '../../../utils/users';
import { handlePrismaError } from '../../../lib/errors';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    await createUser(data, request);
    return redirect('/admin/users');
  } catch (error) {
    return handlePrismaError(error, 'User', 'create');
  }
};
