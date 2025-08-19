
"use client";

import { useState, useEffect } from "react";
import type { Course } from "@/lib/types";
import { AdminPanel } from "@/components/admin-panel";
import { UserPanel } from "@/components/user-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch courses.",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      await response.json();
      fetchCourses(); // Refetch all courses to update the list
      toast({
        title: "Success!",
        description: `Course "${title}" has been created.`,
      });
    } catch (error) {
       toast({
        title: "Error",
        description: "Could not create course.",
        variant: "destructive",
      });
    }
  };

  const handleAddVideo = async (courseId: number, title: string, videoFile: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);
    try {
      const response = await fetch(`/api/courses/${courseId}/videos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: 'Failed to upload video' }));
        throw new Error(errorData.message);
      }

      await response.json();
      fetchCourses(); 
      toast({
        title: "Video Uploaded!",
        description: `"${title}" has been added to the course.`,
      });
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || "Could not upload video.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between space-x-4 px-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Mini LMS</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-5xl p-4 md:p-8">
        <Tabs defaultValue="user-view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user-view">User View</TabsTrigger>
            <TabsTrigger value="admin-panel">Admin Panel</TabsTrigger>
          </TabsList>
          <TabsContent value="user-view" className="mt-6">
            <UserPanel courses={courses} />
          </TabsContent>
          <TabsContent value="admin-panel" className="mt-6">
            <AdminPanel
              courses={courses}
              onCreateCourse={handleCreateCourse}
              onAddVideo={handleAddVideo}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
