import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
});

// News schemas
export const newsSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(10),
  image: z.string().url(),
  category: z.enum(['Team News', 'Match Report', 'Club News', 'Press Release']),
  date: z.date()
});

// Match schemas
export const matchSchema = z.object({
  date: z.date(),
  competition: z.string().min(3).max(100),
  homeTeam: z.string().min(3).max(100),
  awayTeam: z.string().min(3).max(100),
  homeScore: z.number().int().min(0).nullable(),
  awayScore: z.number().int().min(0).nullable(),
  venue: z.string().min(3).max(100),
  played: z.boolean()
});

// Fanclub schemas
export const fanclubSchema = z.object({
  name: z.string().min(3).max(100),
  president: z.string().min(3).max(100),
  phone: z.string().regex(/^\+?[0-9\s-()]{8,20}$/).optional(),
  mobile: z.string().regex(/^\+?[0-9\s-()]{8,20}$/).optional(),
  email: z.string().email(),
  website: z.string().url().optional()
});

// Formation schemas
export const formationPlayerSchema = z.object({
  playerId: z.string().uuid(),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100)
});

export const formationSchema = z.object({
  matchId: z.string().uuid(),
  players: z.array(formationPlayerSchema),
  active: z.boolean().optional()
});

// Settings schemas
export const settingsSchema = z.object({
  logoUrl: z.string().url(),
  chatEnabled: z.boolean(),
  buildLabelEnabled: z.boolean()
});

// Validation helper functions
export async function validateData<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      throw new ValidationError('Validation failed', issues);
    }
    throw error;
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