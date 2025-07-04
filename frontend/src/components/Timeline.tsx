import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import '../styles/Timeline.css';
import useTimelineData from '../hooks/useTimelineData';

const Timeline = () => {
  const { data: timelineData, loading, error } = useTimelineData();

  if (loading) return <p className="timeline-description">Loading...</p>;
  if (error) return <p className="timeline-description text-red-400">Error: {error}</p>;

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        <div className="timeline-line" />
        {timelineData.map((proj, i) => (
          <motion.div
            key={i}
            className="timeline-entry"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="timeline-header">
              <span className={`timeline-dot ${proj.category.toLowerCase()}`} />
              <span className="timeline-date">{proj.date}</span>
            </div>
            <h3 className="timeline-title">{proj.title}</h3>

            <ReactMarkdown
              components={{
                p: ({ ...props }) => <p className="timeline-description" {...props} />,
                ul: ({ ...props }) => (
                  <ul className="timeline-description list-disc pl-6" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-semibold text-white" {...props} />
                ),
              }}
            >
              {proj.description}
            </ReactMarkdown>

            <span className="timeline-category">{proj.category}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
