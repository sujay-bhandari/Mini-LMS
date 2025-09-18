
import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSessionFromCookies();
  if (session?.role === 'admin') {
    redirect('/admin');
  }
  if (session?.role === 'user') {
    redirect('/user');
  }
  redirect('/login');
}
