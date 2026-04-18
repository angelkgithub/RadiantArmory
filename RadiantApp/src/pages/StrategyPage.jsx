import { useState, useMemo } from 'react';
import { useGetAllMapsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

const STRATEGY_TEMPLATES = {
  'Aggressive-splitA': {
    playstyle: 'Aggressive Push',
    attack: 'Split A - Heavy pressure with 3 players',
    defense: 'Split defense with early rotates',
    tips: ['Use agent abilities for utility cleanup', 'Control the main approach', 'Stack agents with similar abilities'],
  },
  'Aggressive-splitB': {
    playstyle: 'Aggressive Push',
    attack: 'Split B - Coordinated stack',
    defense: 'Defensive positioning on B site',
    tips: ['Plant smoke cover first', 'Use utilities to deny entry', 'Rotate with map control'],
  },
  'Tactical-midControl': {
    playstyle: 'Tactical Control',
    attack: 'Mid Control - Map pressure strategy',
    defense: 'Hold mid and deny enemy rotations',
    tips: ['Stagger positioning', 'Use info-gathering abilities', 'Coordinate rotations'],
  },
  'Defensive-default': {
    playstyle: 'Defensive Setup',
    attack: 'Execute from default -controlled pace',
    defense: 'Default setup with rotations',
    tips: ['Set up crossfires', 'Hold key positions', 'Rotate based on info'],
  },
};

function StrategyPage() {
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const { data: maps = [], isLoading: mapsLoading } = useGetAllMapsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  const playableMaps = useMemo(
    () => maps.filter(m => m.displayName && !m.displayName.includes('Range')),
    [maps]
  );

  const handleAgentToggle = (agent) => {
    setSelectedAgents(prev =>
      prev.find(a => a.uuid === agent.uuid)
        ? prev.filter(a => a.uuid !== agent.uuid)
        : [...prev, agent]
    );
  };

  const generateStrategy = () => {
    if (!selectedMap || selectedAgents.length === 0) return;

    const isAggressive = selectedAgents.some(a => 
      a.displayName?.includes('Raze') || a.displayName?.includes('Jett')
    );
    const site = ['splitA', 'splitB'][Math.floor(Math.random() * 2)];
    const key = `${isAggressive ? 'Aggressive' : 'Tactical'}-${site}`;
    
    setStrategy({
      map: selectedMap.displayName,
      ...STRATEGY_TEMPLATES[key] || STRATEGY_TEMPLATES['Defensive-default'],
      agents: selectedAgents.map(a => a.displayName),
    });
  };

  if (mapsLoading || agentsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          STRATEGY GENERATOR
        </h1>

        {!strategy ? (
          <div className="space-y-8">
            {/* Map Selection */}
            <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-[#ff4654] mb-4">SELECT MAP</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {playableMaps.map(map => (
                  <button
                    key={map.uuid}
                    onClick={() => setSelectedMap(map)}
                    className={`p-4 border-2 rounded transition-all duration-300 ${
                      selectedMap?.uuid === map.uuid
                        ? 'border-[#ff4654] bg-[#ff4654]/20'
                        : 'border-gray-600 bg-black/50 hover:border-[#ff4654]'
                    }`}
                  >
                    <div className="text-white font-bold text-center">
                      {map.displayName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Selection */}
            <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-[#ff4654] mb-4">
                SELECT AGENTS (Pick {Math.min(5, agents.length - 1)})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <button
                    key={agent.uuid}
                    onClick={() => handleAgentToggle(agent)}
                    className={`p-3 border-2 rounded transition-all duration-300 transform hover:scale-105 ${
                      selectedAgents.find(a => a.uuid === agent.uuid)
                        ? 'border-[#ff4654] bg-[#ff4654]/20'
                        : 'border-gray-600 bg-black/50 hover:border-[#ff4654]'
                    }`}
                  >
                    {agent.displayIcon && (
                      <img
                        src={agent.displayIcon}
                        alt={agent.displayName}
                        className="w-full h-20 object-contain mb-2"
                      />
                    )}
                    <div className="text-white font-bold text-xs text-center">
                      {agent.displayName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateStrategy}
              disabled={!selectedMap || selectedAgents.length === 0}
              className="w-full px-6 py-4 bg-[#ff4654] text-white font-bold text-lg hover:bg-[#ba3a46] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded"
            >
              GENERATE STRATEGY
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-8 rounded-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#ff4654] mb-2">
                {strategy.map}
              </h2>
              <p className="text-gray-300 text-lg">Your Team: {strategy.agents.join(', ')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/50 p-4 rounded">
                <h3 className="text-[#ff4654] font-bold mb-3 text-lg">PLAYSTYLE</h3>
                <p className="text-white text-2xl font-bold">{strategy.playstyle}</p>
              </div>

              <div className="bg-black/50 p-4 rounded">
                <h3 className="text-[#ff4654] font-bold mb-3 text-lg">ATTACK PLAN</h3>
                <p className="text-white">{strategy.attack}</p>
              </div>
            </div>

            <div className="bg-black/50 p-6 rounded mb-8">
              <h3 className="text-[#ff4654] font-bold mb-4 text-lg">DEFENSE PLAN</h3>
              <p className="text-white mb-4">{strategy.defense}</p>
            </div>

            <div className="bg-black/50 p-6 rounded mb-8">
              <h3 className="text-[#ff4654] font-bold mb-4 text-lg">ABILITY USAGE TIPS</h3>
              <ul className="space-y-2">
                {strategy.tips.map((tip, i) => (
                  <li key={i} className="text-white flex items-start">
                    <span className="text-[#ff4654] mr-3">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setStrategy(null)}
              className="w-full px-6 py-3 bg-[#ff4654] text-white font-bold hover:bg-[#ba3a46] transition-all rounded"
            >
              TRY ANOTHER STRATEGY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StrategyPage;
