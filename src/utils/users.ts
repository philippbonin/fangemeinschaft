// src/utils/users.ts
import { prisma } from '../lib/prisma';
import type { User } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';
import { hashPassword } from '../lib/auth';

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    where: { deleted: false },
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

export async function createUser(
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  },
  request: Request
): Promise<User> {
  const ctx: PrismaContext = { req: request };
  const hashedPassword = await hashPassword(data.password);
  
  const args: PrismaArgs = {
    data: {
      ...data,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    },
    _ctx: ctx
  };

  return prisma.user.create(args);
}

export async function updateUser(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  },
  request: Request
): Promise<User | null> {
  const ctx: PrismaContext = { req: request };
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const args: PrismaArgs = {
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    },
    _ctx: ctx
  };

  return prisma.user.update(args);
}

export async function deleteUser(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.user.delete(args);
    return true;
  } catch {
    return false;
  }
}

export async function updateLastLogin(id: string, request: Request): Promise<User | null> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    where: { id },
    data: {
      lastLogin: new Date()
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    },
    _ctx: ctx
  };

  return prisma.user.update(args);
}
