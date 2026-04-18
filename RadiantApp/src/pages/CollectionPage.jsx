import { useState, useMemo } from 'react';
import { useGetWeaponSkinsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

const roleIcons = {
  Duelist: '⚔️',
  Initiator: '🎯',
  Controller: '🛡️',
  Sentinel: '🔒',
};

function CollectionPage() {
  const [activeTab, setActiveTab] = useState('skins');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [agentSearch, setAgentSearch] = useState('');
  const { data: skins = [], isLoading: skinsLoading } = useGetWeaponSkinsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  const rarityMap = {
    'EEquippableRarity::Rare': 'Rare',
    'EEquippableRarity::Epic': 'Epic',
    'EEquippableRarity::Exclusive': 'Exclusive',
    'EEquippableRarity::Premium': 'Premium',
  };

  const filteredSkins = useMemo(() => {
    let result = skins.filter(s => s.displayName && s.displayIcon);
    if (selectedRarity !== 'all') {
      result = result.filter(s => {
        const rarity = rarityMap[s.rarity] || '';
        return rarity.toLowerCase() === selectedRarity.toLowerCase();
      });
    }
    return result;
  }, [skins, selectedRarity]);

  const filteredAgents = useMemo(() => {
    let result = agents.filter(a => a.displayName && a.displayIcon && a.isPlayableCharacter);
    if (agentSearch.trim()) {
      result = result.filter(a =>
        a.displayName.toLowerCase().includes(agentSearch.toLowerCase()) ||
        (a.role?.displayName || '').toLowerCase().includes(agentSearch.toLowerCase())
      );
    }
    return result;
  }, [agents, agentSearch]);

  const rarities = ['Rare', 'Epic', 'Exclusive', 'Premium'];

  const isLoading = activeTab === 'skins' ? skinsLoading : agentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff4654]/30 border-t-[#ff4654] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #ff4654 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff4654]/5 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff4654]/10 border border-[#ff4654]/20 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse" />
              <span className="text-[#ff4654] text-sm font-medium tracking-wider uppercase">Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">
              MY COLLECTION
            </h1>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-6 mb-12">
            <button
              onClick={() => setActiveTab('skins')}
              className={`group relative px-14 py-5 rounded-2xl font-black text-base tracking-widest uppercase transition-all duration-400 overflow-hidden ${
                activeTab === 'skins'
                  ? 'bg-gradient-to-br from-[#ff4654] via-[#ff5e6d] to-[#ff4654] text-white shadow-2xl shadow-[#ff4654]/30 scale-105 border-2 border-white/10'
                  : 'bg-[#1a2332] text-gray-500 border-2 border-white/5 hover:border-[#ff4654]/40 hover:text-white hover:shadow-lg hover:shadow-[#ff4654]/10'
              }`}
            >
              {activeTab === 'skins' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </>
              )}
              <span className="relative flex flex-col items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span>Skin List</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`group relative px-14 py-5 rounded-2xl font-black text-base tracking-widest uppercase transition-all duration-400 overflow-hidden ${
                activeTab === 'agents'
                  ? 'bg-gradient-to-br from-[#ff4654] via-[#ff5e6d] to-[#ff4654] text-white shadow-2xl shadow-[#ff4654]/30 scale-105 border-2 border-white/10'
                  : 'bg-[#1a2332] text-gray-500 border-2 border-white/5 hover:border-[#ff4654]/40 hover:text-white hover:shadow-lg hover:shadow-[#ff4654]/10'
              }`}
            >
              {activeTab === 'agents' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </>
              )}
              <span className="relative flex flex-col items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span>Agent List</span>
              </span>
            </button>
          </div>

          {/* =================== SKINS TAB =================== */}
          {activeTab === 'skins' && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              {/* Rarity Filter */}
              <div className="flex gap-3 flex-wrap justify-center">
                {[{ key: 'all', label: 'All', color: '#ff4654', icon: '🔥' }, { key: 'Rare', label: 'Rare', color: '#5a9fd4', icon: '💠' }, { key: 'Epic', label: 'Epic', color: '#b052d9', icon: '🔮' }, { key: 'Exclusive', label: 'Exclusive', color: '#f5a623', icon: '👑' }, { key: 'Premium', label: 'Premium', color: '#e84057', icon: '💎' }].map(({ key, label, color, icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRarity(key)}
                    className={`group relative px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden ${
                      selectedRarity === key
                        ? 'text-white shadow-2xl scale-105 border-2 border-white/10'
                        : 'bg-[#1a2332] text-gray-500 border-2 border-white/5 hover:border-white/10 hover:text-white hover:shadow-lg'
                    }`}
                    style={selectedRarity === key ? {
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      boxShadow: `0 10px 40px ${color}40`,
                    } : {}}
                  >
                    {selectedRarity === key && (
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    )}
                    <span className="relative flex items-center gap-2.5">
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Skins grouped by rarity */}
              {selectedRarity === 'all' ? (
                ['Rare', 'Epic', 'Exclusive', 'Premium', 'Standard'].map(rarity => {
                  const group = filteredSkins.filter(s => (rarityMap[s.rarity] || 'Standard') === rarity);
                  if (group.length === 0) return null;
                  const colors = { Rare: '#5a9fd4', Epic: '#b052d9', Exclusive: '#f5a623', Premium: '#e84057', Standard: '#6b7280' };
                  const icons = { Rare: '💠', Epic: '🔮', Exclusive: '👑', Premium: '💎', Standard: '⚙️' };
                  return (
                    <div key={rarity} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{icons[rarity]}</span>
                        <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: colors[rarity] }}>{rarity}</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                        <span className="text-xs font-bold text-gray-600 bg-[#1a2332] px-3 py-1 rounded-full border border-white/5">{group.length} skins</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {group.map(skin => (
                          <div
                            key={skin.uuid}
                            className="group bg-[#1a2332] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                            style={{ '--hover-color': colors[rarity] }}
                          >
                            <div className="p-3">
                              <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-24 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="px-3 pb-3 text-center">
                              <p className="text-white font-bold text-xs truncate mb-1">{skin.displayName}</p>
                              <span className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ color: colors[rarity], backgroundColor: `${colors[rarity]}15`, border: `1px solid ${colors[rarity]}30` }}>{rarity.toUpperCase()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredSkins.map(skin => {
                    const rarity = rarityMap[skin.rarity] || 'Standard';
                    const colors = { Rare: '#5a9fd4', Epic: '#b052d9', Exclusive: '#f5a623', Premium: '#e84057', Standard: '#6b7280' };
                    return (
                      <div
                        key={skin.uuid}
                        className="group bg-[#1a2332] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="p-3">
                          <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-24 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="px-3 pb-3 text-center">
                          <p className="text-white font-bold text-xs truncate mb-1">{skin.displayName}</p>
                          <span className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ color: colors[rarity], backgroundColor: `${colors[rarity]}15`, border: `1px solid ${colors[rarity]}30` }}>{rarity.toUpperCase()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredSkins.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No skins found for this rarity.</p>
                </div>
              )}
            </div>
          )}

          {/* =================== AGENTS TAB =================== */}
          {activeTab === 'agents' && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              {/* Agent Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['Duelist', 'Initiator', 'Controller', 'Sentinel'].map(role => {
                  const count = filteredAgents.filter(a => a.role?.displayName === role).length;
                  return (
                    <div key={role} className="relative bg-[#1a2332] rounded-2xl border border-white/5 p-5 text-center group hover:border-[#ff4654]/20 transition-all duration-300">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff4654]/40 rounded-tl-2xl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff4654]/40 rounded-br-2xl" />
                      <span className="text-xl mb-1 block">{roleIcons[role]}</span>
                      <p className="text-gray-500 text-[10px] tracking-widest mb-1">{role.toUpperCase()}</p>
                      <p className="text-2xl font-black text-white">{count}</p>
                    </div>
                  );
                })}
              </div>

              {/* Search */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    placeholder="Search agents or roles..."
                    className="w-full pl-11 pr-4 py-3 bg-[#1a2332] border border-white/5 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ff4654]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAgents.map(agent => (
                  <div
                    key={agent.uuid}
                    className="group relative bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden hover:border-[#ff4654]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff4654]/5"
                  >
                    {/* Agent Background Gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${agent.backgroundGradientColors?.[0] ? '#' + agent.backgroundGradientColors[0].slice(0, 6) : '#ff4654'}22, transparent 60%)`,
                        }}
                      />
                    </div>

                    <div className="relative p-5">
                      {/* Top Row: Avatar + Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-[#ff4654]/40 transition-colors bg-black/20">
                            <img
                              src={agent.displayIcon}
                              alt={agent.displayName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-black text-lg tracking-wide truncate">{agent.displayName.toUpperCase()}</h3>
                          {agent.role && (
                            <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#ff4654]/10 border border-[#ff4654]/20">
                              <span className="text-xs">{roleIcons[agent.role.displayName] || '🎮'}</span>
                              <span className="text-[#ff4654] text-[11px] font-semibold tracking-wider">{agent.role.displayName.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{agent.description}</p>

                      {/* Abilities */}
                      {agent.abilities && agent.abilities.length > 0 && (
                        <div className="flex gap-2">
                          {agent.abilities.filter(a => a.displayIcon).slice(0, 4).map((ability, i) => (
                            <div
                              key={i}
                              className="w-9 h-9 rounded-lg bg-black/30 border border-white/5 flex items-center justify-center group-hover:border-[#ff4654]/20 transition-colors"
                              title={ability.displayName}
                            >
                              <img src={ability.displayIcon} alt={ability.displayName} className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff4654]/0 group-hover:border-[#ff4654]/40 rounded-tl-2xl transition-colors duration-300" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff4654]/0 group-hover:border-[#ff4654]/40 rounded-br-2xl transition-colors duration-300" />
                  </div>
                ))}
              </div>

              {filteredAgents.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No agents found.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
