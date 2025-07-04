import React, { useEffect, useState } from 'react';

interface LeadershipEntry {
  title: string;
  info: string;
}

const Leadership: React.FC = () => {
  const [entries, setEntries] = useState<LeadershipEntry[]>([]);

  useEffect(() => {
    fetch('/api/leadership')
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error('Failed to fetch leadership data', err));
  }, []);

  return (
    <div className="about-section">
      <h2 className="section-title">Leadership & Community</h2>
      <ul className="list-inside list-disc">
        {entries.map((entry, index) => (
          <li key={index} className="community-entry">
            <strong>{entry.title}</strong>
            {entry.info && `, ${entry.info}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leadership;
