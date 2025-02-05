// src/pages/api/users/[id]/index.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { updateUser } from '../../../../utils/users';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('User ID is required', { status: 400 });
    }

    const formData = await request.formData();
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string
    };

    const password = formData.get('password') as string;
    if (password) {
      data.password = password;
    }

    await updateUser(id, data, request);
    return redirect('/admin/users');
  } catch (error) {
    return handlePrismaError(error, 'User', 'update');
  }
};
