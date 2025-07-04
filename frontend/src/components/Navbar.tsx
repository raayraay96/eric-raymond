import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo"></div>

      <nav className="navbar-links" role="navigation" aria-label="Main navigation">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/about" className="navbar-link">
          About
        </Link>
        <a href="#featured" className="navbar-link">
          Featured
        </a>
        <Link to="/portfolio" className="navbar-link">
          Portfolio
        </Link>
        <a href="#blog" className="navbar-link">
          Blog
        </a>
        <a href="#contact" className="navbar-link">
          Contact
        </a>
      </nav>

      <div className="navbar-socials">
        <a href="#" className="navbar-icon">
          <i className="fab fa-twitter" />
        </a>
        <a href="#" className="navbar-icon">
          <i className="fab fa-dribbble" />
        </a>
        <a href="#" className="navbar-icon">
          <i className="fab fa-linkedin" />
        </a>
      </div>
    </header>
  );
};

export default Navbar;
