import api from './api';

export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};
