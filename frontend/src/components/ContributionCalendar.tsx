import React, { useState, useMemo, useEffect } from 'react';
import type { GitHubContribution } from '../types/GithubContributions';
import '../styles/ContributionCalendar.css';
import { motion } from 'framer-motion';

const WEEKDAYS = ['Mon', 'Wed', 'Fri'];
// TODO: Use with the month labels. Right now they are messed up.
// const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Props = {
  contributions: GitHubContribution[];
};

const ContributionCalendar: React.FC<Props> = ({ contributions }) => {
  const [year, setYear] = useState('2025');
  const [pulseEnabled, setPulseEnabled] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setPulseEnabled(false), 3000);
    return () => clearTimeout(timeout);
  }, [year]); // Reset pulse on year switch

  const filtered = useMemo(
    () => contributions.filter((d) => d.date.startsWith(year)),
    [contributions, year]
  );

  const weeks: GitHubContribution[][] = [];
  for (let i = 0; i < filtered.length; i += 7) {
    weeks.push(filtered.slice(i, i + 7));
  }

  const yearsAvailable = Array.from(new Set(contributions.map((c) => c.date.slice(0, 4))));

  return (
    <div className="contribution-calendar">
      {/* Year Buttons */}
      <div className="year-button-container">
        {yearsAvailable.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`year-button ${y === year ? 'active' : ''}`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Weekday Labels */}
        <div className="weekday-labels">
          {WEEKDAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={year}
          className="grid-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {weeks.map((week, i) => (
            <div key={i} className="week-column">
              {week.map((day, j) => {
                let level = 0;
                if (day.count >= 20) level = 4;
                else if (day.count >= 10) level = 3;
                else if (day.count >= 5) level = 2;
                else if (day.count >= 1) level = 1;

                const isRecent =
                  pulseEnabled && new Date(day.date) > new Date(Date.now() - 7 * 86400000);
                const delay = i * 10 + j * 5;

                return (
                  <div
                    key={day.date}
                    className={`contribution-cell bg-${level} animate-fade-in opacity-0 ${
                      isRecent ? 'animate-pulse' : ''
                    }`}
                    style={{ animationDelay: `${delay}ms` }}
                  />
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ContributionCalendar;