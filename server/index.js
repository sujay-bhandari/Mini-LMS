const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// In-memory data store
const store = {
  courses: [], // { id, title, description, videos: [{ id, title, url }] }
  courseId: 1,
  videoId: 1,
};

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, unique + '-' + safe);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') cb(null, true);
  else cb(new Error('Only .mp4 and .webm formats are allowed!'));
};
const upload = multer({ storage, fileFilter });

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// GET list of courses (helper for frontend)
app.get('/api/courses', (req, res) => {
  const list = store.courses.map(({ id, title, description }) => ({ id, title, description }));
  res.json({ courses: list });
});

// POST /api/courses - create course
app.post('/api/courses', (req, res) => {
  const { title, description } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  const course = { id: store.courseId++, title, description, videos: [] };
  store.courses.push(course);
  // assignment says return Course ID
  res.status(201).json({ id: course.id, course });
});

// POST /api/courses/:courseId/videos - upload video
app.post('/api/courses/:courseId/videos', upload.single('video'), (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) return res.status(400).json({ message: 'Invalid course ID' });
  const course = store.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const { title } = req.body || {};
  if (!title || !req.file) return res.status(400).json({ message: 'Title and video file are required' });

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
  const video = { id: store.videoId++, title, url: fileUrl };
  course.videos.push(video);
  res.status(201).json({ video });
});

// GET /api/courses/:courseId - course with videos
app.get('/api/courses/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) return res.status(400).json({ message: 'Invalid course ID' });
  const course = store.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});


