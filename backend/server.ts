import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import classRoutes from './routes/class.routes';
import studentRoutes from './routes/student.routes';
import subjectRoutes from './routes/subject.routes';
import sessionRoutes from './routes/session.routes';
import attendanceRoutes from './routes/attendance.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// simple health route
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// example API route
app.get('/', (_, res) => {
    res.json({ message: 'Hello from EdTech backend' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// School reference routes
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;