import type { APIRoute } from 'astro';
import { createSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const token = await createSession(email, password);
    
    if (!token) {
      return redirect('/admin/login?error=unauthorized', 302);
    }

    // Set cookie with proper attributes
    cookies.set('admin-token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return redirect('/admin', 302);
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/admin/login?error=unauthorized', 302);
  }
};