import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SkinCard from '../components/SkinCard';
import { MOCK_WEAPONS, MOCK_SKINS } from '../data/mockData';

export default function WeaponDetailPage() {
  const { weaponId } = useParams();
  const navigate = useNavigate();

  // Find weapon from mock data
  const weapon = useMemo(() => {
    return MOCK_WEAPONS.find(w => w.uuid === weaponId);
  }, [weaponId]);

  // Find associated skins
  const skins = useMemo(() => {
    if (!weapon) return [];
    // In real app, this would filter by weapon type
    return MOCK_SKINS.filter(skin => 
      skin.displayName.toLowerCase().includes(weapon.displayName.toLowerCase()) ||
      MOCK_SKINS.indexOf(skin) < 2 // Just show first 2 for demo
    );
  }, [weapon]);

  if (!weapon) {
    return (
      <main className="min-h-screen bg-[#111823] py-16 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl sm:text-2xl text-gray-300 mb-4">Weapon not found</p>
          <button onClick={() => navigate('/')} className="bg-[#ff4654] hover:bg-[#ff4654]/80 text-white font-bold px-6 py-3 rounded transition-colors">
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111823] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 sm:mb-8 text-[#ff4654] hover:text-[#ffbd3e] transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Weapons
        </button>

        {/* Weapon Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Weapon Image */}
          <div className="bg-[#1a2332] border border-[#ff4654]/20 rounded-xl p-4 sm:p-8 flex items-center justify-center min-h-[240px] sm:min-h-96">
            {weapon.displayIcon ? (
              <img
                src={weapon.displayIcon}
                alt={weapon.displayName}
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
          </div>

          {/* Weapon Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-[#ff4654] uppercase text-xs sm:text-sm font-bold mb-2">
                {weapon.category.replace('EEquippableCategory::', '')}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
                {weapon.displayName}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {weapon.description || 'A formidable weapon in the Valorant arsenal.'}
              </p>
            </div>

            {/* Stats */}
            {weapon.weaponStats && (
              <div className="bg-[#1a2332] border border-[#ff4654]/20 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ff4654]">WEAPON STATS</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Damage</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{weapon.weaponStats.damage}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Range</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{weapon.weaponStats.range}m</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Magazine Size</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{weapon.weaponStats.magazineSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Fire Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{weapon.weaponStats.fireRate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shop Data */}
            {weapon.shopData && (
              <div className="bg-gradient-to-r from-[#ff4654]/30 to-[#ba3a46]/30 rounded-lg p-4 sm:p-6">
                <p className="text-white/80 text-xs sm:text-sm">Cost in Credits</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{weapon.shopData.cost}</p>
              </div>
            )}

            {/* CTA */}
            <button className="bg-[#ff4654] hover:bg-[#ff4654]/80 text-white font-bold w-full text-base sm:text-lg py-3 rounded transition-colors">
              Equip This Weapon
            </button>
          </div>
        </div>

        {/* Associated Skins */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-white">
            <span className="text-[#ffbd3e]">━</span> WEAPON SKINS
          </h2>

          {skins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {skins.map((skin) => (
                <SkinCard key={skin.uuid} skin={skin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-[#1a2332] rounded-lg border border-[#ff4654]/20">
              <p className="text-gray-400">
                No skins available for this weapon yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
