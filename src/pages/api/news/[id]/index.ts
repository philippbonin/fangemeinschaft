import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/prisma';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const data = locals.validatedData;
    await prisma.news.create({ 
      data,
      _ctx: { req: request } // Pass request context to Prisma
    });
    return new Response(null, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return new Response('Error creating news', { status: 500 });
  }
};
