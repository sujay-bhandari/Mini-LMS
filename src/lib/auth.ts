import { cookies } from 'next/headers';

export type UserRole = 'admin' | 'user';

export interface Session {
  id: string;
  userId: number;
  role: UserRole;
  createdAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __sessions: Map<string, Session> | undefined;
}

const SESSION_COOKIE = 'sessionId';

function getStore(): Map<string, Session> {
  if (!global.__sessions) {
    global.__sessions = new Map<string, Session>();
  }
  return global.__sessions;
}

export async function createSession(userId: number, role: UserRole): Promise<Session> {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const session: Session = { id, userId, role, createdAt: Date.now() };
  getStore().set(id, session);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/' });
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const id = cookieStore.get(SESSION_COOKIE)?.value;
  if (id) getStore().delete(id);
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionFromCookies(): Promise<Session | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const session = getStore().get(id) || null;
  return session ?? null;
}

export function requireAdmin(session: Session | null): boolean {
  return !!session && session.role === 'admin';
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session;
}


