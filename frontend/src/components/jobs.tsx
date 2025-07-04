// src/components/Jobs.tsx
import { useEffect, useState } from 'react';
import type { Job } from '../types/Job';

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Failed to fetch jobs:', err));
  }, []);

  return (
    <div className="about-section">
      <h2 className="section-title">Experience</h2>

      <div className="experience-section">
        {jobs.map((job, index) => (
          <div key={index} className="job-entry">
            <h3 className="job-title">{job.title}</h3>
            <p className="job-meta">
              {job.company} — {job.location} | {job.start} – {job.end}
            </p>
            <ul className="job-list">
              {job.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
