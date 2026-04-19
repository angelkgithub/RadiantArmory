import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#111823] border-b border-[#ff4654] border-opacity-30 sticky top-0 z-50 w-full">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff4654]/50 to-transparent" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="text-2xl font-bold text-[#ff4654] tracking-wider">
              RADIANT
            </div>
            <span className="text-gray-500 text-xs tracking-widest uppercase">ARMORY</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
            <Link 
              to="/quiz" 
              className="relative group text-white hover:text-[#ff4654] transition-colors font-bold text-xs tracking-wider uppercase"
            >
              QUIZ
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff4654] to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/loadout" 
              className="relative group text-white hover:text-[#ff4654] transition-colors font-bold text-xs tracking-wider uppercase"
            >
              LOADOUT
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff4654] to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/strategy" 
              className="relative group text-white hover:text-[#ff4654] transition-colors font-bold text-xs tracking-wider uppercase"
            >
              STRATEGY
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff4654] to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/planner" 
              className="relative group text-white hover:text-[#ff4654] transition-colors font-bold text-xs tracking-wider uppercase"
            >
              PLANNER
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff4654] to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/collection" 
              className="relative group text-white hover:text-[#ff4654] transition-colors font-bold text-xs tracking-wider uppercase"
            >
              COLLECTION
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff4654] to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
            <button className="px-4 py-2 bg-[#ff4654] text-white font-bold rounded hover:bg-[#ba3a46] transition-all text-sm tracking-wider ml-2">
              🔍
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#ff4654] transition-colors flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#ff4654] border-opacity-30 mt-4 space-y-2">
            <Link 
              to="/quiz" 
              className="block py-2.5 px-3 text-white hover:text-[#ff4654] hover:bg-[#ff4654]/5 transition-colors font-bold text-xs tracking-wider uppercase rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              QUIZ
            </Link>
            <Link 
              to="/loadout" 
              className="block py-2.5 px-3 text-white hover:text-[#ff4654] hover:bg-[#ff4654]/5 transition-colors font-bold text-xs tracking-wider uppercase rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              LOADOUT
            </Link>
            <Link 
              to="/strategy" 
              className="block py-2.5 px-3 text-white hover:text-[#ff4654] hover:bg-[#ff4654]/5 transition-colors font-bold text-xs tracking-wider uppercase rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              STRATEGY
            </Link>
            <Link 
              to="/planner" 
              className="block py-2.5 px-3 text-white hover:text-[#ff4654] hover:bg-[#ff4654]/5 transition-colors font-bold text-xs tracking-wider uppercase rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              PLANNER
            </Link>
            <Link 
              to="/collection" 
              className="block py-2.5 px-3 text-white hover:text-[#ff4654] hover:bg-[#ff4654]/5 transition-colors font-bold text-xs tracking-wider uppercase rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              COLLECTION
            </Link>
            <button className="w-full mt-4 px-4 py-2.5 bg-[#ff4654] text-white font-bold rounded hover:bg-[#ba3a46] transition-all text-xs tracking-wider uppercase">
              🔍 SEARCH
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
