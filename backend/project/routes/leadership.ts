import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const router = express.Router();

router.get('/', (req, res) => {
  const results: { title: string; info: string }[] = [];
  const filePath = path.join(__dirname, '../assets/leadership.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results))
    .on('error', (err) => res.status(500).json({ error: err.message }));
});

export default router;
