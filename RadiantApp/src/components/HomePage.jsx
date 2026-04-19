import { useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'AGENT QUIZ',
    description: 'Find your perfect agent match through a personalized quiz',
    link: '/quiz',
    image: 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776518659/1868865-2560x1440-desktop-hd-valorant-background_kpemf4.jpg',
    accent: '#ff4654',
  },
  {
    title: 'LOADOUT',
    description: 'Build and customize your weapon loadout with skins',
    link: '/loadout',
    image: 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776517270/1868807-3840x2160-desktop-4k-valorant-background-photo_fhmdy6.jpg',
    accent: '#5a9fd4',
  },
  {
    title: 'STRATEGY',
    description: 'Generate tactical agent compositions for any map',
    link: '/strategy',
    image: 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776518658/1868872-2560x1440-desktop-hd-valorant-wallpaper_hqytqi.jpg',
    accent: '#b052d9',
  },
  {
    title: 'MAP PLANNER',
    description: 'Draw strategies and plan agent positions on maps',
    link: '/planner',
    image: 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776518658/1868815-3840x2160-desktop-4k-valorant-wallpaper_psr8mp.jpg',
    accent: '#f5a623',
  },
  {
    title: 'COLLECTION',
    description: 'Browse the full skin library and agent roster',
    link: '/collection',
    image: 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776518658/1869238-3840x2160-desktop-4k-valorant-background-image_wx0cgg.jpg',
    accent: '#2dd4a8',
  },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <main className="min-h-screen bg-[#111823] overflow-hidden">

      {/* =========== HERO — Expanding Hover Cards =========== */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #ff4654 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#ff4654]/5 rounded-full blur-[180px]" />

        {/* Header text */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center mb-12">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff4654]/10 border border-[#ff4654]/20 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse" />
              <span className="text-[#ff4654] text-sm font-medium tracking-wider uppercase">Valorant Companion</span>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">RADIANT</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4654] to-[#ff8a93]">ARMORY</span>
          </h1>
          <div className="flex justify-center">
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
              Build your playstyle, master strategies, and dominate the competition
            </p>
          </div>
        </div>

        {/* ===== Expanding Cards - Full Width ===== */}
        <div
          className="relative z-10 flex h-[420px] sm:h-[480px] md:h-[520px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50 gap-0.5 mt-12"
          onMouseLeave={() => setActiveIndex(null)}
        >
            {features.map((card, i) => {
              const isActive = activeIndex === i;
              const hasActive = activeIndex !== null;
              return (
                <Link
                  key={i}
                  to={card.link}
                  className="relative block overflow-hidden border-r border-white/5 last:border-r-0 flex-1 min-w-0"
                  style={{
                    flex: isActive ? '3 1 auto' : (hasActive ? '0.6 0 auto' : '1 1 auto'),
                    transition: 'flex 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {/* Background image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                    style={{
                      filter: isActive ? 'brightness(0.7)' : 'brightness(0.25)',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />

                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-500"
                    style={{
                      background: card.accent,
                      opacity: isActive ? 1 : 0.3,
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Vertical label (visible when collapsed) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-400"
                    style={{ opacity: isActive ? 0 : 1 }}
                  >
                    <span
                      className="text-white/70 font-black text-xs tracking-[0.3em] uppercase whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                      {card.title}
                    </span>
                  </div>

                  {/* Content overlay (visible when active) */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <div className="whitespace-nowrap">
                      <div
                        className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3"
                        style={{ color: card.accent, backgroundColor: `${card.accent}20`, border: `1px solid ${card.accent}40` }}
                      >
                        Explore Feature
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide mb-2">{card.title}</h2>
                      <p className="text-gray-400 text-sm">{card.description}</p>
                      <div className="flex items-center gap-2 mt-4 text-sm font-bold" style={{ color: card.accent }}>
                        <span>Enter</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Number badge */}
                  <div
                    className="absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? `${card.accent}25` : 'rgba(255,255,255,0.05)',
                      color: isActive ? card.accent : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${isActive ? `${card.accent}40` : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    0{i + 1}
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* =========== Footer =========== */}
      <footer className="relative px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black tracking-wider mb-1">
                <span className="text-white">RADIANT</span>{' '}
                <span className="text-[#ff4654]">ARMORY</span>
              </h3>
              <p className="text-gray-600 text-xs tracking-wider">Your Ultimate Valorant Companion</p>
            </div>

            <div className="flex items-center gap-6">
              {features.map((f, i) => (
                <Link
                  key={i}
                  to={f.link}
                  className="text-gray-500 text-xs font-medium tracking-wider hover:text-white transition-colors"
                >
                  {f.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-[11px] tracking-wider">
              © 2026 Radiant Armory. Built with React & Valorant API.
            </p>
            <p className="text-gray-700 text-[11px] tracking-wider">
              Not affiliated with Riot Games
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
