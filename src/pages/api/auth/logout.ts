import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    const token = cookies.get('admin-token')?.value;
    
    if (token) {
      // Clear the cookie
      cookies.delete('admin-token', {
        path: '/',
        secure: true,
        sameSite: 'lax'
      });
    }
    
    return redirect('/admin/login', 302);
  } catch (error) {
    console.error('Logout error:', error);
    return redirect('/admin/login', 302);
  }
};