import { Link } from 'react-router-dom';
import { useGetAllAgentsQuery } from '../services/valorantApi';

export default function HomePage() {
  const { data: agents = [] } = useGetAllAgentsQuery();

  const features = [
    {
      title: 'BEST AGENT QUIZ',
      description: 'Take a personalized quiz to find your perfect agent',
      icon: '🧠',
      link: '/quiz',
      color: 'from-[#ff4654] to-[#ba3a46]',
    },
    {
      title: 'LOADOUT BUILDER',
      description: 'Create and customize your perfect weapon loadout',
      icon: '🎨',
      link: '/loadout',
      color: 'from-[#ff4654] to-[#ba3a46]',
    },
    {
      title: 'STRATEGY GENERATOR',
      description: 'Generate tactical strategies for any map',
      icon: '🧠',
      link: '/strategy',
      color: 'from-[#ff4654] to-[#ba3a46]',
    },
    {
      title: 'INTERACTIVE MAP PLANNER',
      description: 'Draw and plan strategies on in-game maps',
      icon: '🎯',
      link: '/planner',
      color: 'from-[#ff4654] to-[#ba3a46]',
    },
    {
      title: 'SKIN COLLECTION TRACKER',
      description: 'Track and rate your skin collection',
      icon: '💎',
      link: '/collection',
      color: 'from-[#ff4654] to-[#ba3a46]',
    },
  ];

  return (
    <main className="min-h-screen bg-[#111823]">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-2 sm:px-4 overflow-hidden flex justify-center items-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4654] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-0 w-96 h-96 bg-[#ff4654] opacity-5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 text-white leading-tight">
              RADIANT
              <br />
              <span className="text-[#ff4654]">ARMORY</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto px-2">
              Your ultimate Valorant companion. Build your playstyle, master strategies, and dominate the competition.
            </p>

            <Link
              to="/quiz"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#ff4654] text-white font-bold text-sm sm:text-lg hover:bg-[#ba3a46] transition-all rounded hover:scale-105 transform"
            >
              START YOUR JOURNEY →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-2 sm:px-4 py-20 flex justify-center items-center">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">CORE FEATURES</h2>
            <div className="h-1 w-20 bg-[#ff4654] mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative overflow-hidden rounded-lg w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-xs"
              >
                <div className={`bg-gradient-to-br ${feature.color} opacity-50 p-6 sm:p-8 h-full border-2 border-[#ff4654] hover:opacity-70 transition-all duration-300 rounded-lg`}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4">{feature.description}</p>
                  <div className="flex items-center text-[#ff4654] font-bold group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agents */}
      <section className="w-full px-2 sm:px-4 py-20 flex justify-center items-center">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">FEATURED AGENTS</h2>
            <div className="h-1 w-20 bg-[#ff4654] mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {agents.slice(0, 5).map(agent => (
              <div
                key={agent.uuid}
                className="group bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-4 sm:p-6 rounded-lg hover:opacity-80 transition-all duration-300 text-center cursor-pointer w-full sm:w-[calc(50%-8px)] lg:w-[calc(20%-12px)] max-w-xs"
              >
                {agent.displayIcon && (
                  <img
                    src={agent.displayIcon}
                    alt={agent.displayName}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                )}
                <h3 className="text-white font-bold text-base sm:text-lg mb-1">{agent.displayName}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{agent.role?.displayName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-[#ff4654]/20 to-[#ba3a46]/20 border-t border-[#ff4654] border-opacity-30 py-16 w-full">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-[#ff4654] mb-2">5+</p>
              <p className="text-xs sm:text-base text-gray-300">Core Features</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-[#ff4654] mb-2">18+</p>
              <p className="text-xs sm:text-base text-gray-300">Playable Agents</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-[#ff4654] mb-2">10+</p>
              <p className="text-xs sm:text-base text-gray-300">Maps</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-bold text-[#ff4654] mb-2">∞</p>
              <p className="text-xs sm:text-base text-gray-300">Possibilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-2 sm:px-4 py-16 sm:py-20 flex justify-center items-center">
        <div className="w-full max-w-7xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">READY TO DOMINATE?</h2>
          <p className="text-base sm:text-xl text-gray-300 mb-8 px-2">
            Start your journey with Radiant Armory today
          </p>
          <Link
            to="/quiz"
            className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-[#ff4654] text-white font-bold text-sm sm:text-lg hover:bg-[#ba3a46] transition-all rounded hover:scale-105 transform"
          >
            TAKE THE QUIZ NOW
          </Link>
        </div>
      </section>
    </main>
  );
}
