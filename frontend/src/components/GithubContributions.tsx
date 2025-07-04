import React, { useEffect, useState } from 'react';
import { fetchContributions } from '../services/githubService';
import ContributionCalendar from './ContributionCalendar';
import type { GitHubContributionsData } from '../types/GitHubContributions';

const GithubContributions: React.FC = () => {
  const [data, setData] = useState<GitHubContributionsData | null>(null);

  useEffect(() => {
    fetchContributions().then(setData).catch(console.error);
  }, []);

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold">GitHub Contributions</h2>
      {data ? (
        <ContributionCalendar contributions={data.contributions} />
      ) : (
        <p>Loading contributions...</p>
      )}
    </div>
  );
};

export default GithubContributions;
