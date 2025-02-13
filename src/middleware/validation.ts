import { z } from 'zod';

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request) => {
    try {
      const formData = await request.formData();
      return schema.parseAsync(Object.fromEntries(formData));
    } catch (error) {
      throw new Error('Validation failed');
    }
  };
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
