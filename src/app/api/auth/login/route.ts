import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { users } from '@/lib/users';

export async function POST(request: Request) {
  const { identifier, password } = await request.json();

  if (!identifier || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // Hardcoded credentials (exact match)
  if (identifier === 'admin123' && password === 'admin123') {
    const session = await createSession(1, 'admin');
    return NextResponse.json({ session, user: { id: 1, email: 'admin@example.com', username: 'admin123', role: 'admin' } });
  }
  if (identifier === 'user123' && password === 'user123') {
    const session = await createSession(2, 'user');
    return NextResponse.json({ session, user: { id: 2, email: 'user@example.com', username: 'user123', role: 'user' } });
  }

  const user = users.findByEmailOrUsername(identifier);
  if (!user || user.password !== password) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const session = await createSession(user.id, user.role);
  return NextResponse.json({ session, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
}


