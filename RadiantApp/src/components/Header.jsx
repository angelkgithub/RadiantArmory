import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-valorant-primary border-b border-valorant-accent border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              RADIANT
            </div>
            <span className="text-valorant-accent text-sm">Armory</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Weapons
            </Link>
            <Link 
              to="/" 
              className="text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Skins
            </Link>
            <Link 
              to="/" 
              className="text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Agents
            </Link>
            <button className="valorant-btn">
              Shop
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-valorant_light hover:text-valorant-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-valorant-accent border-opacity-20 mt-4">
            <Link 
              to="/" 
              className="block py-2 text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Weapons
            </Link>
            <Link 
              to="/" 
              className="block py-2 text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Skins
            </Link>
            <Link 
              to="/" 
              className="block py-2 text-valorant_light hover:text-valorant-accent transition-colors"
            >
              Agents
            </Link>
            <button className="valorant-btn w-full mt-4">
              Shop
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
