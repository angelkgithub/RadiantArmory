import { useState, useMemo } from 'react';
import {
  useGetAllWeaponsQuery,
  useGetPlayerCardsQuery,
  useGetSpraysQuery
} from '../services/valorantApi';

import SkinSelectorModal from '../components/SkinSelectorModal';

function LoadoutBuilder() {
  const [selectedWeapons, setSelectedWeapons] = useState({});
  const [selectedSprays, setSelectedSprays] = useState([null, null, null, null]);

  const [selectedWeaponForModal, setSelectedWeaponForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 LOADOUT
  const [loadout, setLoadout] = useState({});

  // 👀 SKIN PREVIEW
  const [previewSkin, setPreviewSkin] = useState(null);

  // 👀 PLAYER CARD STATES (ADDED)
  const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
  const [previewPlayerCard, setPreviewPlayerCard] = useState(null);
  const [isPlayerCardOpen, setIsPlayerCardOpen] = useState(false);

  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: playerCards = [] } = useGetPlayerCardsQuery();
  const { data: sprays = [] } = useGetSpraysQuery();

  const columnLayout = [
    {
      column: 1,
      categories: [{ categoryKey: 'EEquippableCategory::Sidearm', name: 'SIDEARMS' }]
    },
    {
      column: 2,
      categories: [
        { categoryKey: 'EEquippableCategory::SMG', name: 'SMGS' },
        { categoryKey: 'EEquippableCategory::Shotgun', name: 'SHOTGUNS' }
      ]
    },
    {
      column: 3,
      categories: [
        { categoryKey: 'EEquippableCategory::Rifle', name: 'RIFLES' },
        { categoryKey: 'EEquippableCategory::Melee', name: 'MELEE' }
      ]
    },
    {
      column: 4,
      categories: [
        { categoryKey: 'EEquippableCategory::Sniper', name: 'SNIPER RIFLES' },
        { categoryKey: 'EEquippableCategory::Heavy', name: 'MACHINE GUNS' }
      ]
    }
  ];

  const weaponOrder = {
    'EEquippableCategory::Sidearm': ['Classic', 'Shorty', 'Frenzy', 'Ghost', 'Bandit', 'Sheriff'],
    'EEquippableCategory::SMG': ['Stinger', 'Spectre'],
    'EEquippableCategory::Shotgun': ['Bucky', 'Judge'],
    'EEquippableCategory::Rifle': ['Bulldog', 'Guardian', 'Phantom', 'Vandal'],
    'EEquippableCategory::Sniper': ['Marshal', 'Outlaw', 'Operator'],
    'EEquippableCategory::Heavy': ['Ares', 'Odin'],
    'EEquippableCategory::Melee': ['Melee'],
  };

  const weaponsByCategory = useMemo(() => {
    const grouped = {};

    columnLayout.forEach(column => {
      column.categories.forEach(({ categoryKey }) => {
        const categoryWeapons = weapons.filter(w => w.category === categoryKey);
        const order = weaponOrder[categoryKey] || [];

        grouped[categoryKey] = order
          .map(name => categoryWeapons.find(w => w.displayName === name))
          .filter(Boolean);
      });
    });

    return grouped;
  }, [weapons]);

  const totalCost = useMemo(() => {
    return Object.values(selectedWeapons).reduce(
      (sum, w) => sum + (w.cost || 0),
      0
    );
  }, [selectedWeapons]);

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapons(prev => ({
      ...prev,
      [weapon.uuid]: weapon
    }));
  };

  if (weaponsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          Loading arsenal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] overflow-auto"
      style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #111823 100%)' }}>

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-[#ff4654]/30 px-6 py-3 flex justify-between items-center">
        <div className="text-3xl font-black text-[#ff4654] tracking-wider">
          TOTAL COST: {totalCost.toLocaleString()} VP
        </div>
      </div>

      {/* MAIN */}
      <div className="flex min-h-[calc(100vh-80px)] gap-6 p-6">

        {/* LEFT WEAPONS */}
        <div className="flex-1 overflow-auto flex gap-8">

          {columnLayout.map(({ column, categories }) => (
            <div key={column} className="w-48 flex-shrink-0 space-y-8">

              {categories.map(({ categoryKey, name }) => (
                <div key={categoryKey}>

                  <h2 className="text-lg font-black text-white mb-4 uppercase">
                    {name}
                  </h2>

                  <div className="space-y-2">

                    {weaponsByCategory[categoryKey]?.map((weapon) => {
                      const skin = loadout[weapon.uuid]?.skin;

                      return (
                        <div key={weapon.uuid} className="cursor-pointer group relative">

                          <div
                            onClick={() => handleWeaponSelect(weapon)}
                            className={`relative h-24 border-2 overflow-hidden transition-all duration-200 ${
                              selectedWeapons[weapon.uuid]
                                ? 'border-[#ff4654] bg-[#ff4654]/20'
                                : 'border-gray-700 bg-gray-900/40 group-hover:border-[#ff4654]'
                            }`}
                          >
                            <img
                              src={skin?.displayIcon || weapon.displayIcon}
                              className="w-full h-full object-contain p-2"
                            />

                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                              <p className="text-white text-xs font-bold truncate">
                                {weapon.displayName}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedWeaponForModal(weapon);
                              setIsModalOpen(true);
                            }}
                            className="mt-1 w-full px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#ff4654] to-[#ba3a46] border border-[#ff4654] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:shadow-lg hover:shadow-[#ff4654]/50 uppercase tracking-wider"
                          >
                            Skins
                          </button>
                        </div>
                      );
                    })}

                  </div>
                </div>
              ))}

            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-shrink-0 flex flex-col gap-6" style={{ width: '268px' }}>

          {/* PLAYER CARD */}
          <div className="relative overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 98% 95%, 0 100%)',
              width: '268px',
              height: '640px'
            }}
          >
            <div className="border-4 border-[#ff4654] w-full h-full relative">

              <img
                src={
                  selectedPlayerCard?.largeArt ||
                  previewPlayerCard?.wideArt ||
                  previewPlayerCard?.displayArt ||
                  playerCards?.[0]?.displayArt
                }
                className="w-full h-full object-cover absolute inset-0"
              />

            </div>
          </div>

          {/* 🔥 PLAYER CARD BUTTON (ADDED) */}
          <button
            onClick={() => setIsPlayerCardOpen(true)}
            className="w-full py-2 bg-[#ff4654] text-white font-bold rounded"
          >
            CHANGE PLAYER CARD
          </button>

          {/* SKIN PREVIEW */}
          {previewSkin && (
            <div className="bg-black/40 border border-[#ff4654] p-2 rounded">

              <p className="text-white text-xs mb-2 font-bold">
                SKIN PREVIEW
              </p>

              {previewSkin.streamedVideo ? (
                <video
                  src={previewSkin.streamedVideo}
                  autoPlay
                  loop
                  muted
                  className="w-full h-32 object-cover"
                />
              ) : (
                <img
                  src={previewSkin.displayIcon}
                  className="w-full h-32 object-contain"
                />
              )}

              <p className="text-gray-300 text-xs mt-1">
                {previewSkin.displayName}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* PLAYER CARD MODAL (ADDED) */}
      {isPlayerCardOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 w-[800px] max-h-[80vh] overflow-auto border border-[#ff4654]">

            <h2 className="text-white font-bold mb-4">Select Player Card</h2>

            <div className="grid grid-cols-4 gap-3">
              {playerCards.map((card) => (
                <div
                  key={card.uuid}
                  className="cursor-pointer border border-gray-700 hover:border-[#ff4654]"
                  onMouseEnter={() => setPreviewPlayerCard(card)}
                  onClick={() => {
                    setSelectedPlayerCard(card);
                    setIsPlayerCardOpen(false);
                  }}
                >
                  <img src={card.displayIcon} className="w-full" />
                  <p className="text-white text-xs">{card.displayName}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsPlayerCardOpen(false)}
              className="mt-4 w-full py-2 bg-gray-700 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SKIN MODAL */}
      <SkinSelectorModal
        isOpen={isModalOpen}
        weapon={selectedWeaponForModal}
        onClose={() => setIsModalOpen(false)}
        onPreviewSkin={setPreviewSkin}
        onSelectSkin={(skin) => {
          setLoadout(prev => ({
            ...prev,
            [selectedWeaponForModal.uuid]: {
              weapon: selectedWeaponForModal,
              skin
            }
          }));
          setPreviewSkin(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default LoadoutBuilder;
