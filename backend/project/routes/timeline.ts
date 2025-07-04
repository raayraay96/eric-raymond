// server/routes/timeline.ts
import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../assets/project.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read timeline data' });
    res.json(JSON.parse(data));
  });
});

export default router;
