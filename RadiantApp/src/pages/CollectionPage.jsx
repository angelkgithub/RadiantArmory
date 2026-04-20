import { useState, useMemo, useEffect } from 'react';
import { useGetAllWeaponsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

const roleIcons = {
  Duelist: '⚔️',
  Initiator: '🎯',
  Controller: '🛡️',
  Sentinel: '🔒',
};

const weaponCategories = [
  { key: 'Rifle', label: 'Rifles', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l2-3h8l2 3h4M6 12v3h12v-3" />
    </svg>
  )},
  { key: 'SMG', label: 'SMGs', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l1.5-2h9l1.5 2h3M7 12v2.5h10V12" />
    </svg>
  )},
  { key: 'Shotgun', label: 'Shotguns', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 11h5l2-2h6l2 2h5M7 11v4h10v-4" />
    </svg>
  )},
  { key: 'Sidearm', label: 'Sidearms', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4l1-2h4l1 2h2M10 12v3h4v-3" />
    </svg>
  )},
  { key: 'Sniper', label: 'Snipers', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12h6l1.5-3h7l1.5 3h6M8 12v3h8v-3" />
    </svg>
  )},
  { key: 'Heavy', label: 'Heavy', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 11h4l2-3h8l2 3h4M6 11v5h12v-5" />
    </svg>
  )},
  { key: 'Melee', label: 'Melee', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.5l6 6-11 11-6-6 11-11zM3 21l3.5-3.5" />
    </svg>
  )},
];

