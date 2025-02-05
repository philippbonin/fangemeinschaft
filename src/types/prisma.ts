import type { Request } from 'astro';

export interface PrismaContext {
  req: Request;
}

export interface PrismaArgs {
  _ctx?: PrismaContext;
  [key: string]: any;
}