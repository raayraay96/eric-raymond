// API service updated for static site deployment
import { dataService } from './dataService';

// Re-export all data fetching functions from dataService
export const fetchProjects = dataService.getMockProjects;
export const fetchTimeline = dataService.getProjects;
export const fetchSkills = dataService.getSkills;
export const fetchJobs = dataService.getJobs;
export const fetchEducation = dataService.getEducation;
export const fetchLeadership = dataService.getLeadership;
export const fetchGitHubContributions = dataService.getGitHubContributions;

// Default export for backward compatibility
export default {
  fetchProjects,
  fetchTimeline,
  fetchSkills,
  fetchJobs,
  fetchEducation,
  fetchLeadership,
  fetchGitHubContributions
};