function CollectionPage() {
  const [activeTab, setActiveTab] = useState('skins');
  const [agentSearch, setAgentSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 8;

  const [selectedCategory, setSelectedCategory] = useState('Rifle');
  const [selectedWeaponId, setSelectedWeaponId] = useState(null);
  const [selectedSkinIdx, setSelectedSkinIdx] = useState(0);
  const [selectedChromaIdx, setSelectedChromaIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  // Reset pagination when search or role changes
  useEffect(() => {
    setCurrentPage(1);
  }, [agentSearch, selectedRole]);

  // Group weapons by category
  const weaponsByCategory = useMemo(() => {
    const map = {};
    weapons.forEach(w => {
      const cat = (w.category || '').replace('EEquippableCategory::', '');
      if (!map[cat]) map[cat] = [];
      map[cat].push(w);
    });
    return map;
  }, [weapons]);

  const categoryWeapons = useMemo(() => weaponsByCategory[selectedCategory] || [], [weaponsByCategory, selectedCategory]);

  const selectedWeapon = useMemo(() => {
    if (selectedWeaponId) {
      const found = categoryWeapons.find(w => w.uuid === selectedWeaponId);
      if (found) return found;
    }
    return categoryWeapons[0] || null;
  }, [categoryWeapons, selectedWeaponId]);

  const weaponSkins = useMemo(() => {
    if (!selectedWeapon?.skins) return [];
    return selectedWeapon.skins.filter(s => s.displayIcon && !s.displayName.includes('Standard') && !s.displayName.includes('Random'));
  }, [selectedWeapon]);

  const currentSkin = weaponSkins[selectedSkinIdx] || null;
  const currentChromas = currentSkin?.chromas || [];
  const currentChroma = currentChromas[selectedChromaIdx] || currentChromas[0] || null;
  const previewImage = currentChroma?.fullRender || currentChroma?.displayIcon || currentSkin?.displayIcon || null;

  const videoUrl = useMemo(() => {
    if (currentChroma?.streamedVideo) return currentChroma.streamedVideo;
    if (currentSkin?.levels) {
      for (let i = currentSkin.levels.length - 1; i >= 0; i--) {
        if (currentSkin.levels[i].streamedVideo) return currentSkin.levels[i].streamedVideo;
      }
    }
    return null;
  }, [currentSkin, currentChroma]);

  // COMBINED FILTERING LOGIC
  const filteredAgents = useMemo(() => {
    let result = agents.filter(a => a.displayName && a.displayIcon && a.isPlayableCharacter);
    
    if (selectedRole !== 'All') {
      result = result.filter(a => a.role?.displayName === selectedRole);
    }

    if (agentSearch.trim()) {
      result = result.filter(a =>
        a.displayName.toLowerCase().includes(agentSearch.toLowerCase()) ||
        (a.role?.displayName || '').toLowerCase().includes(agentSearch.toLowerCase())
      );
    }
    return result;
  }, [agents, agentSearch, selectedRole]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * agentsPerPage;
    return filteredAgents.slice(start, start + agentsPerPage);
  }, [filteredAgents, currentPage]);

  const isLoading = activeTab === 'skins' ? weaponsLoading : agentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff4654]/30 border-t-[#ff4654] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <img 
        src="https://res.cloudinary.com/dc3erz7jd/image/upload/v1776654727/fade_ku3xfn.jpg" 
        alt="" 
        className="fixed inset-0 w-full h-full object-cover" 
        style={{ zIndex: 0 }} 
      />
      <div className="fixed inset-0 bg-[#111823]/80" style={{ zIndex: 0 }} />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full">
          <div className="h-2" />
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-1.5 rounded-full bg-[#ff4654]/10 border border-[#ff4654]/20 mb-4" style={{ minWidth: '120px' }}>
              <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse" />
              <span className="text-[#ff4654] text-sm font-medium tracking-wider uppercase">Collection</span>
            </div>
            <div className="h-2" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">
              MY COLLECTION
            </h1>
          </div>

          <div className="h-3" />

          {/* Tab Buttons */}
          <div className="flex justify-center gap-6 mb-12 pb-4">
            <button
              onClick={() => setActiveTab('skins')}
              style={{ minWidth: '220px' }}
              className={`group relative px-24 py-5 rounded-2xl font-black text-base tracking-widest uppercase transition-all duration-400 overflow-hidden ${
                activeTab === 'skins'
                  ? 'bg-gradient-to-br from-[#ff4654] via-[#ff5e6d] to-[#ff4654] text-white shadow-2xl shadow-[#ff4654]/30 scale-105 border-2 border-white/10'
                  : 'bg-[#1a2332] text-gray-500 border-2 border-white/5 hover:border-[#ff4654]/40 hover:text-white hover:shadow-lg hover:shadow-[#ff4654]/10'
              }`}
            >
              <span className="relative flex flex-col items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455-2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455-2.456z" />
                </svg>
                <span>Skin List</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              style={{ minWidth: '220px' }}
              className={`group relative px-24 py-5 rounded-2xl font-black text-base tracking-widest uppercase transition-all duration-400 overflow-hidden ${
                activeTab === 'agents'
                  ? 'bg-gradient-to-br from-[#ff4654] via-[#ff5e6d] to-[#ff4654] text-white shadow-2xl shadow-[#ff4654]/30 scale-105 border-2 border-white/10'
                  : 'bg-[#1a2332] text-gray-500 border-2 border-white/5 hover:border-[#ff4654]/40 hover:text-white hover:shadow-lg hover:shadow-[#ff4654]/10'
              }`}
            >
              <span className="relative flex flex-col items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span>Agent List</span>
              </span>
            </button>
          </div>

          <div className="h-2.5" />

          {/* =================== SKINS TAB =================== */}
          {activeTab === 'skins' && (
            <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-center">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4 w-full max-w-7xl">
                  {weaponCategories.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedCategory(key); setSelectedWeaponId(null); setSelectedSkinIdx(0); setSelectedChromaIdx(0); setShowVideo(false); }}
                      className={`group relative flex flex-col items-center justify-center gap-2 py-5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                        selectedCategory === key
                          ? 'bg-gradient-to-br from-[#ff4654] to-[#ff4654]/80 text-white shadow-lg shadow-[#ff4654]/25 scale-[1.03] border border-white/10'
                          : 'bg-[#1a2332] text-gray-500 border border-white/5 hover:border-[#ff4654]/30 hover:text-white'
                      }`}
                    >
                      <span className={`${selectedCategory === key ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`}>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {categoryWeapons.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {categoryWeapons.map(w => (
                    <button
                      key={w.uuid}
                      onClick={() => { setSelectedWeaponId(w.uuid); setSelectedSkinIdx(0); setSelectedChromaIdx(0); setShowVideo(false); }}
                      style={{ minWidth: '300px' }}
                      className={`flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                        selectedWeapon?.uuid === w.uuid
                          ? 'bg-[#ff4654]/15 text-[#ff4654] border border-[#ff4654]/40 shadow-md shadow-[#ff4654]/10'
                          : 'bg-[#1a2332] text-gray-500 border border-white/5 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      {w.displayIcon && (
                        <img src={w.displayIcon} alt={w.displayName} className="h-8 w-auto object-contain opacity-80" />
                      )}
                      <span>{w.displayName}</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedWeapon && weaponSkins.length > 0 ? (
                <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-white/5 rounded-2xl">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-[360px] xl:w-[400px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5">
                      <div className="p-4 border-b border-white/5">
                        <h3 className="text-white font-black text-sm tracking-widest uppercase flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-[#ff4654] rounded-full" />
                          {selectedWeapon.displayName} Skins
                          <span className="ml-auto text-[10px] text-gray-500 font-medium">{weaponSkins.length}</span>
                        </h3>
                      </div>
                      <div className="max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        {weaponSkins.map((skin, idx) => (
                          <button
                            key={skin.uuid}
                            onClick={() => { setSelectedSkinIdx(idx); setSelectedChromaIdx(0); setShowVideo(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-b border-white/[0.03] ${
                              selectedSkinIdx === idx
                                ? 'bg-[#ff4654]/10 border-l-2 border-l-[#ff4654]'
                                : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
                            }`}
                          >
                            <div className="w-16 h-10 flex-shrink-0 flex items-center justify-center">
                              <img src={skin.displayIcon} alt={skin.displayName} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate ${selectedSkinIdx === idx ? 'text-white' : 'text-gray-400'}`}>
                                {skin.displayName}
                              </p>
                              {skin.chromas && skin.chromas.length > 1 && (
                                <p className="text-[10px] text-gray-600 mt-0.5">{skin.chromas.length} variants</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 relative min-h-[350px] lg:min-h-[480px] flex items-center justify-center p-8 lg:p-12">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-64 h-64 bg-[#ff4654]/5 rounded-full blur-[80px]" />
                        </div>

                        {showVideo && videoUrl ? (
                          <>
                            {videoLoading && (
                              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                                <div className="w-10 h-10 border-[3px] border-white/10 border-t-[#ff4654] rounded-full animate-spin" />
                              </div>
                            )}
                            <video
                              key={videoUrl} src={videoUrl} autoPlay loop muted playsInline
                              onLoadStart={() => setVideoLoading(true)}
                              onCanPlay={() => setVideoLoading(false)}
                              className={`relative z-10 max-w-full max-h-[340px] lg:max-h-[420px] rounded-lg object-contain drop-shadow-2xl transition-opacity duration-300 ${videoLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                          </>
                        ) : previewImage ? (
                          <img src={previewImage} alt={currentSkin?.displayName} className="relative z-10 max-w-full max-h-[320px] lg:max-h-[400px] object-contain drop-shadow-2xl" />
                        ) : (
                          <div className="text-gray-600 text-sm">No preview available</div>
                        )}

                        {videoUrl && (
                          <button onClick={() => setShowVideo(v => !v)} className={`absolute top-4 right-4 z-20 flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-black uppercase transition-all duration-300 ${showVideo ? 'bg-[#ff4654] text-white shadow-xl' : 'bg-black/40 backdrop-blur-sm text-gray-300 border border-white/10'}`}>
                            <span>{showVideo ? 'Image' : 'Video'}</span>
                          </button>
                        )}
                        <div className="absolute bottom-6 left-8 right-8 z-10">
                          <p className="text-white font-black text-xl lg:text-2xl">{currentSkin?.displayName}</p>
                        </div>
                      </div>

                      {currentChromas.length > 1 && (
                        <div className="relative p-5 pt-2">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-3">Colorways</p>
                          <div className="flex gap-3 flex-wrap">
                            {currentChromas.map((chroma, idx) => (
                              <button
                                key={chroma.uuid}
                                onClick={() => { setSelectedChromaIdx(idx); setShowVideo(false); }}
                                className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${selectedChromaIdx === idx ? 'ring-2 ring-[#ff4654]' : 'ring-1 ring-white/10'}`}
                              >
                                {chroma.swatch ? (
                                  <img src={chroma.swatch} alt={chroma.displayName} className="w-14 h-14 object-cover" />
                                ) : (
                                  <div className="w-14 h-14 bg-[#0d1117] flex items-center justify-center text-[10px] text-gray-400">{idx + 1}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* =================== AGENTS TAB =================== */}
          {activeTab === 'agents' && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Role Filter & Stats Bar (FUNCTIONAL) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {['All', 'Duelist', 'Initiator', 'Controller', 'Sentinel'].map(role => {
                  const isSelected = selectedRole === role;
                  const count = role === 'All' 
                    ? agents.filter(a => a.isPlayableCharacter).length 
                    : agents.filter(a => a.role?.displayName === role).length;

                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`relative bg-[#1a2332] rounded-2xl border p-6 text-center group transition-all duration-300 hover:scale-[1.02] ${
                        isSelected ? 'border-[#ff4654] shadow-lg shadow-[#ff4654]/10' : 'border-white/5 hover:border-[#ff4654]/30'
                      }`}
                    >
                      <span className="text-3xl mb-2 block">{role === 'All' ? '👥' : roleIcons[role]}</span>
                      <p className="text-gray-400 text-[11px] font-bold tracking-[0.2em] mb-1">{role.toUpperCase()}</p>
                      <p className={`text-3xl font-black ${isSelected ? 'text-[#ff4654]' : 'text-white'}`}>{count}</p>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-2xl">
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-[#1a2332] border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#ff4654]/40 transition-all"
                  />
                </div>
              </div>

              {/* Agents Grid (PAGINATED) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {paginatedAgents.map(agent => (
                  <div key={agent.uuid} className="group relative bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden hover:border-[#ff4654]/40 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-t from-[#1a2332] to-transparent">
                      <img src={agent.fullPortrait || agent.displayIcon} alt={agent.displayName} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-56 object-contain group-hover:scale-110 transition-all" />
                      {agent.role && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
                          <span className="text-sm">{roleIcons[agent.role.displayName]}</span>
                          <span className="text-[10px] font-bold text-white/80 uppercase">{agent.role.displayName}</span>
                        </div>
                      )}
                    </div>
                    <div className="px-5 pb-5 mt-2">
                      <h3 className="text-white font-black text-xl mb-2">{agent.displayName.toUpperCase()}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2">{agent.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 pb-10">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-[#1a2332] border border-white/5 text-white disabled:opacity-30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#ff4654] text-white' : 'bg-[#1a2332] text-gray-500 hover:text-white border border-white/5'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl bg-[#1a2332] border border-white/5 text-white disabled:opacity-30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}

              {filteredAgents.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-bold">No agents found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;