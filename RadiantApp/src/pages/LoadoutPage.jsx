import { useState, useMemo } from 'react';
import { useGetAllWeaponsQuery, useGetWeaponSkinsQuery } from '../services/valorantApi';

function LoadoutPage() {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: skins = [] } = useGetWeaponSkinsQuery();

  // Map API categories to display names
  const categoryMap = {
    'EEquippableCategory::Sidearm': 'SIDEARMS',
    'EEquippableCategory::SMG': 'SMGS',
    'EEquippableCategory::Rifle': 'RIFLES',
    'EEquippableCategory::Sniper': 'SNIPER RIFLES',
    'EEquippableCategory::Shotgun': 'SHOTGUNS',
    'EEquippableCategory::Heavy': 'MACHINE GUNS',
    'EEquippableCategory::Melee': 'MELEE'
  };

  const weaponsByCategory = useMemo(
    () => {
      const grouped = {};
      weapons.forEach(weapon => {
        const categoryName = categoryMap[weapon.category] || 'OTHER';
        if (!grouped[categoryName]) grouped[categoryName] = [];
        grouped[categoryName].push(weapon);
      });
      return grouped;
    },
    [weapons]
  );

  const weaponSkins = useMemo(
    () => {
      if (!selectedWeapon) return [];
      return skins.filter(s => s.weaponId === selectedWeapon.uuid);
    },
    [selectedWeapon, skins]
  );

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapon(weapon);
    setSelectedSkin(null);
  };

  if (weaponsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading arsenal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-16">
      <div className="w-full">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-wider">
            LOADOUT BUILDER
          </h1>
          <div className="w-24 h-1 bg-[#ff4654] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Weapons Section */}
          <div className="lg:col-span-2">
            {/* Weapon Categories */}
            {Object.entries(weaponsByCategory).map(([category, categoryWeapons]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-wider">
                  {category}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryWeapons.map((weapon) => (
                    <button
                      key={weapon.uuid}
                      onClick={() => handleWeaponSelect(weapon)}
                      className={`group relative overflow-hidden rounded border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedWeapon?.uuid === weapon.uuid
                          ? 'border-[#ff4654] bg-[#ff4654]/30 shadow-lg shadow-[#ff4654]/50'
                          : 'border-gray-700 bg-black/60 hover:border-[#ff4654]'
                      }`}
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff4654]/0 to-[#000000]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative p-4 flex flex-col items-center justify-center min-h-[200px]">
                        {weapon.displayIcon && (
                          <img
                            src={weapon.displayIcon}
                            alt={weapon.displayName}
                            className="w-4/5 h-24 object-contain mb-3 drop-shadow-lg"
                          />
                        )}
                        <div className="text-center">
                          <p className="text-white font-bold text-sm truncate">
                            {weapon.displayName}
                          </p>
                          <p className="text-[#ff4654] text-xs font-semibold mt-1">
                            {Math.round(weapon.cost)} VP
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Preview & Skin Selection Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-gradient-to-br from-[#ff4654]/20 to-[#1a1a2e]/50 border-2 border-[#ff4654] rounded-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-[#ff4654] tracking-wider">
                PREVIEW
              </h2>

              {selectedWeapon ? (
                <div className="space-y-6">
                  {/* Weapon Preview */}
                  <div className="bg-black/70 rounded border border-[#ff4654]/30 p-4 text-center">
                    {selectedSkin?.displayIcon ? (
                      <img
                        src={selectedSkin.displayIcon}
                        alt="skin preview"
                        className="w-full h-40 object-contain"
                      />
                    ) : selectedWeapon.displayIcon ? (
                      <img
                        src={selectedWeapon.displayIcon}
                        alt="weapon preview"
                        className="w-full h-40 object-contain"
                      />
                    ) : (
                      <div className="text-gray-500 text-center py-8">No preview</div>
                    )}
                  </div>

                  {/* Weapon Details */}
                  <div className="space-y-3 bg-black/40 rounded p-4">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase">Weapon</p>
                      <p className="text-white font-bold">{selectedWeapon.displayName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase">Cost</p>
                      <p className="text-[#ff4654] font-bold text-lg">{Math.round(selectedWeapon.cost)} VP</p>
                    </div>
                  </div>

                  {/* Skin Selection */}
                  {weaponSkins.length > 0 && (
                    <div>
                      <p className="text-gray-300 text-xs font-semibold uppercase mb-2">
                        Available Skins ({weaponSkins.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {weaponSkins.slice(0, 9).map((skin) => (
                          <button
                            key={skin.uuid}
                            onClick={() => setSelectedSkin(skin)}
                            className={`rounded border transition-all duration-200 overflow-hidden ${
                              selectedSkin?.uuid === skin.uuid
                                ? 'border-[#ff4654] bg-[#ff4654]/40 scale-110'
                                : 'border-gray-600 bg-black/50 hover:border-[#ff4654]'
                            }`}
                            title={skin.displayName}
                          >
                            {skin.displayIcon && (
                              <img
                                src={skin.displayIcon}
                                alt={skin.displayName}
                                className="w-full h-12 object-contain"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-3 py-2 bg-[#ff4654] text-white font-bold text-sm rounded hover:bg-[#ba3a46] transition-all uppercase tracking-wide">
                      Save
                    </button>
                    <button className="flex-1 px-3 py-2 border-2 border-[#ff4654] text-[#ff4654] font-bold text-sm rounded hover:bg-[#ff4654]/20 transition-all uppercase tracking-wide">
                      Rate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <p className="text-sm">Select a weapon to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadoutPage;
