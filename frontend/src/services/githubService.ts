// services/githubService.ts
import { dataService } from './dataService';

export const fetchContributions = async () => {
  console.log('📦 Fetching GitHub contributions');
  
  // Use dataService instead of the old API
  const data = await dataService.getGitHubContributions();
  
  console.log('📊 Received contributions data:', data);
  
  return data;
};
