import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export default api;
