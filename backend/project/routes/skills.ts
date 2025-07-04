import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

const router = Router();

type SkillEntry = {
  category: string;
  skill: string;
  level: number;
};

router.get('/', (req, res) => {
  const csvPath = path.resolve(__dirname, '../assets/skills.csv');
  const results: SkillEntry[] = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        category: data.category,
        skill: data.skill,
        level: Number(data.level),
      });
    })
    .on('end', () => {
      // Group by category
      const grouped = results.reduce(
        (acc, { category, skill, level }) => {
          if (!acc[category]) acc[category] = [];
          acc[category].push({ name: skill, level });
          return acc;
        },
        {} as Record<string, { name: string; level: number }[]>
      );

      // Convert to desired shape
      const formatted = Object.entries(grouped).map(([category, skills]) => ({
        category,
        skills,
      }));

      res.json(formatted);
    })
    .on('error', (err) => {
      console.error('❌ CSV read error:', err);
      res.status(500).json({ error: 'Failed to read skills CSV' });
    });
});

export default router;
