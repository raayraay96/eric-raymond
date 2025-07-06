import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project 1',
    description: 'A brief description of your project.',
    technologies: ['React', 'TypeScript', 'Three.js'],
    link: '#',
  },
  {
    title: 'Project 2',
    description: 'A brief description of your project.',
    technologies: ['Python', 'ROS', 'OpenCV'],
    link: '#',
  },
  {
    title: 'Project 3',
    description: 'A brief description of your project.',
    technologies: ['PyTorch', 'GCP', 'Unity'],
    link: '#',
  },
];

const Projects = () => {
  return (
    <section className="py-32 px-8 lg:px-16">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="text-4xl lg:text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </span>
        </h3>
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-slate-900/30 backdrop-filter backdrop-blur-lg border border-solid border-white/20 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105"
              whileHover={{ y: -10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-white mb-4">{project.title}</h4>
                <p className="text-gray-400 leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <a href={project.link} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
