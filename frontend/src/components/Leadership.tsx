import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

interface Leadership {
  title: string;
  info: string;
}

const Leadership = () => {
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const leadershipData = await dataService.getLeadership();
        setLeadership(leadershipData);
      } catch (err) {
        setError('Failed to load leadership data');
        console.error('Error fetching leadership:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
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
      <h2 className="text-3xl font-bold text-center mb-8">Leadership Experience</h2>
      
      <div className="space-y-6">
        {leadership.map((leader, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{leader.title}</h3>
                <p className="text-gray-700 leading-relaxed">{leader.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leadership;