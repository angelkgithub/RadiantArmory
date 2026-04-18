import React, { useState, useMemo, useEffect } from 'react';
import { useGetWeaponSkinsQuery } from '../services/valorantApi';

const SkinSelectorModal = ({ isOpen, onClose, weapon, onSelectSkin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkin, setSelectedSkin] = useState(null);

  const { data: allSkins = [] } = useGetWeaponSkinsQuery();

  useEffect(() => {
    setSearchTerm('');
    setSelectedSkin(null);
  }, [weapon]);

  const weaponAssetPathBase = useMemo(() => {
    if (!weapon?.assetPath) return '';
    return weapon.assetPath.replace(/\/[^/]+$/, '/');
  }, [weapon]);

  const weaponSkins = useMemo(() => {
    if (!weapon || !weaponAssetPathBase || !allSkins.length) return [];

    return allSkins.filter((skin) => {
      if (!skin.assetPath) return false;
      return (
        skin.assetPath.startsWith(weaponAssetPathBase) &&
        skin.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [weapon, weaponAssetPathBase, allSkins, searchTerm]);

  const handleSelectSkin = (skin) => {
    setSelectedSkin(skin);
  };

  const confirmSelect = () => {
    if (!selectedSkin) return;
    onSelectSkin?.(selectedSkin);
    onClose();
  };

  if (!isOpen || !weapon) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-black/60">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-white font-black text-lg sm:text-xl tracking-wider">
              {weapon.displayName} <span className="text-[#ff4654]">SKINS</span>
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">{weaponSkins.length} skins available</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — Grid */}
          <div className="w-1/2 sm:w-[55%] flex flex-col p-4 border-r border-white/5">

            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search skins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 text-white text-sm rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#ff4654]/40 transition-colors"
              />
            </div>

            {/* Grid — scrollable, all skins */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 auto-rows-min pr-1 scrollbar-thin">
              {weaponSkins.map((skin) => (
                <button
                  key={skin.uuid}
                  onClick={() => handleSelectSkin(skin)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-200 border ${
                    selectedSkin?.uuid === skin.uuid
                      ? 'border-[#ff4654]/60 bg-[#ff4654]/10 ring-1 ring-[#ff4654]/30'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {skin.displayIcon ? (
                      <img src={skin.displayIcon} alt="" className="w-full h-full object-contain drop-shadow-lg" />
                    ) : (
                      <div className="w-full h-full bg-white/5 rounded-lg" />
                    )}
                  </div>
                  <div className="px-2 pb-2">
                    <p className="text-[10px] sm:text-xs text-gray-400 group-hover:text-white truncate transition-colors text-center font-medium">
                      {skin.displayName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Preview */}
          <div className="w-1/2 sm:w-[45%] flex flex-col p-4 bg-[#0a0e14]">
            {selectedSkin ? (
              <div className="flex flex-col h-full">
                {/* Skin Name */}
                <div className="mb-4">
                  <h3 className="text-white font-black text-base sm:text-lg tracking-wide">
                    {selectedSkin.displayName}
                  </h3>
                  <div className="h-0.5 w-12 bg-[#ff4654] mt-1.5 rounded-full"></div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 flex items-center justify-center rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden relative">
                  {selectedSkin.streamedVideo ||
                   selectedSkin.levels?.[0]?.streamedVideo ? (
                    <video
                      src={
                        selectedSkin.streamedVideo ||
                        selectedSkin.levels?.[0]?.streamedVideo
                      }
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain p-4"
                    />
                  ) : selectedSkin.displayIcon ? (
                    <img
                      src={selectedSkin.displayIcon}
                      alt={selectedSkin.displayName}
                      className="w-full h-full object-contain p-6 drop-shadow-[0_0_40px_rgba(255,70,84,0.15)]"
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">No preview available</p>
                  )}

                  {/* Subtle corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4654]/30 rounded-tl-xl pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4654]/30 rounded-br-xl pointer-events-none"></div>
                </div>

                {/* Chromas/Levels info */}
                {selectedSkin.chromas && selectedSkin.chromas.length > 1 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider mr-1">Variants</span>
                    {selectedSkin.chromas.slice(0, 6).map((chroma, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/10 overflow-hidden bg-white/5"
                      >
                        {chroma.swatch && (
                          <img src={chroma.swatch} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Select Button */}
                <button
                  onClick={confirmSelect}
                  className="group relative mt-4 w-full py-4 sm:py-5 overflow-hidden rounded-2xl font-black text-base sm:text-lg text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#ff4654]/25 hover:shadow-xl hover:shadow-[#ff4654]/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] via-[#ff5864] to-[#ff4654] bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] via-[#ff4654] to-[#ff6b6b] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  <span className="relative flex items-center justify-center gap-3 tracking-[0.2em] drop-shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    EQUIP SKIN
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">Select a skin to preview</p>
                <p className="text-gray-600 text-xs mt-1">Click any skin from the grid</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkinSelectorModal;
