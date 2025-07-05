import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400">
          Eric Raymond
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className={`hover:text-blue-400 transition-colors ${
              location.pathname === '/' ? 'text-blue-400' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hover:text-blue-400 transition-colors ${
              location.pathname === '/about' ? 'text-blue-400' : ''
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;