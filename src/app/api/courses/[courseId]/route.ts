
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, context: { params: { courseId: string } }) {
  const courseId = parseInt(context.params.courseId, 10);
  if (isNaN(courseId)) {
    return NextResponse.json({ message: 'Invalid course ID' }, { status: 400 });
  }

  const course = db.getCourseWithVideos(courseId);

  if (!course) {
    return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json({ course });
}
