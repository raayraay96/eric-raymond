// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<div className="p-6 text-red-400">Page not found</div>} />
      </Routes>
    </main>
  );
}

export default App;
