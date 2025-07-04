// routes/education.ts
import express from 'express';
import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';

const router = express.Router();

router.get('/', (_req, res) => {
  const results: any[] = [];
  const filePath = path.join(__dirname, '../assets/education.csv');

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) =>
      results.push({
        degree: data.degree.trim(),
        institution: data.institution.trim(),
        link: data.links?.trim() || null,
      })
    )
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Failed to load education data' });
    });
});

export default router;
