// src/pages/About.tsx
import '../styles/About.css';
import Navbar from '../components/Navbar';
import Skills from '../components/skills';
import Jobs from '../components/jobs';
import Education from '../components/Education';
import Leadership from '../components/Leadership';

const About = () => {
  return (
    <>
      <Navbar />

      <section className="about-page overflow-y-scroll">
        <div className="about-container">
          <h1 className="about-title">Eric Raymond</h1>
          <p className="contact-line">
            📍 Indianapolis, IN | 📞 (317) 835-5211 | 📧 erraymon@iu.edu | 🌐{' '}
            <a
              href="https://linkedin.com/in/eric–raymond"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              LinkedIn
            </a>
          </p>

          {/* Summary */}
          <div className="about-section">
            <h2 className="section-title">Summary</h2>
            <p className="about-bio">
              AI/ML Developer specializing in robotics, computer vision, and human-robot interaction. 
              Currently developing machine learning control algorithms for real-time robotic imitation 
              at the University of Wyoming. Experienced in ROS, PyTorch, OpenCV, and full-stack development. 
              Passionate about creating intelligent systems that bridge the gap between humans and machines.
            </p>
          </div>

          {/* Technical Skills */}
          <Skills />
          {/* Experience */}
          <div className="about-section">
            <Jobs />
          </div>

          {/* Education */}
          <div className="about-section">
            <Education />
            <div className="education-entry mt-4">
              <h3 className="degree">Honors & Awards</h3>
              <p className="school">Dean's List, Academic Scholarship, Robotics Competition Awards</p>
            </div>
          </div>

          {/* Leadership */}
          <div className="about-section">
            <Leadership />
          </div>

          {/* Passions */}
          <div className="about-section">
            <h2 className="section-title">Research & Innovation</h2>
            <p className="about-bio">
              My work focuses on advancing the field of human-robot interaction through machine learning. 
              I'm particularly interested in developing systems that can understand and adapt to human behavior 
              in real-time, making robotics more accessible and intuitive for everyday use.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;