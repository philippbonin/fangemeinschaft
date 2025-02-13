export class ValidationError extends Error {
  constructor(public issues: any) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function handleError(error: unknown): Response {
  console.error('API Error:', error);

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
