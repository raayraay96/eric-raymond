import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const router = Router();

const csvPath = path.resolve(__dirname, '../assets/jobs.csv');

router.get('/', (req, res) => {
  const jobs: any[] = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      const parsed = {
        title: row.Title,
        company: row.Company,
        location: row.Location,
        start: row.Start,
        end: row.End,
        bullets: row.Bullets.split(';')
          .map((b: string) => b.trim())
          .filter(Boolean),
      };
      jobs.push(parsed);
    })
    .on('end', () => {
      res.json(jobs);
    })
    .on('error', (err) => {
      console.error('❌ CSV Read Error:', err);
      res.status(500).json({ error: 'Failed to read jobs data.' });
    });
});

export default router;
