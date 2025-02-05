// src/utils/staff.ts
import { prisma } from '../lib/prisma';
import type { Staff } from '@prisma/client';

export async function getStaff(): Promise<Staff[]> {
  return prisma.staff.findMany({
    orderBy: [
      { role: 'asc' },
      { name: 'asc' }
    ]
  });
}

export async function getStaffById(id: string): Promise<Staff | null> {
  return prisma.staff.findUnique({
    where: { id }
  });
}

export async function createStaff(data: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<Staff> {
  return prisma.staff.create({
    data
  });
}

export async function updateStaff(id: string, data: Partial<Staff>): Promise<Staff | null> {
  return prisma.staff.update({
    where: { id },
    data
  });
}

export async function deleteStaff(id: string): Promise<boolean> {
  try {
    await prisma.staff.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}

export async function getStaffByRole(role: string): Promise<Staff[]> {
  return prisma.staff.findMany({
    where: { role },
    orderBy: { name: 'asc' }
  });
}

export async function getStaffCount(): Promise<number> {
  return prisma.staff.count();
}

export async function getStaffRoles(): Promise<string[]> {
  const staff = await prisma.staff.findMany({
    select: { role: true },
    distinct: ['role'],
    orderBy: { role: 'asc' }
  });
  return staff.map(s => s.role);
}
