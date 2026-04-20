import { useState, useMemo } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('Rifle');
  const [selectedWeaponId, setSelectedWeaponId] = useState(null);
  const [selectedSkinIdx, setSelectedSkinIdx] = useState(0);
  const [selectedChromaIdx, setSelectedChromaIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

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

  // Get weapons for current category
  const categoryWeapons = useMemo(() => weaponsByCategory[selectedCategory] || [], [weaponsByCategory, selectedCategory]);

  // Auto-select first weapon when category changes
  const selectedWeapon = useMemo(() => {
    if (selectedWeaponId) {
      const found = categoryWeapons.find(w => w.uuid === selectedWeaponId);
      if (found) return found;
    }
    return categoryWeapons[0] || null;
  }, [categoryWeapons, selectedWeaponId]);

  // Get skins for selected weapon (filter out standard/default)
  const weaponSkins = useMemo(() => {
    if (!selectedWeapon?.skins) return [];
    return selectedWeapon.skins.filter(s => s.displayIcon && !s.displayName.includes('Standard') && !s.displayName.includes('Random'));
  }, [selectedWeapon]);

  // Current selected skin
  const currentSkin = weaponSkins[selectedSkinIdx] || null;
  const currentChromas = currentSkin?.chromas || [];
  const currentChroma = currentChromas[selectedChromaIdx] || currentChromas[0] || null;

  // Preview image: use chroma's fullRender or displayIcon, fallback to skin displayIcon
  const previewImage = currentChroma?.fullRender || currentChroma?.displayIcon || currentSkin?.displayIcon || null;

  // Video URL: check chroma streamedVideo first, then skin levels (last level with video)
  const videoUrl = useMemo(() => {
    if (currentChroma?.streamedVideo) return currentChroma.streamedVideo;
    if (currentSkin?.levels) {
      for (let i = currentSkin.levels.length - 1; i >= 0; i--) {
        if (currentSkin.levels[i].streamedVideo) return currentSkin.levels[i].streamedVideo;
      }
    }
    return null;
  }, [currentSkin, currentChroma]);

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

  const isLoading = activeTab === 'skins' ? weaponsLoading : agentsLoading;

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
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">

              {/* Weapon Category Selector */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
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

              {/* Weapon Selector (individual weapons in category) */}
              {categoryWeapons.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {categoryWeapons.map(w => (
                    <button
                      key={w.uuid}
                      onClick={() => { setSelectedWeaponId(w.uuid); setSelectedSkinIdx(0); setSelectedChromaIdx(0); setShowVideo(false); }}
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

              {/* 2-Column Skin Viewer */}
              {selectedWeapon && weaponSkins.length > 0 ? (
                <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column: Skin List */}
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
                              <img
                                src={skin.displayIcon}
                                alt={skin.displayName}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate ${selectedSkinIdx === idx ? 'text-white' : 'text-gray-400'}`}>
                                {skin.displayName}
                              </p>
                              {skin.chromas && skin.chromas.length > 1 && (
                                <p className="text-[10px] text-gray-600 mt-0.5">{skin.chromas.length} variants</p>
                              )}
                            </div>
                            {selectedSkinIdx === idx && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4654] flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="flex-1 flex flex-col">
                      {/* Preview Area */}
                      <div className="flex-1 relative min-h-[350px] lg:min-h-[480px] flex items-center justify-center p-8 lg:p-12">
                        {/* Background glow */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-64 h-64 bg-[#ff4654]/5 rounded-full blur-[80px]" />
                        </div>

                        {/* Video / Image toggle */}
                        {showVideo && videoUrl ? (
                          <>
                            {videoLoading && (
                              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                                <div className="w-10 h-10 border-[3px] border-white/10 border-t-[#ff4654] rounded-full animate-spin" />
                                <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Loading preview...</span>
                              </div>
                            )}
                            <video
                              key={videoUrl}
                              src={videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              onLoadStart={() => setVideoLoading(true)}
                              onCanPlay={() => setVideoLoading(false)}
                              className={`relative z-10 max-w-full max-h-[340px] lg:max-h-[420px] rounded-lg object-contain drop-shadow-2xl transition-opacity duration-300 ${videoLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                          </>
                        ) : previewImage ? (
                          <img
                            src={previewImage}
                            alt={currentSkin?.displayName}
                            className="relative z-10 max-w-full max-h-[320px] lg:max-h-[400px] object-contain drop-shadow-2xl transition-all duration-300"
                          />
                        ) : (
                          <div className="text-gray-600 text-sm">No preview available</div>
                        )}

                        {/* Video toggle button */}
                        {videoUrl && (
                          <button
                            onClick={() => setShowVideo(v => !v)}
                            className={`absolute top-4 right-4 z-20 flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-black tracking-widest uppercase transition-all duration-300 ${
                              showVideo
                                ? 'bg-[#ff4654] text-white shadow-xl shadow-[#ff4654]/30'
                                : 'bg-black/40 backdrop-blur-sm text-gray-300 border border-white/10 hover:border-[#ff4654]/40 hover:text-white'
                            }`}
                          >
                            {showVideo ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                            <span>{showVideo ? 'Image' : 'Video'}</span>
                          </button>
                        )}

                        {/* Skin name overlay */}
                        <div className="absolute bottom-6 left-8 right-8 z-10">
                          <p className="text-white font-black text-xl lg:text-2xl tracking-wide">{currentSkin?.displayName}</p>
                          {currentChroma && currentChroma.displayName !== currentSkin?.displayName && (
                            <p className="text-[#ff4654] text-sm font-semibold mt-1">{currentChroma.displayName}</p>
                          )}
                        </div>
                      </div>

                      {/* Chromas / Colorways */}
                      {currentChromas.length > 1 && (
                        <div className="border-t border-white/5 p-5">
                          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-3">Colorways</p>
                          <div className="flex gap-3 flex-wrap">
                            {currentChromas.map((chroma, idx) => (
                              <button
                                key={chroma.uuid}
                                onClick={() => { setSelectedChromaIdx(idx); setShowVideo(false); }}
                                className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
                                  selectedChromaIdx === idx
                                    ? 'ring-2 ring-[#ff4654] ring-offset-2 ring-offset-[#1a2332] scale-105'
                                    : 'ring-1 ring-white/10 hover:ring-white/25'
                                }`}
                                title={chroma.displayName}
                              >
                                {chroma.swatch ? (
                                  <img src={chroma.swatch} alt={chroma.displayName} className="w-14 h-14 object-cover" />
                                ) : chroma.displayIcon ? (
                                  <div className="w-14 h-14 bg-[#0d1117] flex items-center justify-center p-1.5">
                                    <img src={chroma.displayIcon} alt={chroma.displayName} className="max-w-full max-h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                    <span className="text-[10px] text-gray-400 font-bold">{idx + 1}</span>
                                  </div>
                                )}
                                {selectedChromaIdx === idx && (
                                  <div className="absolute inset-0 border-2 border-[#ff4654] rounded-xl pointer-events-none" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedWeapon ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No skins available for {selectedWeapon.displayName}.</p>
                </div>
              ) : null}
            </div>
          )}

          {/* =================== AGENTS TAB =================== */}
          {activeTab === 'agents' && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              {/* Role Filter & Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['Duelist', 'Initiator', 'Controller', 'Sentinel'].map(role => {
                  const count = filteredAgents.filter(a => a.role?.displayName === role).length;
                  const roleColors = {
                    Duelist: 'from-red-500/20 to-orange-500/10',
                    Initiator: 'from-blue-500/20 to-cyan-500/10',
                    Controller: 'from-purple-500/20 to-violet-500/10',
                    Sentinel: 'from-green-500/20 to-emerald-500/10',
                  };
                  return (
                    <div key={role} className="relative bg-[#1a2332] rounded-2xl border border-white/5 p-6 text-center group hover:border-[#ff4654]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#ff4654]/5 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${roleColors[role]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4654]/30 group-hover:border-[#ff4654]/60 rounded-tl-2xl transition-colors duration-300" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4654]/30 group-hover:border-[#ff4654]/60 rounded-br-2xl transition-colors duration-300" />
                      <div className="relative">
                        <span className="text-3xl mb-2 block">{roleIcons[role]}</span>
                        <p className="text-gray-400 text-[11px] font-bold tracking-[0.2em] mb-1">{role.toUpperCase()}</p>
                        <p className="text-3xl font-black text-white">{count}</p>
                        <div className="mt-2 mx-auto w-8 h-[2px] rounded-full bg-[#ff4654]/40 group-hover:w-12 group-hover:bg-[#ff4654] transition-all duration-300" />
                      </div>
                    </div>
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
                    placeholder="Search agents by name or role..."
                    className="w-full pl-13 pr-6 py-4 bg-[#1a2332] border border-white/5 rounded-2xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ff4654]/40 focus:shadow-lg focus:shadow-[#ff4654]/5 transition-all duration-300"
                    style={{ paddingLeft: '3.25rem' }}
                  />
                  {agentSearch && (
                    <button onClick={() => setAgentSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Agent Count */}
              <div className="flex items-center justify-between px-1">
                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                  Showing <span className="text-white">{filteredAgents.length}</span> Agents
                </p>
                <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAgents.map(agent => {
                  const agentColor = agent.backgroundGradientColors?.[0] ? '#' + agent.backgroundGradientColors[0].slice(0, 6) : '#ff4654';
                  return (
                    <div
                      key={agent.uuid}
                      className="group relative bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden hover:border-[#ff4654]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[#ff4654]/10 hover:-translate-y-1"
                    >
                      {/* Agent Background Image (full-body) */}
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(180deg, ${agentColor}33, ${agentColor}11 50%, #1a2332 100%)`,
                          }}
                        />
                        {agent.fullPortrait ? (
                          <img
                            src={agent.fullPortrait}
                            alt={agent.displayName}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-56 object-contain group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                          />
                        ) : (
                          <img
                            src={agent.displayIcon}
                            alt={agent.displayName}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-contain opacity-60 group-hover:scale-110 transition-all duration-500"
                          />
                        )}
                        {/* Gradient overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1a2332] to-transparent" />
                        {/* Role badge top-right */}
                        {agent.role && (
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
                            <span className="text-sm">{roleIcons[agent.role.displayName] || '🎮'}</span>
                            <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">{agent.role.displayName}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="relative px-5 pb-5 -mt-2">
                        {/* Agent Name */}
                        <h3 className="text-white font-black text-xl tracking-wider mb-2">{agent.displayName.toUpperCase()}</h3>

                        {/* Description */}
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{agent.description}</p>

                        {/* Abilities Row */}
                        {agent.abilities && agent.abilities.length > 0 && (
                          <div className="flex gap-2.5">
                            {agent.abilities.filter(a => a.displayIcon).slice(0, 4).map((ability, i) => (
                              <div
                                key={i}
                                className="relative w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-[#ff4654]/30 transition-all duration-300 hover:bg-[#ff4654]/10 hover:border-[#ff4654]/50 hover:scale-110 cursor-default"
                                title={`${ability.displayName}${ability.description ? ' — ' + ability.description.slice(0, 80) + '...' : ''}`}
                              >
                                <img src={ability.displayIcon} alt={ability.displayName} className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4654]/0 to-transparent group-hover:via-[#ff4654]/60 transition-all duration-500" />
                    </div>
                  );
                })}
              </div>

              {filteredAgents.length === 0 && (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-bold">No agents found</p>
                  <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
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
