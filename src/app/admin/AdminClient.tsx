"use client";

import { useEffect, useState } from 'react';
import type { Course } from '@/lib/types';
import { AdminPanel } from '@/components/admin-panel';
import { API_BASE } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AdminClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch courses.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    // refresh courses on mount to reflect latest
    fetchCourses();
  }, []);

  const handleCreateCourse = async (title: string, description: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Failed to create course');
      await response.json();
      await fetchCourses();
      toast({ title: 'Success!', description: `Course "${title}" has been created.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not create course.', variant: 'destructive' });
    }
  };

  const handleAddVideo = async (courseId: number, title: string, videoFile: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);
    try {
      const response = await fetch(`${API_BASE}/api/courses/${courseId}/videos`, { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload video' }));
        throw new Error(errorData.message);
      }
      await response.json();
      await fetchCourses();
      toast({ title: 'Video Uploaded!', description: `"${title}" has been added to the course.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Could not upload video.', variant: 'destructive' });
    }
  };

  return (
    <AdminPanel courses={courses} onCreateCourse={handleCreateCourse} onAddVideo={handleAddVideo} />
  );
}


