import { prisma } from '../lib/prisma';
import type { User } from '@prisma/client';
import { hashPassword } from '../lib/auth';

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

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
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

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password);
  
  return prisma.user.create({
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
    }
  });
}

export async function updateUser(id: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}): Promise<User | null> {
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  return prisma.user.update({
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
    }
  });
}

export async function updateLastLogin(id: string): Promise<User | null> {
  return prisma.user.update({
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
    }
  });
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}
