import React, { useState, useMemo, useEffect } from 'react';
import { useGetWeaponSkinsQuery } from '../services/valorantApi';

const SkinSelectorModal = ({ isOpen, onClose, weapon, onSelectSkin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkin, setSelectedSkin] = useState(null);

  const { data: allSkins = [] } = useGetWeaponSkinsQuery();

  useEffect(() => {
    setSearchTerm('');
    setCurrentPage(1);
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

  const SKINS_PER_PAGE = 12; // 4x3 grid
  const totalPages = Math.ceil(weaponSkins.length / SKINS_PER_PAGE);
  const startIdx = (currentPage - 1) * SKINS_PER_PAGE;
  const paginatedSkins = weaponSkins.slice(startIdx, startIdx + SKINS_PER_PAGE);

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-[#ff4654] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-white font-bold">
            {weapon.displayName} Skins
          </h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>

        <div className="flex">

          {/* LEFT SIDE */}
          <div className="w-3/5 p-4">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search skins..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />

            {/* GRID 4x3 */}
            <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[60vh]">
              {paginatedSkins.map((skin) => (
                <div
                  key={skin.uuid}
                  onClick={() => handleSelectSkin(skin)}
                  className={`cursor-pointer border p-2 rounded transition ${
                    selectedSkin?.uuid === skin.uuid
                      ? 'border-[#ff4654]'
                      : 'border-gray-700'
                  }`}
                >
                  {skin.displayIcon ? (
                    <img src={skin.displayIcon} alt="" className="w-full" />
                  ) : (
                    <div className="h-20 bg-gray-700" />
                  )}
                  <p className="text-white text-xs mt-1 truncate">
                    {skin.displayName}
                  </p>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-3 gap-2 text-white">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>←</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={p === currentPage ? 'text-[#ff4654]' : ''}
                >
                  {p}
                </button>
              ))}

              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>→</button>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW */}
          <div className="w-2/5 p-4 bg-gray-800 flex flex-col">

            {selectedSkin ? (
              <>
                <h3 className="text-white font-bold mb-2">
                  {selectedSkin.displayName}
                </h3>

                {/* VIDEO FIX */}
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
                    className="w-full rounded"
                  />
                ) : (
                  <div className="text-gray-400">No preview</div>
                )}

                {/* 🔥 SELECT BUTTON (NEW) */}
                <button
                  onClick={confirmSelect}
                  className="mt-4 w-full py-2 bg-[#ff4654] text-white font-bold rounded hover:bg-red-600 transition"
                >
                  SELECT
                </button>
              </>
            ) : (
              <p className="text-gray-400">Select a skin</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkinSelectorModal;
