
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from '@/lib/db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos');

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  const courseId = parseInt(params.courseId, 10);
  if (isNaN(courseId)) {
    return NextResponse.json({ message: 'Invalid course ID' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const videoFile = formData.get('video') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json({ message: 'Title and video file are required' }, { status: 400 });
    }
    
    // Validate file type
    if (videoFile.type !== 'video/mp4' && videoFile.type !== 'video/webm') {
        return NextResponse.json({ message: 'Only .mp4 and .webm formats are allowed!' }, { status: 400 });
    }

    // Create the upload directory if it doesn't exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + videoFile.name;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write the file to the server
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    await fs.writeFile(filepath, buffer);
    
    const videoUrl = `/uploads/videos/${filename}`;
    const newVideo = db.addVideo(courseId, title, videoUrl);

    if (!newVideo) {
      // If the course wasn't found, delete the orphaned video file.
      await fs.unlink(filepath).catch(err => console.error("Cleanup failed", err));
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ video: newVideo }, { status: 201 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
