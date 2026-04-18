import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#111823] border-b border-[#ff4654] border-opacity-30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold text-[#ff4654]">
              RADIANT
            </div>
            <span className="text-gray-400 text-sm">ARMORY</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/quiz" 
              className="text-white hover:text-[#ff4654] transition-colors font-bold text-sm"
            >
              QUIZ
            </Link>
            <Link 
              to="/loadout" 
              className="text-white hover:text-[#ff4654] transition-colors font-bold text-sm"
            >
              LOADOUT
            </Link>
            <Link 
              to="/strategy" 
              className="text-white hover:text-[#ff4654] transition-colors font-bold text-sm"
            >
              STRATEGY
            </Link>
            <Link 
              to="/planner" 
              className="text-white hover:text-[#ff4654] transition-colors font-bold text-sm"
            >
              PLANNER
            </Link>
            <Link 
              to="/collection" 
              className="text-white hover:text-[#ff4654] transition-colors font-bold text-sm"
            >
              COLLECTION
            </Link>
            <button className="px-4 py-2 bg-[#ff4654] text-white font-bold rounded hover:bg-[#ba3a46] transition-all">
              🔍
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#ff4654] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#ff4654] border-opacity-30 mt-4">
            <Link 
              to="/quiz" 
              className="block py-2 text-white hover:text-[#ff4654] transition-colors font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              QUIZ
            </Link>
            <Link 
              to="/loadout" 
              className="block py-2 text-white hover:text-[#ff4654] transition-colors font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              LOADOUT
            </Link>
            <Link 
              to="/strategy" 
              className="block py-2 text-white hover:text-[#ff4654] transition-colors font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              STRATEGY
            </Link>
            <Link 
              to="/planner" 
              className="block py-2 text-white hover:text-[#ff4654] transition-colors font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              PLANNER
            </Link>
            <Link 
              to="/collection" 
              className="block py-2 text-white hover:text-[#ff4654] transition-colors font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              COLLECTION
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
