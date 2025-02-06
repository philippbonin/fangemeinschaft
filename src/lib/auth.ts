import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable!");
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export async function createSession(email: string, password: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;

  const token = createToken({ userId: user.id, email: user.email });
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });
  return token;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null; // Explicitly return null for expired/invalid tokens
  }
}

// Extracts token from Authorization header or cookies
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]; // Extract token
  }
  const cookies = request.headers.get('cookie');
  const tokenMatch = cookies?.match(/admin-token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const token = extractToken(request);
  if (!token) return false;

  const payload = await verifyToken(token);
  return !!payload;
}
