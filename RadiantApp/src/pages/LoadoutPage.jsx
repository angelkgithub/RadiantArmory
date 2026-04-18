import { useState, useMemo, useRef } from 'react';
import { useGetAllWeaponsQuery, useGetWeaponSkinsQuery } from '../services/valorantApi';

function LoadoutPage() {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [selectedChroma, setSelectedChroma] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: skins = [] } = useGetWeaponSkinsQuery();

  const categoryMap = {
    'EEquippableCategory::Sidearm': 'SIDEARMS',
    'EEquippableCategory::SMG': 'SMGS',
    'EEquippableCategory::Rifle': 'RIFLES',
    'EEquippableCategory::Sniper': 'SNIPER RIFLES',
    'EEquippableCategory::Shotgun': 'SHOTGUNS',
    'EEquippableCategory::Heavy': 'MACHINE GUNS',
    'EEquippableCategory::Melee': 'MELEE'
  };

  const categoryIcons = {
    'SIDEARMS': '🔫', 'SMGS': '⚡', 'RIFLES': '🎯', 'SNIPER RIFLES': '🔭',
    'SHOTGUNS': '💥', 'MACHINE GUNS': '🔥', 'MELEE': '🗡️'
  };

  const weaponsByCategory = useMemo(() => {
    const grouped = {};
    weapons.forEach(weapon => {
      const categoryName = categoryMap[weapon.category] || 'OTHER';
      if (!grouped[categoryName]) grouped[categoryName] = [];
      grouped[categoryName].push(weapon);
    });
    return grouped;
  }, [weapons]);

  const weaponSkins = useMemo(() => {
    if (!selectedWeapon) return [];
    return skins.filter(s => s.weaponId === selectedWeapon.uuid);
  }, [selectedWeapon, skins]);

  const previewVideo = useMemo(() => {
    if (selectedChroma?.streamedVideo) return selectedChroma.streamedVideo;
    if (selectedSkin?.levels) {
      for (let i = selectedSkin.levels.length - 1; i >= 0; i--) {
        if (selectedSkin.levels[i].streamedVideo) return selectedSkin.levels[i].streamedVideo;
      }
    }
    return null;
  }, [selectedSkin, selectedChroma]);

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapon(weapon);
    setSelectedSkin(null);
    setSelectedChroma(null);
    setIsPlaying(false);
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const bgStyle = {
    backgroundImage: `url('https://res.cloudinary.com/dc3erz7jd/image/upload/v1776517270/1868807-3840x2160-desktop-4k-valorant-background-photo_fhmdy6.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (weaponsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff4654]/30 border-t-[#ff4654] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={bgStyle}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#111823]/80 to-[#111823]/95" />

      <div className="relative z-10 px-2 py-20">
        <div className="w-full">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff4654]/10 border border-[#ff4654]/20 backdrop-blur-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse" />
              <span className="text-[#ff4654] text-sm font-medium tracking-wider uppercase">Arsenal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 tracking-tight mb-3">
              LOADOUT BUILDER
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">Choose your weapons, customize your skins, and build the perfect loadout</p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ff4654] to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mb-12">

            {/* Weapons Grid */}
            <div>
              {Object.entries(weaponsByCategory).map(([category, categoryWeapons]) => (
                <div key={category} className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xl">{categoryIcons[category] || '🎮'}</span>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-wider">{category}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[11px] font-bold text-gray-500 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                      {categoryWeapons.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryWeapons.map((weapon) => (
                      <button
                        key={weapon.uuid}
                        onClick={() => handleWeaponSelect(weapon)}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.03] ${
                          selectedWeapon?.uuid === weapon.uuid
                            ? 'bg-[#ff4654]/10 border-2 border-[#ff4654]/40 shadow-xl shadow-[#ff4654]/10'
                            : 'bg-black/40 backdrop-blur-sm border border-white/5 hover:border-white/15 hover:bg-black/50'
                        }`}
                      >
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ff4654]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#ff4654]/0 group-hover:border-[#ff4654]/30 rounded-tl-2xl transition-colors duration-300" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#ff4654]/0 group-hover:border-[#ff4654]/30 rounded-br-2xl transition-colors duration-300" />

                        <div className="relative p-4 flex flex-col items-center justify-center min-h-[150px]">
                          {weapon.displayIcon && (
                            <img
                              src={weapon.displayIcon}
                              alt={weapon.displayName}
                              className="w-full h-20 object-contain mb-3 drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_4px_20px_rgba(255,70,84,0.15)] transition-all duration-300 group-hover:scale-105"
                            />
                          )}
                          <p className="text-white font-bold text-xs truncate w-full text-center">{weapon.displayName}</p>
                          <p className="text-[#ff4654] text-[11px] font-semibold mt-0.5">{Math.round(weapon.cost)} VP</p>
                        </div>

                        {selectedWeapon?.uuid === weapon.uuid && (
                          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ff4654] shadow-lg shadow-[#ff4654]/60 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Panel */}
            <div>
              <div className="sticky top-20">
                <div className="relative bg-[#1a2332]/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                  {/* Panel top accent */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff4654]/50 to-transparent" />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4654]/20 rounded-tl-2xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4654]/20 rounded-br-2xl pointer-events-none" />

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-black text-white tracking-wider">PREVIEW</h2>
                      {selectedWeapon && (
                        <span className="text-[10px] font-bold text-[#ff4654] bg-[#ff4654]/10 px-2.5 py-1 rounded-full border border-[#ff4654]/20">
                          {selectedWeapon.displayName}
                        </span>
                      )}
                    </div>

                    {selectedWeapon ? (
                      <div className="space-y-4">
                        {/* Preview Window */}
                        <div className="relative rounded-xl bg-gradient-to-b from-white/[0.04] to-black/20 border border-white/5 p-5 flex items-center justify-center min-h-[180px] overflow-hidden">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff4654]/20 rounded-tl-xl pointer-events-none" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff4654]/20 rounded-br-xl pointer-events-none" />

                          {/* Radial glow behind weapon */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-40 h-40 bg-[#ff4654]/5 rounded-full blur-3xl" />
                          </div>

                          {selectedChroma?.fullRender || selectedChroma?.displayIcon ? (
                            <img src={selectedChroma.fullRender || selectedChroma.displayIcon} alt="variant" className="relative w-full h-40 object-contain drop-shadow-[0_0_30px_rgba(255,70,84,0.12)]" />
                          ) : selectedSkin?.displayIcon ? (
                            <img src={selectedSkin.displayIcon} alt="skin" className="relative w-full h-40 object-contain drop-shadow-[0_0_30px_rgba(255,70,84,0.12)]" />
                          ) : selectedWeapon.displayIcon ? (
                            <img src={selectedWeapon.displayIcon} alt="weapon" className="relative w-full h-40 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                          ) : (
                            <div className="text-gray-600 text-sm">No preview</div>
                          )}
                        </div>

                        {/* Video/Sound Preview */}
                        {previewVideo && (
                          <div className="space-y-2">
                            <button
                              onClick={toggleVideo}
                              className={`w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 group ${
                                isPlaying
                                  ? 'border-[#ff4654]/40 bg-[#ff4654]/10 shadow-lg shadow-[#ff4654]/10'
                                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
                              }`}
                            >
                              {isPlaying ? (
                                <svg className="w-4 h-4 text-[#ff4654]" fill="currentColor" viewBox="0 0 24 24">
                                  <rect x="6" y="4" width="4" height="16" rx="1" />
                                  <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-[#ff4654]" fill="currentColor" viewBox="0 0 24 24">
                                  <polygon points="5,3 19,12 5,21" />
                                </svg>
                              )}
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                                {isPlaying ? 'Pause Preview' : 'Play Sound Preview'}
                              </span>
                            </button>
                            {isPlaying && (
                              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                <video
                                  ref={videoRef}
                                  src={previewVideo}
                                  autoPlay
                                  onEnded={() => setIsPlaying(false)}
                                  className="w-full rounded-xl"
                                  style={{ maxHeight: '200px' }}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">Weapon</p>
                              <p className="text-white font-bold text-sm">{selectedWeapon.displayName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">Cost</p>
                              <p className="text-[#ff4654] font-black text-sm">{Math.round(selectedWeapon.cost)} VP</p>
                            </div>
                          </div>
                          {selectedSkin && (
                            <div className="pt-2 border-t border-white/5">
                              <p className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">Skin</p>
                              <p className="text-white font-semibold text-xs">{selectedChroma?.displayName || selectedSkin.displayName}</p>
                            </div>
                          )}
                        </div>

                        {/* Chromas */}
                        {selectedSkin?.chromas && selectedSkin.chromas.length > 1 && (
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-medium">
                              Variants ({selectedSkin.chromas.length})
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedSkin.chromas.map((chroma, i) => (
                                <button
                                  key={chroma.uuid || i}
                                  onClick={() => { setSelectedChroma(chroma); setIsPlaying(false); }}
                                  className={`group relative rounded-xl overflow-hidden border transition-all duration-200 hover:scale-105 ${
                                    selectedChroma?.uuid === chroma.uuid
                                      ? 'border-[#ff4654]/50 ring-1 ring-[#ff4654]/20 bg-[#ff4654]/10'
                                      : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                                  }`}
                                >
                                  <div className="aspect-[4/3] flex items-center justify-center p-1.5">
                                    {chroma.fullRender || chroma.displayIcon ? (
                                      <img src={chroma.fullRender || chroma.displayIcon} alt={chroma.displayName || `Variant ${i + 1}`} className="w-full h-full object-contain" />
                                    ) : chroma.swatch ? (
                                      <div className="w-6 h-6 rounded-full overflow-hidden mx-auto">
                                        <img src={chroma.swatch} alt="" className="w-full h-full object-cover" />
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-white/10 mx-auto" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skins */}
                        {weaponSkins.length > 0 && (
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-medium">
                              Skins ({weaponSkins.length})
                            </p>
                            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                              {weaponSkins.map((skin) => (
                                <button
                                  key={skin.uuid}
                                  onClick={() => { setSelectedSkin(skin); setSelectedChroma(null); setIsPlaying(false); }}
                                  className={`rounded-xl border transition-all duration-200 overflow-hidden hover:scale-105 ${
                                    selectedSkin?.uuid === skin.uuid
                                      ? 'border-[#ff4654]/40 bg-[#ff4654]/5'
                                      : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                                  }`}
                                  title={skin.displayName}
                                >
                                  {skin.displayIcon && (
                                    <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-14 object-contain p-1.5" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button className="group relative flex-1 py-3 overflow-hidden rounded-xl font-bold text-xs text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff4654]/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative tracking-wider">SAVE LOADOUT</span>
                          </button>
                          <button className="flex-1 py-3 border border-white/10 text-gray-400 font-bold text-xs rounded-xl hover:bg-white/5 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider">
                            Rate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-xs font-medium">Select a weapon to preview</p>
                        <p className="text-gray-600 text-[10px] mt-1">Click any weapon from the grid</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadoutPage;
