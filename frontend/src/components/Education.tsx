import React, { useEffect, useState } from 'react';

interface EducationEntry {
  degree: string;
  institution: string;
  link?: string;
}

const EducationSection: React.FC = () => {
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch('/api/education');
        if (!res.ok) throw new Error('Failed to fetch education');
        const data = await res.json();
        setEducation(data);
      } catch (err: any) {
        console.error(err);
        setError('Could not load education history.');
      }
    };

    fetchEducation();
  }, []);

  return (
    <div className="about-section">
      <h2 className="section-title">Education</h2>
      <div className="education-list">
        {error && <p className="error">{error}</p>}
        {education.map((entry, index) => (
          <div key={index} className="education-entry">
            <h3 className="degree">{entry.degree}</h3>
            <p className="school">
              {entry.link ? (
                <a href={entry.link} target="_blank" rel="noopener noreferrer">
                  {entry.institution}
                </a>
              ) : (
                entry.institution
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
