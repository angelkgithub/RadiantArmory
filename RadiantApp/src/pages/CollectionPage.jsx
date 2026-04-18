import { useState, useMemo } from 'react';
import { useGetWeaponSkinsQuery, useGetAllWeaponsQuery } from '../services/valorantApi';

function CollectionPage() {
  const [ownedSkins, setOwnedSkins] = useState(new Set());
  const [selectedRarity, setSelectedRarity] = useState('all');
  const { data: skins = [], isLoading: skinsLoading } = useGetWeaponSkinsQuery();
  const { data: weapons = [] } = useGetAllWeaponsQuery();

  const rarityMap = {
    'EEquippableRarity::Rare': 'Rare',
    'EEquippableRarity::Epic': 'Epic',
    'EEquippableRarity::Exclusive': 'Exclusive',
    'EEquippableRarity::Premium': 'Premium',
  };

  const filteredSkins = useMemo(() => {
    let result = skins.filter(s => s.displayName && s.displayIcon);

    if (selectedRarity !== 'all') {
      result = result.filter(s => {
        const rarity = rarityMap[s.rarity] || '';
        return rarity.toLowerCase() === selectedRarity.toLowerCase();
      });
    }

    return result.slice(0, 50);
  }, [skins, selectedRarity]);

  const toggleSkinOwnership = (skinId) => {
    const newOwned = new Set(ownedSkins);
    if (newOwned.has(skinId)) {
      newOwned.delete(skinId);
    } else {
      newOwned.add(skinId);
    }
    setOwnedSkins(newOwned);
  };

  const rarities = useMemo(() => {
    return ['Rare', 'Epic', 'Exclusive', 'Premium'];
  }, []);

  const totalValue = useMemo(() => {
    return filteredSkins
      .filter(s => ownedSkins.has(s.uuid))
      .reduce((acc, s) => acc + (s.cost || 0), 0);
  }, [filteredSkins, ownedSkins]);

  const rarityBreakdown = useMemo(() => {
    const breakdown = {};
    filteredSkins.forEach(s => {
      if (ownedSkins.has(s.uuid)) {
        const rarity = rarityMap[s.rarity] || 'Unknown';
        breakdown[rarity] = (breakdown[rarity] || 0) + 1;
      }
    });
    return breakdown;
  }, [filteredSkins, ownedSkins]);

  if (skinsLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading skins...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          SKIN COLLECTION TRACKER
        </h1>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">TOTAL VALUE</p>
            <p className="text-4xl font-bold text-[#ff4654]">
              {Math.round(totalValue)} VP
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">SKINS OWNED</p>
            <p className="text-4xl font-bold text-[#ff4654]">
              {ownedSkins.size}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">COMPLETION</p>
            <p className="text-4xl font-bold text-[#ff4654]">
              {Math.round((ownedSkins.size / Math.max(filteredSkins.length, 1)) * 100)}%
            </p>
          </div>
        </div>

        {/* Rarity Breakdown */}
        <div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-[#ff4654] mb-4">RARITY BREAKDOWN</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(rarityBreakdown).map(([rarity, count]) => (
              <div
                key={rarity}
                className="bg-black/50 p-4 rounded text-center border-l-4 border-[#ff4654]"
              >
                <p className="text-gray-400 text-sm mb-1">{rarity}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#ff4654] mb-4">FILTER BY RARITY</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedRarity('all')}
              className={`px-4 py-2 rounded font-bold transition-all ${
                selectedRarity === 'all'
                  ? 'bg-[#ff4654] text-white'
                  : 'bg-black/50 text-gray-300 border-2 border-gray-600 hover:border-[#ff4654]'
              }`}
            >
              ALL
            </button>
            {rarities.map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                  selectedRarity === rarity
                    ? 'bg-[#ff4654] text-white'
                    : 'bg-black/50 text-gray-300 border-2 border-gray-600 hover:border-[#ff4654]'
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredSkins.map(skin => (
            <button
              key={skin.uuid}
              onClick={() => toggleSkinOwnership(skin.uuid)}
              className={`relative group overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                ownedSkins.has(skin.uuid)
                  ? 'border-[#ff4654] bg-[#ff4654]/10'
                  : 'border-gray-600 bg-black/30 hover:border-[#ff4654]'
              }`}
            >
              <img
                src={skin.displayIcon}
                alt={skin.displayName}
                className="w-full h-32 object-contain p-2"
              />
              <div className="p-2 text-center">
                <p className="text-white font-bold text-xs mb-1 truncate">
                  {skin.displayName}
                </p>
                <p className="text-[#ff4654] text-xs font-bold">
                  {Math.round(skin.cost || 0)} VP
                </p>
              </div>
              {ownedSkins.has(skin.uuid) && (
                <div className="absolute top-2 right-2 bg-[#ff4654] rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Rating Section */}
        <div className="mt-12 bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-[#ff4654] mb-4">RATE YOUR INVENTORY</h2>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className="text-4xl hover:scale-125 transition-transform"
              >
                ⭐
              </button>
            ))}
          </div>
          <button className="px-6 py-3 bg-[#ff4654] text-white font-bold hover:bg-[#ba3a46] transition-all rounded">
            SUBMIT RATING
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
