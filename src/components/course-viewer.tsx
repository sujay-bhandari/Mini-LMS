
"use client";

import { useState, useRef, useEffect } from "react";
import type { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PlayCircle, ChevronLeft, ChevronRight, ListVideo } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
}

export function CourseViewer({ course }: CourseViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videos } = course;
  const currentVideo = videos?.[currentIndex];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo) {
      videoElement.load();
      videoElement.play().catch(error => {
        console.warn("Autoplay was prevented by the browser.", error);
      });
    }
  }, [currentIndex, currentVideo]);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handlePlaylistClick = (index: number) => {
    setCurrentIndex(index);
  }

  if (!videos || videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-24 bg-card/50 border-dashed border">
            <p className="text-muted-foreground text-center">This course has no videos yet. <br/> Check back later or contact an admin.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
            {currentVideo ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full"
                key={currentVideo.url}
              >
                <source src={currentVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
                <div>Select a video to play</div>
            )}
          </div>
          <CardHeader>
            <CardTitle>{currentVideo?.title || 'No video selected'}</CardTitle>
            <CardDescription>{course.title}</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Video {currentIndex + 1} of {videos.length}
            </p>
            <div className="flex gap-2">
              <Button onClick={handlePrev} disabled={currentIndex === 0} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <Button onClick={handleNext} disabled={currentIndex === videos.length - 1} size="sm">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 sm:ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListVideo className="h-5 w-5 text-accent" />
              <CardTitle>Course Playlist</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] -mr-4">
              <div className="space-y-1 pr-4">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => handlePlaylistClick(index)}
                    className={cn(
                      "w-full text-left p-3 rounded-md transition-colors flex items-start gap-3",
                      index === currentIndex
                        ? "bg-accent/20"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {index === currentIndex ? <PlayCircle className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" /> : <span className="text-muted-foreground font-medium w-5 text-center flex-shrink-0 pt-0.5">{index + 1}</span>}
                    <div className="flex-1">
                      <p className={cn("font-medium leading-tight", index === currentIndex && "text-accent")}>{video.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
