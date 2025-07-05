export interface GitHubContribution {
  date: string;
  count: number;
  level: number;
}

export interface GitHubContributionsData {
  contributions: GitHubContribution[];
  totalContributions: number;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}