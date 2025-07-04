import '../styles/Home.css';
import placeholderImg from '../assets/placeholder-face.png';
import Navbar from '../components/Navbar';
import RoboticArmScene from '../components/RoboticArmScene';
import { useMousePosition } from '../hooks/useMousePosition';
import { motion } from 'framer-motion';

const Home = () => {
  const mousePosition = useMousePosition();

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="home-wrapper">
        <section className="relative flex h-screen flex-col justify-between py-8 md:flex-row md:items-center overflow-hidden">
          
          {/* Left Side - Profile & Info */}
          <div className="relative z-10 flex w-full flex-col justify-center px-6 md:w-1/2 md:px-12">
            <div className="flex w-full justify-center md:justify-start mb-8">
              <motion.img 
                src={placeholderImg} 
                alt="Eric Raymond - AI/ML Developer" 
                className="hero-image w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-blue-500 shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>
            
            <motion.div 
              className="text-group text-center md:text-left"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Eric Raymond
              </h1>
              <h2 className="text-xl md:text-2xl text-blue-400 mb-6 font-semibold">
                AI/ML Developer & Robotics Engineer
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Specialized in <span className="text-green-400 font-semibold">ROS</span>, 
                <span className="text-purple-400 font-semibold"> Computer Vision</span>, and 
                <span className="text-yellow-400 font-semibold"> Human-Robot Interaction</span>. 
                Currently developing machine learning control algorithms for real-time robotic imitation.
              </p>
              
              {/* Tech Skills Badges */}
              <motion.div 
                className="flex flex-wrap gap-3 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">ROS</span>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">PyTorch</span>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">OpenCV</span>
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">Python</span>
                <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-medium">Three.js</span>
              </motion.div>
              
              {/* Interactive Demo Notice */}
              <motion.div 
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Interactive Demo:</strong> Move your cursor to control the robotic arm →
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Interactive 3D Robotic Arm */}
          <motion.div 
            className="relative w-full h-96 md:w-1/2 md:h-full"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent rounded-lg"></div>
            
            {/* 3D Scene */}
            <RoboticArmScene mousePosition={mousePosition} />
            
            {/* Info overlay */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-300 mb-1">
                <strong className="text-white">Real-time IK Simulation</strong>
              </p>
              <p className="text-xs text-gray-400">
                Mouse X: {mousePosition.x.toFixed(0)}px | Y: {mousePosition.y.toFixed(0)}px
              </p>
            </div>
          </motion.div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 px-6 md:px-12 bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Research Experience
            </motion.h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gray-900/50 rounded-lg p-6 border border-gray-700"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-blue-400 mb-3">University of Wyoming REU</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Developed machine learning control algorithms for real-time robotic imitation, 
                  enhancing system responsiveness by 40%. Integrated MonoDepth2 algorithms for 
                  depth perception and human motion mimicking.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900/50 rounded-lg p-6 border border-gray-700"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-green-400 mb-3">AR Research Assistant</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Developed "Nano Vision" AR application using Unity and C#, creating interactive 
                  educational modules with ARKit. Designed accessibility features for inclusive 
                  STEM education.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;