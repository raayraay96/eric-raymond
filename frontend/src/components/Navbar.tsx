const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#home" className="text-2xl font-bold text-blue-400">
          Eric Raymond
        </a>
        <div className="space-x-6">
          <a href="#home" className="hover:text-blue-400 transition-colors">
            Home
          </a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
