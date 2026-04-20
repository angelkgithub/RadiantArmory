import { useState, useMemo } from 'react';
import { useGetAllMapsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

const STRATEGY_TEMPLATES = {
  'Aggressive-splitA': {
    playstyle: 'Aggressive Push',
    attack: 'Split A — Heavy pressure with 3 players rushing site while 2 hold flank. Use flashes and smokes to overwhelm defenders.',
    defense: 'Aggressive retake setup — play close angles with early information. Rotate fast on contact.',
    tips: ['Use agent abilities for utility cleanup', 'Control the main approach with early aggression', 'Stack agents with flash/stun combos for entry', 'Trade kills immediately on contact'],
  },
  'Aggressive-splitB': {
    playstyle: 'Aggressive Push',
    attack: 'Split B — Full 5-man execute with coordinated utility. Smoke off flanks and flash site entry.',
    defense: 'Stack B with crossfire positions. Leave one anchor on A with fast rotate capability.',
    tips: ['Plant smoke cover before entry', 'Use molly/nade to clear corners post-plant', 'Rotate with map control — never solo peek', 'Coordinate abilities within 2-second windows'],
  },
  'Tactical-midControl': {
    playstyle: 'Tactical Control',
    attack: 'Mid Control — Take mid dominance to split the map. Gain info before committing to a site execute.',
    defense: 'Hold mid with utility traps. Force enemies into predictable paths and stack the weak side.',
    tips: ['Stagger positioning to avoid double-kills', 'Use info-gathering abilities every round', 'Coordinate rotations based on sound cues', 'Default positioning first 30 seconds then adapt'],
  },
  'Defensive-default': {
    playstyle: 'Defensive Setup',
    attack: 'Controlled default — Spread map pressure, gather info from 3 angles, then collapse on the weaker site.',
    defense: 'Anchor-based defense with 2-1-2 spread. Play retake if outnumbered — save utility for post-plant.',
    tips: ['Set up crossfires on every site', 'Hold angles patiently — let them come to you', 'Rotate based on confirmed info, not sound bait', 'Save abilities for clutch or retake rounds'],
  },
};

function StrategyPage() {
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [step, setStep] = useState(1);
  const [warning, setWarning] = useState('');
  const { data: maps = [], isLoading: mapsLoading } = useGetAllMapsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  const playableMaps = useMemo(
    () => maps.filter(m => m.displayName && !m.displayName.includes('Range') && !m.displayName.includes('Skirmish') && !m.displayName.includes('Basic Training')),
    [maps]
  );

  const handleAgentToggle = (agent) => {
    setSelectedAgents(prev =>
      prev.find(a => a.uuid === agent.uuid)
        ? prev.filter(a => a.uuid !== agent.uuid)
        : prev.length < 5 ? [...prev, agent] : prev
    );
  };

  const generateStrategy = () => {
    if (!selectedMap) return;
    if (selectedAgents.length < 5) {
      setWarning('You need exactly 5 agents to generate a strategy!');
      setTimeout(() => setWarning(''), 3000);
      return;
    }
    setWarning('');

    const isAggressive = selectedAgents.some(a =>
      a.displayName?.includes('Raze') || a.displayName?.includes('Jett') || a.displayName?.includes('Phoenix') || a.displayName?.includes('Reyna')
    );
    const isTactical = selectedAgents.some(a =>
      a.displayName?.includes('Sova') || a.displayName?.includes('Cypher') || a.displayName?.includes('Fade')
    );

    let key;
    if (isAggressive) {
      key = `Aggressive-${['splitA', 'splitB'][Math.floor(Math.random() * 2)]}`;
    } else if (isTactical) {
      key = 'Tactical-midControl';
    } else {
      key = 'Defensive-default';
    }

    setStrategy({
      map: selectedMap.displayName,
      mapSplash: selectedMap.splash,
      ...STRATEGY_TEMPLATES[key] || STRATEGY_TEMPLATES['Defensive-default'],
      agents: selectedAgents,
    });
  };

  const reset = () => {
    setStrategy(null);
    setSelectedMap(null);
    setSelectedAgents([]);
    setStep(1);
  };

  if (mapsLoading || agentsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ff4654] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Loading intel...</p>
        </div>
      </div>
    );
  }

  // ─── STRATEGY RESULT ────────────────────────────────
  if (strategy) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image */}
        <img src={strategy.mapSplash || 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776654326/clove_fznmrp.jpg'} alt="" className="fixed inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
        <div className="fixed inset-0 bg-[#111823]/80 backdrop-blur-sm" style={{ zIndex: 0 }} />

        <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[#ff4654] text-xs font-bold tracking-[0.3em] uppercase mb-3">Strategy Briefing</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider mb-6">
                {strategy.map}
              </h1>
            </div>

            {/* Selected Agents */}
            <div className="mb-8">
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] text-center mb-4">Your Squad</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                {strategy.agents.map(a => (
                  <div key={a.uuid} className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1a2332]/80">
                    <div className="aspect-[4/3] relative flex items-center justify-center p-3 bg-gradient-to-b from-white/[0.03] to-transparent">
                      {a.displayIcon && (
                        <img src={a.displayIcon} alt={a.displayName} className="w-full h-full object-contain drop-shadow-lg" />
                      )}
                    </div>
                    <div className="px-2 py-2 border-t border-white/5 bg-white/[0.02] text-center">
                      <p className="text-white font-bold text-xs sm:text-sm truncate">{a.displayName}</p>
                      {a.role?.displayName && (
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">{a.role.displayName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playstyle Badge */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#ff4654] to-[#ff6b6b] rounded-2xl blur-sm opacity-40"></div>
                <div className="relative bg-[#1a2332] border border-white/10 rounded-2xl px-8 py-4 text-center">
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-1">Playstyle</p>
                  <p className="text-white text-2xl sm:text-3xl font-black tracking-wider">{strategy.playstyle}</p>
                </div>
              </div>
            </div>

            {/* Attack & Defense Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Attack */}
              <div className="group relative bg-[#1a2332]/80 border border-white/5 rounded-2xl p-6 hover:border-[#ff4654]/20 transition-all duration-300">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4654]/30 rounded-tl-2xl"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ff4654]/10 border border-[#ff4654]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#ff4654]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#ff4654] text-[10px] font-bold uppercase tracking-[0.2em]">Attack Plan</p>
                    <p className="text-gray-500 text-[10px]">Offensive Strategy</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{strategy.attack}</p>
              </div>

              {/* Defense */}
              <div className="group relative bg-[#1a2332]/80 border border-white/5 rounded-2xl p-6 hover:border-blue-400/20 transition-all duration-300">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-2xl"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Defense Plan</p>
                    <p className="text-gray-500 text-[10px]">Defensive Strategy</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{strategy.defense}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#1a2332]/80 border border-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em]">Key Tips</p>
                  <p className="text-gray-500 text-[10px]">Ability Usage & Positioning</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strategy.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-bold mt-0.5">{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 max-w-2xl mx-auto">
              <button
                onClick={generateStrategy}
                className="group relative flex-1 py-5 overflow-hidden rounded-2xl font-black text-lg text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(255,70,84,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff4654] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 opacity-20 bg-[length:4px_4px]" style={{backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)'}}></div>
                <span className="relative flex items-center justify-center gap-3 tracking-[0.2em]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  RE-ROLL
                </span>
              </button>
              <button
                onClick={reset}
                className="flex-1 py-5 border border-white/10 text-gray-400 font-black text-lg rounded-2xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-[0.2em]"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SETUP FLOW ─────────────────────────────────────
  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <img src="https://res.cloudinary.com/dc3erz7jd/image/upload/v1776654326/clove_fznmrp.jpg" alt="" className="fixed inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-[#111823]/80" style={{ zIndex: 0 }} />

      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[#ff4654] text-xs font-bold tracking-[0.3em] uppercase mb-3">Tactical Planning</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-wider mb-3">
            STRATEGY
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff4654] to-[#ff6b6b] tracking-wider">
            GENERATOR
          </h1>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 1 ? 'w-12 bg-[#ff4654]' : 'w-6 bg-white/10'}`}></div>
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 2 ? 'w-12 bg-[#ff4654]' : 'w-6 bg-white/10'}`}></div>
          </div>
        </div>

        <div className="w-full flex-1">
          {/* Step 1: Map Selection */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-black text-xl sm:text-2xl tracking-wider">SELECT MAP</h2>
                  <p className="text-gray-500 text-xs mt-1">Choose your battlefield</p>
                </div>
                {selectedMap && (
                  <span className="text-[#ff4654] text-xs font-bold bg-[#ff4654]/10 border border-[#ff4654]/20 px-3 py-1.5 rounded-full">
                    {selectedMap.displayName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {playableMaps.map(map => (
                  <button
                    key={map.uuid}
                    onClick={() => setSelectedMap(map)}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.03] ${
                      selectedMap?.uuid === map.uuid
                        ? 'border-[#ff4654]/50 ring-1 ring-[#ff4654]/20'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="aspect-[16/10] relative">
                      {map.splash ? (
                        <img src={map.splash} alt={map.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1a2332]"></div>
                      )}
                      <div className={`absolute inset-0 transition-all duration-300 ${
                        selectedMap?.uuid === map.uuid
                          ? 'bg-[#ff4654]/20'
                          : 'bg-black/50 group-hover:bg-black/30'
                      }`}></div>
                      {selectedMap?.uuid === map.uuid && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ff4654] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-bold text-sm tracking-wide">{map.displayName}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => selectedMap && setStep(2)}
                  disabled={!selectedMap}
                  className={`group relative w-full sm:w-auto sm:min-w-[280px] px-12 py-5 overflow-hidden rounded-2xl font-black text-lg transition-all duration-300 ${
                    selectedMap
                      ? 'text-white hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(255,70,84,0.3)]'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedMap ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff4654] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 opacity-20 bg-[length:4px_4px]" style={{backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)'}}></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"></div>
                  )}
                  <span className="relative flex items-center justify-center gap-3 tracking-[0.2em] uppercase">
                    CONTINUE
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Agent Selection */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-black text-xl sm:text-2xl tracking-wider">SELECT AGENTS</h2>
                  <p className="text-gray-500 text-xs mt-1">Pick exactly 5 agents for your team</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  selectedAgents.length === 5
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    : selectedAgents.length >= 1
                    ? 'text-[#ff4654] bg-[#ff4654]/10 border-[#ff4654]/20'
                    : 'text-gray-500 bg-white/5 border-white/10'
                }`}>
                  {selectedAgents.length} / 5
                </span>
              </div>

              {/* Selected agents preview */}
              {selectedAgents.length > 0 && (
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {selectedAgents.map(a => (
                    <button
                      key={a.uuid}
                      onClick={() => handleAgentToggle(a)}
                      className="flex items-center gap-1.5 bg-[#ff4654]/10 border border-[#ff4654]/20 rounded-full pl-1 pr-2.5 py-1 hover:bg-[#ff4654]/20 transition-all group"
                    >
                      {a.displayIcon && <img src={a.displayIcon} alt="" className="w-5 h-5 rounded-full object-contain" />}
                      <span className="text-white text-xs font-semibold">{a.displayName}</span>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-[#ff4654] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  ))}
                </div>
              )}

              {/* Warning */}
              {warning && (
                <div className="mb-4 flex items-center gap-3 bg-[#ff4654]/10 border border-[#ff4654]/30 rounded-xl px-5 py-3 animate-[fadeIn_0.2s_ease-out]">
                  <svg className="w-5 h-5 text-[#ff4654] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  <p className="text-[#ff4654] text-sm font-semibold">{warning}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {agents.map(agent => {
                  const isSelected = selectedAgents.find(a => a.uuid === agent.uuid);
                  return (
                    <button
                      key={agent.uuid}
                      onClick={() => handleAgentToggle(agent)}
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.03] ${
                        isSelected
                          ? 'border-[#ff4654]/50 ring-1 ring-[#ff4654]/20'
                          : 'border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="aspect-[4/3] relative bg-gradient-to-b from-white/[0.03] to-[#111823] flex items-center justify-center p-3">
                        {agent.displayIcon && (
                          <img
                            src={agent.displayIcon}
                            alt={agent.displayName}
                            className="w-full h-full object-contain drop-shadow-lg"
                          />
                        )}
                        <div className={`absolute inset-0 transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#ff4654]/10'
                            : 'bg-transparent group-hover:bg-white/[0.02]'
                        }`}></div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ff4654] flex items-center justify-center shadow-lg shadow-[#ff4654]/30">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                      <div className={`px-3 py-2.5 border-t transition-colors duration-300 ${
                        isSelected ? 'border-[#ff4654]/20 bg-[#ff4654]/5' : 'border-white/5 bg-white/[0.02]'
                      }`}>
                        <p className="text-white font-bold text-xs sm:text-sm text-center truncate">
                          {agent.displayName}
                        </p>
                        {agent.role?.displayName && (
                          <p className="text-gray-500 text-[10px] text-center mt-0.5 uppercase tracking-wider">{agent.role.displayName}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-5 border border-white/10 text-gray-400 font-black text-lg rounded-2xl hover:bg-white/5 hover:text-white transition-all tracking-wider"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                    BACK
                  </span>
                </button>
                <button
                  onClick={generateStrategy}
                  disabled={selectedAgents.length < 5}
                  className={`group relative flex-1 px-12 py-5 overflow-hidden rounded-2xl font-black text-lg transition-all duration-300 ${
                    selectedAgents.length === 5
                      ? 'text-white hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(255,70,84,0.3)]'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedAgents.length === 5 ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff4654] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 opacity-20 bg-[length:4px_4px]" style={{backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)'}}></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"></div>
                  )}
                  <span className="relative flex items-center justify-center gap-3 tracking-[0.2em] uppercase">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    GENERATE
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StrategyPage;
