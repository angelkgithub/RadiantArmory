import { useState, useMemo } from 'react';
import {
  useGetAllWeaponsQuery,
  useGetPlayerCardsQuery,
  useGetSpraysQuery
} from '../services/valorantApi';
import SkinSelectorModal from '../components/SkinSelectorModal';

const BG_IMAGE = 'https://res.cloudinary.com/dc3erz7jd/image/upload/v1776517268/1868991-3000x1688-desktop-hd-valorant-background_j8bxeb.jpg';

function LoadoutBuilder() {
  const [selectedWeapons, setSelectedWeapons] = useState({});
  const [selectedWeaponForModal, setSelectedWeaponForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadout, setLoadout] = useState({});
  const [previewSkin, setPreviewSkin] = useState(null);
  const [selectedPlayerCard, setSelectedPlayerCard] = useState(null);
  const [previewPlayerCard, setPreviewPlayerCard] = useState(null);
  const [isPlayerCardOpen, setIsPlayerCardOpen] = useState(false);

  const { data: weapons = [], isLoading: weaponsLoading } = useGetAllWeaponsQuery();
  const { data: playerCards = [] } = useGetPlayerCardsQuery();
  const { data: sprays = [] } = useGetSpraysQuery();

  const columnLayout = [
    { column: 1, categories: [{ categoryKey: 'EEquippableCategory::Sidearm', name: 'SIDEARMS' }] },
    { column: 2, categories: [{ categoryKey: 'EEquippableCategory::SMG', name: 'SMGS' }, { categoryKey: 'EEquippableCategory::Shotgun', name: 'SHOTGUNS' }] },
    { column: 3, categories: [{ categoryKey: 'EEquippableCategory::Rifle', name: 'RIFLES' }, { categoryKey: 'EEquippableCategory::Melee', name: 'MELEE' }] },
    { column: 4, categories: [{ categoryKey: 'EEquippableCategory::Sniper', name: 'SNIPER RIFLES' }, { categoryKey: 'EEquippableCategory::Heavy', name: 'MACHINE GUNS' }] },
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

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapons(prev => ({ ...prev, [weapon.uuid]: weapon }));
  };

  if (weaponsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff4654]/30 border-t-[#ff4654] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-auto">
      {/* Background Image */}
      <img
        src={BG_IMAGE}
        alt=""
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />
      <div className="fixed inset-0 bg-[#0a0e27]/80" style={{ zIndex: 0 }} />

      {/* Content */}
      <div className="relative flex flex-col lg:flex-row min-h-screen gap-4 sm:gap-6 p-3 sm:p-6 pt-20" style={{ zIndex: 1 }}>

        {/* LEFT — Weapons Grid */}
        <div className="flex-1 overflow-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {columnLayout.map(({ column, categories }) => (
            <div key={column} className="space-y-6 sm:space-y-8">
              {categories.map(({ categoryKey, name }) => (
                <div key={categoryKey}>
                  <h2 className="text-sm sm:text-lg font-black text-white mb-3 sm:mb-4 uppercase tracking-wider">
                    {name}
                  </h2>
                  <div className="space-y-2">
                    {weaponsByCategory[categoryKey]?.map((weapon) => {
                      const skin = loadout[weapon.uuid]?.skin;
                      return (
                        <div key={weapon.uuid} className="cursor-pointer group relative">
                          <div
                            onClick={() => handleWeaponSelect(weapon)}
                            className={`relative h-24 border-2 overflow-hidden transition-all duration-200 rounded-lg ${
                              selectedWeapons[weapon.uuid]
                                ? 'border-[#ff4654] bg-[#ff4654]/20 shadow-lg shadow-[#ff4654]/10'
                                : 'border-white/10 bg-black/50 backdrop-blur-sm group-hover:border-[#ff4654]/60'
                            }`}
                          >
                            <img
                              src={skin?.displayIcon || weapon.displayIcon}
                              alt={weapon.displayName}
                              className="w-full h-full object-contain p-2"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                              <p className="text-white text-xs font-bold truncate">{weapon.displayName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => { setSelectedWeaponForModal(weapon); setIsModalOpen(true); }}
                            className="mt-1 w-full px-2 py-1 text-xs font-bold text-[#ff4654] h-8 border-2 border-[#ff4654] rounded relative overflow-hidden transition-all duration-500 ease-in hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-wider opacity-0 group-hover:opacity-100"
                            style={{
                              background: 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            {/* Skew gradient backgrounds */}
                            <div 
                              className="absolute top-0 -left-1.5 w-0 h-full bg-[#ff4654] transition-all duration-500 group-hover:w-1/2 skew-x-12 z-0"
                            />
                            <div 
                              className="absolute top-0 -right-1.5 w-0 h-full bg-[#ff6b6b] transition-all duration-500 group-hover:w-1/2 -skew-x-12 z-0"
                            />
                            
                            {/* Text */}
                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                              Skins
                            </span>
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

        {/* RIGHT — Player Card + Preview */}
        <div className="flex-shrink-0 flex flex-col gap-4 sm:gap-6 w-full lg:w-[268px]">
          {/* Player Card */}
          <div
            className="relative overflow-hidden hidden lg:block border-4 border-[#ff4654] rounded-lg"
            style={{ clipPath: 'polygon(0 0, 100% 0, 98% 95%, 0 100%)', width: '268px', height: '640px' }}
          >
            <img
              src={
                selectedPlayerCard?.largeArt ||
                previewPlayerCard?.wideArt ||
                previewPlayerCard?.displayArt ||
                playerCards?.[0]?.displayArt
              }
              alt=""
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>

          <button
            onClick={() => setIsPlayerCardOpen(true)}
            className="w-full h-12 rounded-lg border-2 border-[#ff4654] relative overflow-hidden transition-all duration-500 ease-in hover:scale-[1.02] active:scale-[0.98] group"
            style={{
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {/* Skew gradient backgrounds */}
            <div 
              className="absolute top-0 -left-2.5 w-0 h-full bg-[#ff4654] transition-all duration-500 group-hover:w-1/2 skew-x-12 z-0"
            />
            <div 
              className="absolute top-0 -right-2.5 w-0 h-full bg-[#ff6b6b] transition-all duration-500 group-hover:w-1/2 -skew-x-12 z-0"
            />
            
            {/* Text */}
            <span className="relative z-10 flex items-center justify-center h-full text-[#ff4654] group-hover:text-white transition-colors duration-300 font-bold text-sm uppercase tracking-wider">
              Change Player Card
            </span>
          </button>

          {/* Skin Preview */}
          {previewSkin && (
            <div className="bg-black/60 backdrop-blur-sm border border-[#ff4654]/40 p-3 rounded-xl">
              <p className="text-white text-xs mb-2 font-bold uppercase tracking-wider">Skin Preview</p>
              {previewSkin.streamedVideo ? (
                <video src={previewSkin.streamedVideo} autoPlay loop muted className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <img src={previewSkin.displayIcon} alt="" className="w-full h-32 object-contain" />
              )}
              <p className="text-gray-300 text-xs mt-1">{previewSkin.displayName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Player Card Modal */}
      {isPlayerCardOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1117] border border-white/10 p-5 w-full max-w-[800px] max-h-[80vh] overflow-auto rounded-2xl shadow-2xl">
            <h2 className="text-white font-black mb-4 text-lg tracking-wider uppercase">Select Player Card</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {playerCards.map((card) => (
                <div
                  key={card.uuid}
                  className="cursor-pointer border-2 border-white/10 hover:border-[#ff4654] rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                  onMouseEnter={() => setPreviewPlayerCard(card)}
                  onClick={() => { setSelectedPlayerCard(card); setIsPlayerCardOpen(false); }}
                >
                  <img src={card.displayIcon} alt={card.displayName} className="w-full" />
                  <p className="text-white text-xs p-1 truncate">{card.displayName}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsPlayerCardOpen(false)}
              className="mt-4 w-full h-10 border-2 border-[#ff4654] text-[#ff4654] font-bold rounded-lg relative overflow-hidden transition-all duration-500 ease-in hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-wider text-sm"
              style={{
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {/* Skew gradient backgrounds */}
              <div 
                className="absolute top-0 -left-2.5 w-0 h-full bg-[#ff4654] transition-all duration-500 group-hover:w-1/2 skew-x-12 z-0"
              />
              <div 
                className="absolute top-0 -right-2.5 w-0 h-full bg-[#ff6b6b] transition-all duration-500 group-hover:w-1/2 -skew-x-12 z-0"
              />
              
              {/* Text */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Close
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Skin Modal */}
      <SkinSelectorModal
        isOpen={isModalOpen}
        weapon={selectedWeaponForModal}
        onClose={() => setIsModalOpen(false)}
        onPreviewSkin={setPreviewSkin}
        onSelectSkin={(skin) => {
          setLoadout(prev => ({
            ...prev,
            [selectedWeaponForModal.uuid]: { weapon: selectedWeaponForModal, skin }
          }));
          setPreviewSkin(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default LoadoutBuilder;
