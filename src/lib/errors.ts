import { Prisma } from '@prisma/client';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause: unknown,
    public model?: string,
    public action?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function handlePrismaError(error: unknown, model?: string, action?: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new DatabaseError(
          'A unique constraint would be violated.',
          error,
          model,
          action
        );
      case 'P2025':
        throw new DatabaseError(
          'Record not found.',
          error,
          model,
          action
        );
      default:
        throw new DatabaseError(
          `Database error: ${error.message}`,
          error,
          model,
          action
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(
      'Invalid data provided.',
      error,
      model,
      action
    );
  }

  throw new DatabaseError(
    'An unexpected database error occurred.',
    error,
    model,
    action
  );
}