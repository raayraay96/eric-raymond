import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

interface Job {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await dataService.getJobs();
        setJobs(jobsData);
      } catch (err) {
        setError('Failed to load work experience data');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Work Experience</h2>
      
      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                <p className="text-gray-600">{job.location}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {job.start} - {job.end}
                </span>
              </div>
            </div>
            
            <ul className="space-y-2">
              {job.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;