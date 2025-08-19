
"use client";

import { useState, useRef } from "react";
import type { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AdminPanelProps {
  courses: Course[];
  onCreateCourse: (title: string, description: string) => Promise<void>;
  onAddVideo: (courseId: number, title: string, videoFile: File) => Promise<void>;
}

export function AdminPanel({ courses, onCreateCourse, onAddVideo }: AdminPanelProps) {
  // State for the "Create Course" form
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isCourseSubmitting, setIsCourseSubmitting] = useState(false);

  // State for the "Upload Video" form
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isVideoSubmitting, setIsVideoSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Handler for course creation
  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseTitle || !courseDescription) {
      alert("Please fill in both title and description for the course.");
      return;
    }
    setIsCourseSubmitting(true);
    await onCreateCourse(courseTitle, courseDescription);
    setCourseTitle("");
    setCourseDescription("");
    setIsCourseSubmitting(false);
  };

  // Handler for video upload
  const handleVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourseId || !videoTitle || !videoFile) {
        alert("Please select a course, provide a title, and choose a video file.");
        return;
    }
    setIsVideoSubmitting(true);
    await onAddVideo(Number(selectedCourseId), videoTitle, videoFile);
    
    // Reset form fields
    setVideoTitle("");
    setSelectedCourseId("");
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setIsVideoSubmitting(false);
  };
  
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Create Course Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            Start by creating a new course. You can add videos to it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input 
                      id="course-title"
                      placeholder="e.g., React for Beginners" 
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                  />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="course-description">Course Description</Label>
                  <Textarea
                    id="course-description"
                    placeholder="Describe what this course is about..."
                    className="resize-none"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  />
              </div>
              <Button type="submit" className="w-full" disabled={isCourseSubmitting || !courseTitle || !courseDescription}>
                {isCourseSubmitting ? 'Creating...' : 'Create Course'}
              </Button>
          </form>
        </CardContent>
      </Card>

      {/* Upload Video Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            {courses.length > 0
              ? "Select a course and upload a video file."
              : "Create a course first to upload videos."}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleVideoSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="select-course">Select Course</Label>
                  <Select 
                    onValueChange={(value) => setSelectedCourseId(value)} 
                    value={selectedCourseId}
                    disabled={courses.length === 0}
                  >
                      <SelectTrigger id="select-course">
                        <SelectValue placeholder="Select a course to add video to" />
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
               <div className="space-y-2">
                    <Label htmlFor="video-title">Video Title</Label>
                    <Input 
                        id="video-title"
                        placeholder="e.g., Introduction to JSX" 
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        disabled={!selectedCourseId}
                    />
               </div>
               <div className="space-y-2">
                    <Label htmlFor="video-file">Video File (.mp4, .webm)</Label>
                    <Input 
                        id="video-file"
                        type="file" 
                        ref={fileInputRef}
                        accept="video/mp4,video/webm"
                        onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                        disabled={!selectedCourseId}
                    />
               </div>
              <Button type="submit" className="w-full" disabled={!selectedCourseId || !videoTitle || !videoFile || isVideoSubmitting}>
                {isVideoSubmitting ? 'Uploading...' : 'Upload Video'}
              </Button>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
