// src/pages/api/users/[id]/delete.ts
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/auth';
import { deleteUser } from '../../../../utils/users';
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

    await deleteUser(id, request);
    return redirect('/admin/users');
  } catch (error) {
    return handlePrismaError(error, 'User', 'delete');
  }
};
