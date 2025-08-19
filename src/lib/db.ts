
import type { Course, Video } from './types';

// In-memory data store setup using the global object for persistence in development
// This prevents the database from being reset on every hot reload.
declare global {
  var courses: Course[];
  var courseIdCounter: number;
  var videoIdCounter: number;
}

if (!global.courses) {
  global.courses = [];
  global.courseIdCounter = 1;
  global.videoIdCounter = 1;
}

export const db = {
  // Course methods
  createCourse: (title: string, description: string): Course => {
    const newCourse: Course = {
      id: global.courseIdCounter++,
      title,
      description,
      videos: [],
    };
    global.courses.push(newCourse);
    return newCourse;
  },

  addVideo: (courseId: number, title: string, url: string): Video | null => {
    const course = global.courses.find((c) => c.id === courseId);
    if (!course) {
      return null;
    }
    const newVideo: Video = {
      id: global.videoIdCounter++,
      title,
      url,
    };
    course.videos.push(newVideo);
    return newVideo;
  },

  getCourseWithVideos: (id: number): Course | undefined => {
    // This method returns the full course object including videos.
    const course = global.courses.find((c) => c.id === id);
    if (!course) {
      return undefined;
    }
    // Deep copy to prevent mutations of the in-memory store
    return JSON.parse(JSON.stringify(course));
  },

  getCourses: (): Omit<Course, 'videos'>[] => {
    // This method returns a list of courses without video details for the main dropdown.
    return global.courses.map(({ id, title, description }) => ({ id, title, description }));
  },
};
