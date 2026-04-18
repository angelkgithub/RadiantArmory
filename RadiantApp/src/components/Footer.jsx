import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] border-t border-white/10 mt-20 w-full">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-10 text-center items-start justify-items-center">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="text-xl sm:text-2xl font-black text-[#ff4654] mb-2">
              RADIANT <span className="text-white">ARMORY</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-[220px] mx-auto">
              Your ultimate Valorant weapon and skin encyclopedia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Agent Quiz
                </Link>
              </li>
              <li>
                <Link to="/loadout" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Loadout Builder
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="https://valorant-api.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Valorant API
                </a>
              </li>
              <li>
                <a href="https://playvalorant.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Official Valorant
                </a>
              </li>
              <li>
                <a href="https://valorant.fandom.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                  Valorant Wiki
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-4 justify-center">
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.029 3.746 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.6915026,1.96585061 L15.1156967,13.3139876 C15.0098938,14.0654849 14.5236589,14.5080721 13.9197426,14.5080721 L7.2584259,14.5080721 C6.69629068,14.5080721 6.13399899,14.0654849 6.02844343,13.3139876 L4.45266271,1.96585061 C4.32146963,0.827061184 4.9176397,-0.0345714763 5.98525312,-0.0345714763 L14.2352132,-0.0345714763 C15.3123201,-0.0345714763 15.8224889,0.827061184 15.6912957,1.96585061 Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.545 2.914 1.209.092-.937.349-1.546.636-1.9-2.22-.253-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.812c.852.004 1.71.114 2.513.336 1.909-1.294 2.747-1.025 2.747-1.025.545 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.193 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <p className="text-gray-500 text-[10px] sm:text-xs text-center">
              © 2024 Radiant Armory. Data powered by{' '}
              <a href="https://valorant-api.com/" target="_blank" rel="noopener noreferrer" className="text-[#ff4654] hover:underline">
                Valorant API
              </a>
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff4654] transition-colors text-xs sm:text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
