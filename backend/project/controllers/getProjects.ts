import { Request, Response } from 'express';
import projectService from '../services/projectService';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Failed to get projects', err);
    res.status(500).json({ message: 'Server error' });
  }
};
