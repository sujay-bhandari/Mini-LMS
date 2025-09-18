
"use client";

import { useState, useEffect } from 'react';
import type { Course } from "@/lib/types";
import { CourseViewer } from "./course-viewer";
import { API_BASE } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserPanelProps {
  courses: Course[];
}

export function UserPanel({ courses }: UserPanelProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If there's no selected course but there are courses available, select the first one.
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id.toString());
    }
  }, [courses, selectedCourseId]);


  useEffect(() => {
    if (selectedCourseId) {
        const fetchCourseDetails = async (courseId: string) => {
            setIsLoading(true);
            try {
              const response = await fetch(`${API_BASE}/api/courses/${courseId}`);
              if (!response.ok) {
                throw new Error('Failed to fetch course details');
              }
              const data = await response.json();
              setCurrentCourse(data.course);
            } catch (error) {
              console.error(error);
              setCurrentCourse(null); // Clear course on error
            } finally {
                setIsLoading(false);
            }
        };

      fetchCourseDetails(selectedCourseId);
    } else {
        setCurrentCourse(null);
    }
  }, [selectedCourseId]);


  if (courses.length === 0) {
    return (
      <Card className="flex items-center justify-center py-24 bg-card/50 border-dashed">
        <CardContent className="p-0">
          <p className="text-center text-muted-foreground">
            No courses available yet. <br />
            Go to the Admin Panel to create a new course.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label htmlFor="course-select" className="font-medium shrink-0">Select a Course:</label>
        <Select
          value={selectedCourseId}
          onValueChange={(value) => setSelectedCourseId(value)}
        >
          <SelectTrigger id="course-select" className="w-full md:w-[400px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
         <Card className="flex items-center justify-center py-24 bg-card/50 border-dashed">
            <CardContent className="p-0">
              <p className="text-center text-muted-foreground">Loading course...</p>
            </CardContent>
          </Card>
      )}

      {!isLoading && currentCourse && (
        <CourseViewer key={currentCourse.id} course={currentCourse} />
      )}
      
      {!isLoading && !currentCourse && selectedCourseId && (
         <Card className="flex items-center justify-center py-24 bg-card/50 border-dashed">
            <CardContent className="p-0">
              <p className="text-center text-muted-foreground">Could not load the selected course.</p>
            </CardContent>
          </Card>
      )}

      {!isLoading && !currentCourse && !selectedCourseId && courses.length > 0 && (
         <Card className="flex items-center justify-center py-24 bg-card/50 border-dashed">
            <CardContent className="p-0">
              <p className="text-center text-muted-foreground">Please select a course to start learning.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
