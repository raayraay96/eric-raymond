import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects';
import skillsRouter from './routes/skills';
import jobsRouter from './routes/jobs';
import educationRouter from './routes/education';
import leadershipRouter from './routes/leadership';
import githubRouter from './routes/github';
import timelineRoutes from './routes/timeline';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/education', educationRouter);
app.use('/api/leadership', leadershipRouter);
app.use('/api/github', githubRouter);
app.use('/api/timeline', timelineRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Project service running on port ${PORT}`);
});
