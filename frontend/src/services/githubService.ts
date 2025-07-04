// services/githubService.ts
import axios from './api'; // your axios instance

export const fetchContributions = async () => {
  console.log('📦 Fetching GitHub contributions from /github/contributions');

  const { data } = await axios.get('/github/contributions');

  console.log('📊 Received contributions data:', data);

  return data;
};
