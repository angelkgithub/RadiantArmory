import React, { useState, useMemo } from "react";

const PlayerCardSelectorModal = ({
  isOpen,
  onClose,
  cards,
  onPreview,
  onSelect, // 🔥 ADDED
}) => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 9;

  if (!isOpen) return null;

  // 🔥 FILTER + SEARCH
  const filtered = cards?.filter((c) =>
    c.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 PAGINATION
  const totalPages = Math.ceil((filtered?.length || 0) / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered?.slice(start, start + perPage);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-gray-900 w-[900px] h-[600px] border border-[#ff4654] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">

          {/* SEARCH (TOP CENTER LIKE YOU WANTED) */}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search player cards..."
            className="bg-gray-800 text-white px-3 py-1 w-1/2 rounded"
          />

          <button onClick={onClose} className="text-white text-xl font-bold">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1">

          {/* GRID */}
          <div className="w-2/3 p-4 overflow-y-auto grid grid-cols-3 gap-3">

            {paginated?.map((card) => (
              <div
                key={card.uuid}
                onClick={() => {
                  setSelected(card);
                  onPreview?.(card);
                }}
                className={`cursor-pointer border p-2 ${
                  selected?.uuid === card.uuid
                    ? "border-[#ff4654]"
                    : "border-gray-700"
                }`}
              >
                <img src={card.displayArt} />
                <p className="text-white text-xs">{card.displayName}</p>
              </div>
            ))}

          </div>

          {/* PREVIEW */}
          <div className="w-1/3 bg-gray-800 p-3 flex flex-col">

            {selected ? (
              <>
                {/* 🔥 DISPLAY LOGIC FIXED */}
                <img
                  src={
                    selected.largeArt ||
                    selected.wideArt ||
                    selected.displayArt
                  }
                  className="w-full mb-3"
                />

                <p className="text-white text-sm font-bold">
                  {selected.displayName}
                </p>

                {/* SELECT BUTTON (ADDED LIKE YOU REQUESTED) */}
                <button
                  onClick={() => {
                    onSelect?.(selected);
                    onClose();
                  }}
                  className="mt-3 bg-[#ff4654] py-2 font-bold text-white rounded"
                >
                  SELECT
                </button>

              </>
            ) : (
              <p className="text-gray-400">Select a card</p>
            )}
          </div>

        </div>

        {/* PAGINATION (BOTTOM LIKE YOUR FORMAT) */}
        <div className="flex justify-center items-center gap-3 p-2 border-t border-gray-700 text-white">

          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span
              key={p}
              onClick={() => setPage(p)}
              className={`cursor-pointer ${
                p === page ? "text-[#ff4654]" : ""
              }`}
            >
              {p}
            </span>
          ))}

          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            →
          </button>

        </div>

      </div>
    </div>
  );
};

export default PlayerCardSelectorModal;
