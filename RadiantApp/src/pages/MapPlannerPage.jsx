import { useRef, useState, useEffect } from 'react';
import { useGetAllMapsQuery } from '../services/valorantApi';

function MapPlannerPage() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('draw');
  const [selectedMap, setSelectedMap] = useState(null);
  const { data: maps = [], isLoading } = useGetAllMapsQuery();

  const playableMaps = maps.filter(m => m.displayName && m.mapUrl);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMap) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = selectedMap.displayIcon;
  }, [selectedMap]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');

    if (selectedTool === 'draw') {
      ctx.strokeStyle = '#ff4654';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (selectedTool === 'smoke') {
      ctx.fillStyle = 'rgba(255, 70, 84, 0.3)';
      ctx.fillRect(x - 20, y - 20, 40, 40);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMap) return;

    const ctx = canvas.getContext('2d');
    // Clear entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the map background
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = selectedMap.displayIcon;
  };

  const saveStrategy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `strategy-${selectedMap.displayName}.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading maps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111823] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          INTERACTIVE MAP PLANNER
        </h1>

        {/* Map Selection */}
        {!selectedMap && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#ff4654] mb-6">SELECT A MAP</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playableMaps.map(map => (
                <button
                  key={map.uuid}
                  onClick={() => setSelectedMap(map)}
                  className="relative overflow-hidden group rounded-lg border-2 border-gray-600 hover:border-[#ff4654] transition-all"
                >
                  <img
                    src={map.splash}
                    alt={map.displayName}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-[#ff4654]/30 transition-colors flex items-center justify-center">
                    <h3 className="text-white font-bold text-xl">{map.displayName}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        {selectedMap && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-gradient-to-r from-[#ff4654]/20 to-[#ba3a46]/20 border-2 border-[#ff4654] p-6 rounded-lg flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTool('draw')}
                  className={`px-4 py-2 font-bold rounded transition-all ${
                    selectedTool === 'draw'
                      ? 'bg-[#ff4654] text-white'
                      : 'bg-black/50 text-gray-300 border-2 border-gray-600 hover:border-[#ff4654]'
                  }`}
                >
                  ✏️ DRAW
                </button>
                <button
                  onClick={() => setSelectedTool('smoke')}
                  className={`px-4 py-2 font-bold rounded transition-all ${
                    selectedTool === 'smoke'
                      ? 'bg-[#ff4654] text-white'
                      : 'bg-black/50 text-gray-300 border-2 border-gray-600 hover:border-[#ff4654]'
                  }`}
                >
                  💨 SMOKE
                </button>
              </div>

              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-black/50 text-gray-300 border-2 border-gray-600 font-bold rounded hover:border-[#ff4654] transition-all"
              >
                🗑️ CLEAR
              </button>
            </div>

            {/* Canvas */}
            <div className="bg-black/50 border-2 border-[#ff4654] rounded-lg flex justify-center overflow-auto">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  border: '2px solid #666666',
                  borderRadius: '0.5rem',
                  cursor: 'crosshair',
                  display: 'block'
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={saveStrategy}
                className="px-6 py-3 bg-[#ff4654] text-white font-bold hover:bg-[#ba3a46] transition-all rounded"
              >
                💾 SAVE STRATEGY
              </button>
              <button
                onClick={() => setSelectedMap(null)}
                className="px-6 py-3 border-2 border-[#ff4654] text-[#ff4654] font-bold hover:bg-[#ff4654]/20 transition-all rounded"
              >
                🔄 CHANGE MAP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPlannerPage;
