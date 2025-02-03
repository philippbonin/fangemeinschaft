import type { APIRoute } from 'astro';
import { DatabaseError, ValidationError, AuthenticationError, AuthorizationError } from '../lib/errors';

export function withErrorHandler(handler: APIRoute): APIRoute {
  return async (context) => {
    try {
      return await handler(context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return new Response(JSON.stringify({
          error: 'Validation Error',
          details: error.issues
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (error instanceof DatabaseError) {
        return new Response(JSON.stringify({
          error: 'Database Error',
          message: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (error instanceof AuthenticationError) {
        return new Response(JSON.stringify({
          error: 'Authentication Error',
          message: error.message
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (error instanceof AuthorizationError) {
        return new Response(JSON.stringify({
          error: 'Authorization Error',
          message: error.message
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.error('Unhandled error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}