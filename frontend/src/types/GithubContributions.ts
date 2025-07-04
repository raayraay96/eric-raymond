// src/types/GithubContributions.ts

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubContributionsData {
  total: Record<string, number>;
  contributions: GitHubContributionDay[];
}
