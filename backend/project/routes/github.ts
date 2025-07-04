// routes/github.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/contributions', async (req, res) => {
  try {
    const username = 'Raymond-Christopher';

    const response = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}`);

    res.json(response.data); // sends JSON contribution graph data
  } catch (err) {
    console.error('GitHub fetch error:', err);
    res.status(500).json({ error: 'Unable to fetch GitHub contributions' });
  }
});

export default router;
