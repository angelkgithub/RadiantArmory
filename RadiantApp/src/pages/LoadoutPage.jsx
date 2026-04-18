import { useState, useMemo } from 'react';
import { useGetAllWeaponsQuery, useGetWeaponSkinsQuery } from '../services/valorantApi';

function LoadoutPage() {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: skins = [] } = useGetWeaponSkinsQuery();

  const primaryWeapons = useMemo(
    () => weapons.filter(w => w.category === 'EEquippableCategory::Heavy' || 
                              w.category === 'EEquippableCategory::Rifle' ||
                              w.category === 'EEquippableCategory::Sniper'),
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
        <div className="text-white text-xl">Loading weapons...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          LOADOUT BUILDER
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weapon Selection */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#ff4654] mb-4">SELECT WEAPON</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {primaryWeapons.map((weapon) => (
                  <button
                    key={weapon.uuid}
                    onClick={() => handleWeaponSelect(weapon)}
                    className={`p-4 border-2 rounded transition-all duration-300 transform hover:scale-105 ${
                      selectedWeapon?.uuid === weapon.uuid
                        ? 'border-[#ff4654] bg-[#ff4654]/20'
                        : 'border-gray-600 bg-black/50 hover:border-[#ff4654]'
                    }`}
                  >
                    <div className="text-white font-bold text-center">
                      {weapon.displayName}
                    </div>
                    <div className="text-gray-400 text-sm text-center">
                      {Math.round(weapon.cost)} VP
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Selection */}
            {selectedWeapon && (
              <div>
                <h2 className="text-2xl font-bold text-[#ff4654] mb-4">SELECT SKIN</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {weaponSkins.slice(0, 12).map((skin) => (
                    <button
                      key={skin.uuid}
                      onClick={() => setSelectedSkin(skin)}
                      className={`p-3 border-2 rounded transition-all duration-300 transform hover:scale-105 ${
                        selectedSkin?.uuid === skin.uuid
                          ? 'border-[#ff4654] bg-[#ff4654]/20'
                          : 'border-gray-600 bg-black/50 hover:border-[#ff4654]'
                      }`}
                    >
                      {skin.displayIcon && (
                        <img
                          src={skin.displayIcon}
                          alt={skin.displayName}
                          className="w-full h-24 object-contain mb-2"
                        />
                      )}
                      <div className="text-white font-bold text-xs text-center truncate">
                        {skin.displayName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-[#ff4654] mb-6">PREVIEW</h2>

              {selectedWeapon ? (
                <div>
                  <div className="mb-6 p-4 bg-black/50 rounded">
                    {selectedSkin?.displayIcon ? (
                      <img
                        src={selectedSkin.displayIcon}
                        alt="skin preview"
                        className="w-full h-32 object-contain"
                      />
                    ) : selectedWeapon.displayIcon ? (
                      <img
                        src={selectedWeapon.displayIcon}
                        alt="weapon preview"
                        className="w-full h-32 object-contain"
                      />
                    ) : (
                      <div className="text-gray-500 text-center">No preview</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">WEAPON</p>
                      <p className="text-white font-bold">{selectedWeapon.displayName}</p>
                    </div>
                    {selectedSkin && (
                      <div>
                        <p className="text-gray-400 text-sm">SKIN</p>
                        <p className="text-white font-bold">{selectedSkin.displayName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 text-sm">COST</p>
                      <p className="text-[#ff4654] font-bold">
                        {Math.round(selectedWeapon.cost)} VP
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-[#ff4654] text-white font-bold hover:bg-[#ba3a46] transition-all rounded">
                      SAVE
                    </button>
                    <button className="flex-1 px-4 py-2 border-2 border-[#ff4654] text-[#ff4654] font-bold hover:bg-[#ff4654]/20 transition-all rounded">
                      RATE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Select a weapon to preview
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
