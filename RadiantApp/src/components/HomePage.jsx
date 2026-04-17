import React, { useState, useMemo } from 'react';
import WeaponCard from './WeaponCard';
import SkinCard from './SkinCard';
import { MOCK_WEAPONS, MOCK_SKINS } from '../data/mockData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Use mock data instead of API calls
  const weapons = MOCK_WEAPONS;
  const skins = MOCK_SKINS;

  // Get unique weapon categories
  const categories = useMemo(() => {
    const cats = weapons
      .map((w) => w.category.replace('EEquippableCategory::', ''))
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
    return ['All', ...cats];
  }, []);

  // Filter weapons
  const filteredWeapons = useMemo(() => {
    return weapons.filter((weapon) => {
      const matchesSearch = weapon.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' ||
        weapon.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [weapons, searchQuery, selectedCategory]);

  // Filter skins
  const filteredSkins = useMemo(() => {
    return skins.filter((skin) => {
      const matchesSearch = skin.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch && skin.displayIcon;
    });
  }, [skins, searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-valorant">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-valorant-accent opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 left-0 w-96 h-96 bg-valorant-accent opacity-5 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">RADIANT</span>
              <br />
              <span className="text-valorant_light">ARMORY</span>
            </h1>
            <p className="text-xl md:text-2xl text-valorant_light text-opacity-80 mb-8 max-w-2xl mx-auto">
              Explore the ultimate collection of Valorant weapons and skins. Discover statistics, market value, and customize your arsenal.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search weapons and skins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="valorant-input text-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {/* Weapons Section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-valorant-accent">━</span> WEAPONS
              </h2>
              <p className="text-valorant_light text-opacity-60">Master your loadout</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-valorant-accent text-white'
                      : 'bg-valorant-secondary text-valorant_light hover:border-valorant-accent border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Weapons Grid */}
          {filteredWeapons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
              {filteredWeapons.map((weapon) => (
                <WeaponCard key={weapon.uuid} weapon={weapon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-valorant_light text-opacity-60 text-lg">
                No weapons found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Skins Section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-valorant-gold">━</span> FEATURED SKINS
              </h2>
              <p className="text-valorant_light text-opacity-60">Customize your weapons</p>
            </div>

            {/* View All Skins */}
            <button className="valorant-btn">
              View All Skins →
            </button>
          </div>

          {/* Skins Grid */}
          {filteredSkins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
              {filteredSkins.slice(0, 8).map((skin) => (
                <SkinCard key={skin.uuid} skin={skin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-valorant_light text-opacity-60 text-lg">
                No skins found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-valorant-secondary border border-valorant-accent border-opacity-20 rounded-xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            ARSENAL STATS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-valorant-accent mb-2">
                {weapons.length}
              </p>
              <p className="text-valorant_light text-opacity-60">Available Weapons</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-valorant-gold mb-2">
                {skins.length}
              </p>
              <p className="text-valorant_light text-opacity-60">Weapon Skins</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-valorant-accent mb-2">
                {categories.length - 1}
              </p>
              <p className="text-valorant_light text-opacity-60">Weapon Types</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-valorant-gold mb-2">
                100%
              </p>
              <p className="text-valorant_light text-opacity-60">Mock Data</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
