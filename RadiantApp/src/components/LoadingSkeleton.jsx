import React from 'react';

export default function LoadingSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="valorant-card animate-pulse">
          <div className="w-full h-64 mb-4 bg-valorant-primary rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-6 bg-valorant-primary rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 bg-valorant-primary rounded"></div>
              <div className="h-12 bg-valorant-primary rounded"></div>
              <div className="h-12 bg-valorant-primary rounded"></div>
            </div>
            <div className="h-4 bg-valorant-primary rounded w-1/2"></div>
            <div className="h-10 bg-valorant-primary rounded w-full mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
}
