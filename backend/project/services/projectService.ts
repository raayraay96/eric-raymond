import { Project } from '../models/Project';
import projects from '../data/mockProjects.json';

const getAllProjects = async (): Promise<Project[]> => {
  return projects;
};

export default {
  getAllProjects,
};
