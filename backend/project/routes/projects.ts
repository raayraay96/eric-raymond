import { Router } from 'express';
import { getProjects } from '../controllers/getProjects';

const router = Router();
router.get('/', getProjects);

export default router;
