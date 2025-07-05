import { useState, useEffect } from 'react';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import RoboticArmScene from '../components/RoboticArmScene';
import { useMousePosition } from '../hooks/useMousePosition';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const mousePosition = useMousePosition();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  const [text, setText] = useState('');
  const fullText = 'AI/ML Developer & Robotics Engineer';
  
  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Animated Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-between px-8 lg:px-16">
        {/* Left Side - Content */}
        <motion.div 
          className="flex-1 max-w-3xl z-10"
          style={{ y: y1 }}
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-sm font-medium">Available for opportunities</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-6xl lg:text-8xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Eric
            </span>
            <br />
            <span className="text-white">Raymond</span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.div 
            className="h-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-2xl lg:text-3xl text-gray-300 font-light">
              {text}
              <span className="animate-pulse">|</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Developing next-generation{' '}
            <span className="text-blue-400 font-semibold">machine learning algorithms</span>{' '}
            for real-time robotic control. Specializing in{' '}
            <span className="text-purple-400 font-semibold">computer vision</span>,{' '}
            <span className="text-cyan-400 font-semibold">ROS systems</span>, and{' '}
            <span className="text-green-400 font-semibold">human-robot interaction</span>.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <span className="relative z-10">View Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button className="px-8 py-4 border-2 border-gray-600 rounded-xl font-semibold text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:bg-blue-400/10">
              Download Resume
            </button>
          </motion.div>

          {/* Tech Stack */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {['ROS', 'PyTorch', 'OpenCV', 'Python', 'Three.js', 'React'].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 cursor-default backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - 3D Robotic Arm */}
        <motion.div 
          className="flex-1 relative h-screen max-w-2xl z-20"
          style={{ y: y2 }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent rounded-3xl blur-3xl" />
          
          {/* 3D Scene Container */}
          <div className="relative h-full bg-slate-900/20 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden">
            <RoboticArmScene mousePosition={mousePosition} />
            
            {/* Interactive Overlay */}
            <div className="absolute top-6 left-6 right-6">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white font-semibold">Live Demo</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">Move your cursor to control the robotic arm</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>X: {mousePosition.x}px</span>
                  <span>Y: {mousePosition.y}px</span>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-blue-400 font-bold text-lg">6-DOF</div>
                    <div className="text-gray-500 text-xs">Joints</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold text-lg">60fps</div>
                    <div className="text-gray-500 text-xs">Rendering</div>
                  </div>
                  <div>
                    <div className="text-cyan-400 font-bold text-lg">Real-time</div>
                    <div className="text-gray-500 text-xs">IK Solver</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Research Highlights */}
      <section className="relative py-32 px-8 lg:px-16">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Research Impact
            </span>
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              className="group relative p-8 bg-slate-900/30 backdrop-filter backdrop-blur-lg border border-solid border-white/20 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105"
              whileHover={{ y: -10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">University of Wyoming REU</h4>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Significantly enhancing system responsiveness and used MonoDepth2 algorithms to generate real-time depth maps.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">PyTorch</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">GCP</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">Unity</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative p-8 bg-slate-900/30 backdrop-filter backdrop-blur-lg border border-solid border-white/20 rounded-3xl hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105"
              whileHover={{ y: -10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-cyan-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🥽</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">AR Research Assistant</h4>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Reduced latency by 15% through strategic architectural re-design.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">PyTorch</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">GCP</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">Unity</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;