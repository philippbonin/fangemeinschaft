import { prisma } from '../lib/prisma';
import { createToken, verifyToken, hashPassword, verifyPassword } from '../lib/auth';
import type { User } from '@prisma/client';

export async function isAuthenticated(Astro: any) {
  try {
    const token = Astro.cookies.get('admin-token')?.value;
    if (!token) return false;

    const payload = await verifyToken(token);
    return !!payload;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function signOut(token: string) {
  try {
    // Just invalidate the cookie on the client side
    // JWT tokens can't be invalidated server-side
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    }
  });
}