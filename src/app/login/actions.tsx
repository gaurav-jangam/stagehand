
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // Hardcoded credentials
  if (username === 'Gandharva' && password === 'Gandharva@432Hz') {
    const session = { user: { name: 'Gandharva' }, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    
    // Encrypt and set cookie
    // For simplicity, we store the session object as a JSON string. 
    // In a real app, you should encrypt the session data.
    cookies().set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: session.expires,
      path: '/',
    });

    return null; // No error
  }

  return 'Invalid username or password.';
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie);
    if (new Date(session.expires) > new Date()) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}
