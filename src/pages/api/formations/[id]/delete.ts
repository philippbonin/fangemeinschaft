import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/prisma';
import { isAuthenticated } from '../../../../lib/auth';
import { handlePrismaError } from '../../../../lib/errors';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response('Formation ID is required', { status: 400 });
    }

    await prisma.formation.delete({ 
      where: { id },
      data: {
        _ctx: { req: request }
      }
    });
    
    return redirect('/admin/formation');
  } catch (error) {
    return handlePrismaError(error, 'Formation', 'delete');
  }
};