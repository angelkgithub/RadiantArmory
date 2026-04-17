import React from 'react';

export default function SkinCard({ skin }) {
  return (
    <div className="valorant-card group overflow-hidden">
      {/* Skin Image */}
      <div className="relative w-full h-72 mb-4 overflow-hidden rounded-lg bg-valorant-primary flex items-center justify-center">
        {skin.displayIcon ? (
          <img
            src={skin.displayIcon}
            alt={skin.displayName}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        ) : skin.chromas?.[0]?.fullRender ? (
          <img
            src={skin.chromas[0].fullRender}
            alt={skin.displayName}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-valorant_light text-opacity-50 text-center">
            <p className="text-sm">No image available</p>
          </div>
        )}
        {/* Rarity Badge */}
        {skin.contentTierUuid && (
          <div className="absolute top-2 right-2 bg-valorant-accent px-3 py-1 rounded-full text-white text-xs font-bold">
            Skin
          </div>
        )}
      </div>

      {/* Skin Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-valorant-accent transition-colors line-clamp-2">
          {skin.displayName}
        </h3>

        {/* Weapon Type */}
        {skin.levels && skin.levels[0]?.levelItem && (
          <p className="text-sm text-valorant_light text-opacity-70">
            {skin.levels[0].levelItem}
          </p>
        )}

        {/* Chromas Count */}
        {skin.chromas && skin.chromas.length > 0 && (
          <div className="text-xs text-valorant-gold font-semibold">
            {skin.chromas.length} Chromas
          </div>
        )}

        {/* CTA */}
        <button className="w-full valorant-btn-secondary text-sm mt-3 hover:bg-valorant-accent hover:text-white">
          View Skin
        </button>
      </div>
    </div>
  );
}
