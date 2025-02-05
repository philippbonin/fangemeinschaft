Yes, for any API endpoint that requires authentication and makes Prisma calls, you need to pass the request context using _ctx: { req: request }. This allows the authentication middleware to access the request headers/cookies to verify the authentication token.

Here's a quick example of how to update other authenticated API endpoints:


// Example for news creation
export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    // ... process form data

    await prisma.news.create({
      data: {
        // ... news data
      },
      _ctx: { req: request } // Pass request context
    });

    return redirect('/admin/news');
  } catch (error) {
    console.error('Error creating news:', error);
    return new Response('Error creating news', { status: 500 });
  }
};
This needs to be added to all Prisma operations in authenticated API routes, including:

POST/PUT/DELETE operations in /api/news/*
POST/PUT/DELETE operations in /api/matches/*
POST/PUT/DELETE operations in /api/team/*
POST/PUT/DELETE operations in /api/fanclubs/*
POST/PUT/DELETE operations in /api/formation/*
POST/PUT operations in /api/settings/*
Read operations (GET requests) don't need this since we skip authentication for them in the middleware.



remove lib
- errors.ts
- cache.ts
- validation.ts 

check when middleware/* beeing used