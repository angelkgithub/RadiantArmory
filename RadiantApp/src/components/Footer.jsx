import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-valorant-primary border-t border-valorant-accent border-opacity-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
              RADIANT
            </div>
            <p className="text-valorant_light text-opacity-60 text-sm">
              Your ultimate Valorant weapon and skin encyclopedia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/weapons" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Weapons
                </Link>
              </li>
              <li>
                <Link to="/skins" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Skins
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">RESOURCES</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://valorant-api.com/" target="_blank" rel="noopener noreferrer" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Valorant API
                </a>
              </li>
              <li>
                <a href="https://playvalorant.com/" target="_blank" rel="noopener noreferrer" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Official Valorant
                </a>
              </li>
              <li>
                <a href="https://valorant.fandom.com/" target="_blank" rel="noopener noreferrer" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                  Valorant Wiki
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-4">CONNECT</h3>
            <div className="flex gap-4">
              <a href="#" className="text-valorant-accent hover:text-valorant-gold transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.029 3.746 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-valorant-accent hover:text-valorant-gold transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.6915026,1.96585061 L15.1156967,13.3139876 C15.0098938,14.0654849 14.5236589,14.5080721 13.9197426,14.5080721 L7.2584259,14.5080721 C6.69629068,14.5080721 6.13399899,14.0654849 6.02844343,13.3139876 L4.45266271,1.96585061 C4.32146963,0.827061184 4.9176397,-0.0345714763 5.98525312,-0.0345714763 L14.2352132,-0.0345714763 C15.3123201,-0.0345714763 15.8224889,0.827061184 15.6912957,1.96585061 Z" />
                </svg>
              </a>
              <a href="#" className="text-valorant-accent hover:text-valorant-gold transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.545 2.914 1.209.092-.937.349-1.546.636-1.9-2.22-.253-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.812c.852.004 1.71.114 2.513.336 1.909-1.294 2.747-1.025 2.747-1.025.545 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.193 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-valorant-accent border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-valorant_light text-opacity-60 text-sm">
              © 2024 Radiant Armory. Data powered by{' '}
              <a href="https://valorant-api.com/" target="_blank" rel="noopener noreferrer" className="text-valorant-accent hover:underline">
                Valorant API
              </a>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-valorant_light text-opacity-60 hover:text-valorant-accent transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
