import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects } from '../services/api';

type Project = {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  sourceUrl: string;
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} {...p} />
      ))}
    </div>
  );
}

export default App;
