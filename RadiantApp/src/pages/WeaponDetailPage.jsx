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
      <main className="min-h-screen bg-gradient-valorant py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-valorant_light mb-4">Weapon not found</p>
          <button onClick={() => navigate('/')} className="valorant-btn">
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-valorant py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-valorant-accent hover:text-valorant-gold transition-colors flex items-center gap-2"
        >
          ← Back to Weapons
        </button>

        {/* Weapon Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Weapon Image */}
          <div className="bg-valorant-secondary border border-valorant-accent border-opacity-20 rounded-xl p-8 flex items-center justify-center min-h-96">
            {weapon.displayIcon ? (
              <img
                src={weapon.displayIcon}
                alt={weapon.displayName}
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-valorant_light text-opacity-50">No image available</p>
            )}
          </div>

          {/* Weapon Info */}
          <div className="space-y-6">
            <div>
              <p className="text-valorant-accent uppercase text-sm font-bold mb-2">
                {weapon.category.replace('EEquippableCategory::', '')}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                {weapon.displayName}
              </h1>
              <p className="text-valorant_light text-opacity-80">
                {weapon.description || 'A formidable weapon in the Valorant arsenal.'}
              </p>
            </div>

            {/* Stats */}
            {weapon.weaponStats && (
              <div className="bg-valorant-secondary border border-valorant-accent border-opacity-20 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-valorant-accent">WEAPON STATS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-valorant_light text-opacity-60 text-sm">Damage</p>
                    <p className="text-2xl font-bold text-white">{weapon.weaponStats.damage}</p>
                  </div>
                  <div>
                    <p className="text-valorant_light text-opacity-60 text-sm">Range</p>
                    <p className="text-2xl font-bold text-white">{weapon.weaponStats.range}m</p>
                  </div>
                  <div>
                    <p className="text-valorant_light text-opacity-60 text-sm">Magazine Size</p>
                    <p className="text-2xl font-bold text-white">{weapon.weaponStats.magazineSize}</p>
                  </div>
                  <div>
                    <p className="text-valorant_light text-opacity-60 text-sm">Fire Rate</p>
                    <p className="text-2xl font-bold text-white">{weapon.weaponStats.fireRate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shop Data */}
            {weapon.shopData && (
              <div className="bg-gradient-accent rounded-lg p-6">
                <p className="text-white text-opacity-80 text-sm">Cost in Credits</p>
                <p className="text-3xl font-black text-white">{weapon.shopData.cost}</p>
              </div>
            )}

            {/* CTA */}
            <button className="valorant-btn w-full text-lg py-3">
              Equip This Weapon
            </button>
          </div>
        </div>

        {/* Associated Skins */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="text-valorant-gold">━</span> WEAPON SKINS
          </h2>

          {skins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skins.map((skin) => (
                <SkinCard key={skin.uuid} skin={skin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-valorant-secondary rounded-lg border border-valorant-accent border-opacity-20">
              <p className="text-valorant_light text-opacity-60">
                No skins available for this weapon yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
