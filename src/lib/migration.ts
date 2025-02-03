// src/lib/migrations.ts
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

export async function runMigrations(prisma: PrismaClient) {
  const migrationsPath = path.join(process.cwd(), 'prisma/migrations');
  
  try {
    const migrations = await fs.readdir(migrationsPath);
    const sortedMigrations = migrations
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const migration of sortedMigrations) {
      const sql = await fs.readFile(
        path.join(migrationsPath, migration), 
        'utf-8'
      );
      
      await prisma.$executeRawUnsafe(sql);
      console.log(`Executed migration: ${migration}`);
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

export async function rollbackMigration(prisma: PrismaClient, migrationName: string) {
  const rollbackPath = path.join(
    process.cwd(), 
    'prisma/migrations', 
    migrationName, 
    'rollback.sql'
  );

  try {
    const sql = await fs.readFile(rollbackPath, 'utf-8');
    await prisma.$executeRawUnsafe(sql);
    console.log(`Rolled back migration: ${migrationName}`);
  } catch (error) {
    console.error(`Error rolling back migration ${migrationName}:`, error);
    throw error;
  }
}
