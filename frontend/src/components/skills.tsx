import React, { useEffect, useState } from 'react';
import PowerBar from '../components/powerBar';

type Skill = {
  name: string;
  level: number;
};

type SkillCategory = {
  category: string;
  skills: Skill[];
};

const Skills: React.FC = () => {
  const [data, setData] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((skills) => {
        setData(skills);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch skills:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading skills...</p>;

  return (
    <div className="about-section">
      <h2 className="section-title">Technical Skills</h2>
      <ul className="skills-list">
        {data.map((category) => (
          <li className="skill-entry" key={category.category}>
            <span className="skill-category">{category.category}:</span>
            <ul className="nested-skill-list">
              {category.skills.map((skill: { name: string; level: number }) => (
                <li key={skill.name}>
                  <PowerBar label={skill.name} level={skill.level} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
