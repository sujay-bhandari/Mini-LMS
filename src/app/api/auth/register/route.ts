import { NextResponse } from 'next/server';
import { users, type UserRole } from '@/lib/users';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, username, password, role } = await request.json();

  if (!email || !username || !password || !role) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }
  if (role !== 'admin' && role !== 'user') {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }
  if (users.existsByEmailOrUsername(email, username)) {
    return NextResponse.json({ message: 'Email or username already exists' }, { status: 409 });
  }

  const user = users.create({ email, username, password, role: role as UserRole });
  const session = await createSession(user.id, user.role);
  return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role }, session }, { status: 201 });
}


