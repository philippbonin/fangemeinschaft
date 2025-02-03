// src/middleware/validation.ts
import { z } from 'zod';
import type { APIRoute } from 'astro';

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (handler: APIRoute): APIRoute => {
    return async (context) => {
      try {
        const data = await context.request.formData();
        const validatedData = await schema.parseAsync(Object.fromEntries(data));
        context.locals.validatedData = validatedData;
        return handler(context);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response(JSON.stringify({
            error: 'Validation failed',
            issues: error.issues
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error;
      }
    };
  };
}
