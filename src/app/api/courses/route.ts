
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const courses = db.getCourses();
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const { title, description } = await request.json();

  if (!title || !description) {
    return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
  }

  const newCourse = db.createCourse(title, description);
  return NextResponse.json({ course: newCourse }, { status: 201 });
}
