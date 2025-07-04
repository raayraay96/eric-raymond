// frontend/src/pages/Portfolio.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import GithubContributions from '../components/GithubContributions';
import Timeline from '../components/Timeline';

const Portfolio: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="portfolio-page p-6">
        <h1 className="mb-4 text-3xl font-bold">My Portfolio</h1>
        <GithubContributions />
        <h2 className="mt-10 text-2xl font-semibold">Project Timeline</h2>
        <Timeline />
      </div>
    </>
  );
};

export default Portfolio;
