'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === 'admin123' && password === 'password123') {
    const cookieStore = cookies();
    cookieStore.set('session', 'admin-logged-in', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin');
  }

  return {
    error: 'Invalid username or password',
  };
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('session');
  redirect('/login');
}
