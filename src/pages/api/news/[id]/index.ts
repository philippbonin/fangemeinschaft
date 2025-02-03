// src/pages/api/news/index.ts
import { validateRequest } from '../../../middleware/validation';
import { newsSchema } from '../../../lib/validation';

export const POST: APIRoute = validateRequest(newsSchema)(async ({ request, locals }) => {
  try {
    const data = locals.validatedData;
    await prisma.news.create({ data });
    return new Response(null, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return new Response('Error creating news', { status: 500 });
  }
});
