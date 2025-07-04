import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects } from '../services/api';
import type { Project } from '../models/Project';

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <section id="projects" className="mt-12">
      <h2 className="mb-4 text-2xl font-semibold">Featured Projects</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects
          .filter((p) => p.featured)
          .map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
