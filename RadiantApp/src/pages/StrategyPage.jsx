import { useState, useMemo } from 'react';
import { useGetAllMapsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

const STRATEGY_TEMPLATES = {
  'Aggressive-splitA': {
    playstyle: 'Aggressive Push',
    attack: 'Split A — Heavy pressure with 3 players rushing site while 2 hold flank.',
    defense: 'Aggressive retake setup — play close angles with early information.',
    tips: ['Use abilities for utility cleanup', 'Control main with early aggression', 'Stack flash/stun combos', 'Trade kills immediately'],
  },
  'Aggressive-splitB': {
    playstyle: 'Aggressive Push',
    attack: 'Split B — Full 5-man execute with coordinated utility.',
    defense: 'Stack B with crossfire positions. Leave one anchor on A.',
    tips: ['Plant smoke cover before entry', 'Use molly to clear corners', 'Never solo peek', 'Coordinate abilities'],
  },
  'Tactical-midControl': {
    playstyle: 'Tactical Control',
    attack: 'Mid Control — Take mid dominance to split the map.',
    defense: 'Hold mid with utility traps. Force enemies into predictable paths.',
    tips: ['Stagger positioning', 'Use info-gathering abilities', 'Coordinate rotations', 'Default first 30s'],
  },
  'Defensive-default': {
    playstyle: 'Defensive Setup',
    attack: 'Controlled default — Spread map pressure, gather info, then collapse.',
    defense: 'Anchor-based defense with 2-1-2 spread. Play retake if outnumbered.',
    tips: ['Set up crossfires', 'Hold angles patiently', 'Rotate on confirmed info', 'Save abilities for clutch'],
  },
};

function StrategyPage() {
  const [selectedMap, setSelectedMap] = useState(null);
  const [hoveredMap, setHoveredMap] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [warning, setWarning] = useState('');

  const { data: maps = [], isLoading: mapsLoading } = useGetAllMapsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  const playableMaps = useMemo(
    () => maps.filter(m => m.displayName && !['Range', 'Skirmish', 'Basic Training'].some(exclude => m.displayName.includes(exclude))),
    [maps]
  );

  const handleAgentToggle = (agent) => {
    setSelectedAgents(prev => {
      if (prev.find(a => a.uuid === agent.uuid)) {
        return prev.filter(a => a.uuid !== agent.uuid);
      }
      return prev.length < 5 ? [...prev, agent] : prev;
    });
  };

  const generateStrategy = () => {
    if (!selectedMap || selectedAgents.length < 5) {
      setWarning('Select a map and exactly 5 agents!');
      setTimeout(() => setWarning(''), 3000);
      return;
    }

    const isAggressive = selectedAgents.some(a => 
      ['Raze', 'Jett', 'Phoenix', 'Reyna'].includes(a.displayName)
    );
    const isTactical = selectedAgents.some(a => 
      ['Sova', 'Cypher', 'Fade'].includes(a.displayName)
    );

    let key = isAggressive 
      ? `Aggressive-${['splitA', 'splitB'][Math.floor(Math.random() * 2)]}` 
      : isTactical ? 'Tactical-midControl' : 'Defensive-default';

    setStrategy({
      map: selectedMap.displayName,
      mapSplash: selectedMap.splash,
      ...STRATEGY_TEMPLATES[key] || STRATEGY_TEMPLATES['Defensive-default'],
      agents: selectedAgents,
    });
  };

  if (mapsLoading || agentsLoading) return (
    <div className="min-h-screen bg-[#111823] flex items-center justify-center text-white italic tracking-widest uppercase">
      Loading Intel...
    </div>
  );

  if (strategy) {
    return (
      <div className="min-h-screen relative text-white bg-[#111823] flex flex-col items-center justify-center p-6">
        <img src={strategy.mapSplash} className="fixed inset-0 w-full h-full object-cover opacity-10" alt="" />
        <div className="relative z-10 w-full max-w-4xl text-center">
          <button onClick={() => setStrategy(null)} className="text-[#ff4654] font-black tracking-widest text-sm mb-6 hover:opacity-70 transition-all uppercase">
            ← Adjust Squad Selection
          </button>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-2">
            {strategy.map}
          </h1>
          <p className="text-[#ff4654] font-bold tracking-[0.4em] uppercase mb-12">Mission Briefing</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
              <h3 className="text-[#ff4654] font-black italic tracking-wider mb-4 uppercase">Attack Plan</h3>
              <p className="text-gray-300 leading-relaxed">{strategy.attack}</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
              <h3 className="text-blue-400 font-black italic tracking-wider mb-4 uppercase">Defense Setup</h3>
              <p className="text-gray-300 leading-relaxed">{strategy.defense}</p>
            </div>
          </div>

          <div className="bg-amber-400/10 p-8 rounded-3xl border border-amber-400/20 backdrop-blur-md text-left">
            <h3 className="text-amber-400 font-black italic tracking-wider mb-6 uppercase">Tactical Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {strategy.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-amber-400 font-black">0{i+1}</span>
                  <p className="text-sm text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden">
      
      {/* Background Decorative Element */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4654] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-[#ff4654] font-black tracking-[0.5em] text-xs mb-4 uppercase">VALORANT STRAT</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">STRATEGY <span className="text-[#ff4654]">Generator</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: MAP SELECTION */}
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <div className="w-full text-center lg:text-left">
              <h2 className="text-2xl font-black italic uppercase tracking-wide flex items-center gap-4 justify-center lg:justify-start">
                <span className="text-[#ff4654] text-sm not-italic font-mono">01</span> Map Select
              </h2>
            </div>

            <div className="w-full relative group">
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-[#ff4654] transition-all appearance-none cursor-pointer font-bold uppercase tracking-widest text-sm"
                value={selectedMap?.uuid || ''}
                onChange={(e) => {
                  const map = playableMaps.find(m => m.uuid === e.target.value);
                  setSelectedMap(map);
                }}
              >
                <option value="" className="bg-[#111823]">Choose Battlefield</option>
                {playableMaps.map(m => (
                  <option key={m.uuid} value={m.uuid} className="bg-[#111823]">{m.displayName}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>

            {/* Map Preview Card */}
            <div className="w-full relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
              <img 
                src={selectedMap?.splash || hoveredMap?.splash || 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776654326/clove_fznmrp.jpg'} 
                className={`w-full h-full object-cover transition-all duration-1000 ${selectedMap ? 'scale-100 opacity-100' : 'scale-125 opacity-20 grayscale'}`}
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111823] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter truncate">
                  {selectedMap?.displayName || 'Intel Awaited'}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT: AGENT SELECTION */}
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <div className="w-full flex justify-between items-center px-2">
              <h2 className="text-2xl font-black italic uppercase tracking-wide flex items-center gap-4">
                <span className="text-[#ff4654] text-sm not-italic font-mono">02</span> Squad
              </h2>
              <p className={`font-mono font-bold ${selectedAgents.length === 5 ? 'text-emerald-400' : 'text-gray-600'}`}>
                {selectedAgents.length} / 5
              </p>
            </div>

            {/* Vertical Player List */}
            <div className="w-full space-y-3">
              {[...Array(5)].map((_, i) => {
                const agent = selectedAgents[i];
                return (
                  <div key={i} className={`flex items-center gap-5 p-3 rounded-2xl border transition-all duration-300 ${agent ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-dashed border-white/5'}`}>
                    <div className="w-12 h-12 bg-black/40 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                      {agent && <img src={agent.displayIcon} className="w-full h-full object-contain" alt="" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-black italic uppercase text-sm ${agent ? 'text-white' : 'text-gray-800'}`}>
                        {agent?.displayName || 'Waiting...'}
                      </p>
                      <p className="text-[9px] tracking-[0.2em] text-[#ff4654] font-black uppercase">
                        {agent?.role?.displayName || 'Assign Agent'}
                      </p>
                    </div>
                    {agent && (
                      <button onClick={() => handleAgentToggle(agent)} className="px-4 text-gray-500 hover:text-[#ff4654] transition-colors">✕</button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compact Agent Grid */}
            <div className="w-full grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-8 gap-2 p-4 bg-white/[0.02] rounded-[2rem] border border-white/5 backdrop-blur-sm">
              {agents.map(agent => {
                const isSelected = selectedAgents.find(a => a.uuid === agent.uuid);
                return (
                  <button
                    key={agent.uuid}
                    onClick={() => handleAgentToggle(agent)}
                    className={`relative aspect-square rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isSelected ? 'bg-[#ff4654] border-[#ff4654] shadow-[0_0_15px_rgba(255,70,84,0.4)]' : 'bg-white/5 border border-white/10 grayscale hover:grayscale-0'}`}
                  >
                    <img src={agent.displayIcon} className="p-1" alt={agent.displayName} />
                  </button>
                );
              })}
            </div>

            {warning && <p className="text-[#ff4654] w-full text-center font-black italic tracking-widest text-xs animate-pulse uppercase">{warning}</p>}

            <button 
              onClick={generateStrategy}
              className="w-full group relative h-16 bg-[#ff4654] rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:grayscale mt-4"
              disabled={!selectedMap || selectedAgents.length < 5}
            >
              <span className="relative z-10 font-black italic tracking-[0.3em] text-lg uppercase">Initiate Tactical Protocol</span>
              <div className="absolute inset-0 bg-white translate-y-16 group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategyPage;