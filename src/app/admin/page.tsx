import { getSessionFromCookies, requireAdmin } from '@/lib/auth';
import { AdminClient } from './AdminClient';
import { LogoutButton } from '@/components/logout-button';
import { API_BASE } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSessionFromCookies();
  if (!requireAdmin(session)) {
    redirect('/user');
  }
  const res = await fetch(`${API_BASE}/api/courses`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({ courses: [] }));
  const courses = data.courses || [];

  async function createCourse(title: string, description: string) {
    'use server';
    // API route already checks admin, we use client via fetch from AdminPanel
  }

  async function addVideo(courseId: number, title: string, file: File) {
    'use server';
  }

  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <LogoutButton />
      </div>
      <AdminClient initialCourses={courses} />
    </main>
  );
}


