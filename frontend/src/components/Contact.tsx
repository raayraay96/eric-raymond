import { motion } from 'framer-motion';

const Contact = () => {
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
            Contact Me
          </span>
        </h3>
        <div className="max-w-2xl mx-auto">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input type="text" placeholder="Your Name" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400" />
              <input type="email" placeholder="Your Email" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400" />
            </div>
            <textarea placeholder="Your Message" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white w-full h-32 mb-6 focus:outline-none focus:border-blue-400"></textarea>
            <motion.button
              type="submit"
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="relative z-10">Send Message</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
