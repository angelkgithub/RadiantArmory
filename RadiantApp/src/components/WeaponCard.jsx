import React from 'react';
import { Link } from 'react-router-dom';

export default function WeaponCard({ weapon }) {
  return (
    <Link to={`/weapon/${weapon.uuid}`}>
      <div className="valorant-card group overflow-hidden">
        {/* Weapon Image */}
        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg bg-valorant-primary flex items-center justify-center">
          {weapon.displayIcon ? (
            <img
              src={weapon.displayIcon}
              alt={weapon.displayName}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="text-valorant_light text-opacity-50 text-center">
              <p className="text-sm">No image available</p>
            </div>
          )}
          {/* Overlay Badge */}
          <div className="absolute top-2 right-2 bg-valorant-accent px-3 py-1 rounded-full text-white text-xs font-bold">
            {weapon.category.replace('EEquippableCategory::', '')}
          </div>
        </div>

        {/* Weapon Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white group-hover:text-valorant-accent transition-colors">
            {weapon.displayName}
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            {weapon.weaponStats && (
              <>
                <div className="bg-valorant-primary rounded p-2">
                  <p className="text-valorant_light text-opacity-60">Damage</p>
                  <p className="text-valorant-accent font-bold">{weapon.weaponStats.damage}</p>
                </div>
                <div className="bg-valorant-primary rounded p-2">
                  <p className="text-valorant_light text-opacity-60">Range</p>
                  <p className="text-valorant-accent font-bold">{weapon.weaponStats.range}</p>
                </div>
                <div className="bg-valorant-primary rounded p-2">
                  <p className="text-valorant_light text-opacity-60">Cost</p>
                  <p className="text-valorant-gold font-bold">{weapon.shopData?.cost}</p>
                </div>
              </>
            )}
          </div>

          {/* Magazine Size */}
          {weapon.weaponStats?.magazineSize && (
            <div className="text-xs text-valorant_light text-opacity-70">
              Magazine: {weapon.weaponStats.magazineSize} rounds
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <button className="w-full valorant-btn-secondary text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
