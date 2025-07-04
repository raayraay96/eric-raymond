// Static data service for fetching from public JSON files
const BASE_PATH = '/data';

export const dataService = {
  // Fetch projects/timeline data
  async getProjects() {
    const response = await fetch(`${BASE_PATH}/projects.json`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Fetch skills data
  async getSkills() {
    const response = await fetch(`${BASE_PATH}/skills.json`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return response.json();
  },

  // Fetch jobs/experience data
  async getJobs() {
    const response = await fetch(`${BASE_PATH}/jobs.json`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  // Fetch education data
  async getEducation() {
    const response = await fetch(`${BASE_PATH}/education.json`);
    if (!response.ok) throw new Error('Failed to fetch education');
    return response.json();
  },

  // Fetch leadership data
  async getLeadership() {
    const response = await fetch(`${BASE_PATH}/leadership.json`);
    if (!response.ok) throw new Error('Failed to fetch leadership');
    return response.json();
  },

  // Fetch mock projects for portfolio section
  async getMockProjects() {
    const response = await fetch(`${BASE_PATH}/mockProjects.json`);
    if (!response.ok) throw new Error('Failed to fetch mock projects');
    return response.json();
  },

  // GitHub contributions - still needs external API
  async getGitHubContributions(username: string = 'Raymond-Christopher') {
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}`
      );
      if (!response.ok) throw new Error('Failed to fetch GitHub contributions');
      return response.json();
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      return null;
    }
  }
};
