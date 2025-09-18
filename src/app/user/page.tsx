import { getSessionFromCookies } from '@/lib/auth';
import { UserPanel } from '@/components/user-panel';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { API_BASE } from '@/lib/utils';

export default async function UserPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect('/login');
  }
  // If admin lands on user page, allow or redirect to admin? We'll redirect to admin.
  if (session.role === 'admin') {
    redirect('/admin');
  }
  const res = await fetch(`${API_BASE}/api/courses`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({ courses: [] }));
  const courses = data.courses || [];
  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">User View</h1>
        <LogoutButton />
      </div>
      <UserPanel courses={courses} />
    </main>
  );
}


