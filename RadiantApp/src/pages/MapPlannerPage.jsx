import { useRef, useState, useEffect } from 'react';
import { useGetAllMapsQuery, useGetAllAgentsQuery } from '../services/valorantApi';

function MapPlannerPage() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('draw');
  const [drawColor, setDrawColor] = useState('#ff4654');
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentImages, setAgentImages] = useState({});
  const { data: maps = [], isLoading } = useGetAllMapsQuery();
  const { data: agents = [] } = useGetAllAgentsQuery();

  const playableMaps = maps.filter(m => m.displayName && m.mapUrl && !m.displayName.includes('Range') && !m.displayName.includes('Skirmish') && !m.displayName.includes('Basic Training'));

  // Preload agent icons for canvas drawing
  useEffect(() => {
    agents.forEach(agent => {
      if (agent.displayIcon && !agentImages[agent.uuid]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setAgentImages(prev => ({ ...prev, [agent.uuid]: img }));
        };
        img.src = agent.displayIcon;
      }
    });
  }, [agents]);

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

    if (selectedTool === 'agent' && selectedAgent) {
      const iconSize = 48;
      const cachedImg = agentImages[selectedAgent.uuid];
      if (cachedImg) {
        // Circle background
        ctx.shadowColor = '#ff4654';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, iconSize / 2 + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(17, 24, 35, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#ff4654';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        // Agent icon
        ctx.drawImage(cachedImg, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      }
      return;
    }

    if (selectedTool === 'spike') {
      // Draw spike pin marker
      const size = 28;
      // Outer glow
      ctx.shadowColor = '#ff4654';
      ctx.shadowBlur = 20;
      // Diamond shape
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fillStyle = '#ff4654';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Inner spike text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', x, y + 1);
      return;
    }

    if (selectedTool === 'smoke') {
      ctx.shadowColor = 'rgba(139, 90, 43, 0.8)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 90, 43, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 150, 80, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
      return;
    }

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
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ff4654] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Loading maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <img src="https://res.cloudinary.com/dc3erz7jd/image/upload/v1776518659/1868859-3840x2160-desktop-4k-valorant-background-image_qkrnf1.jpg" alt="" className="fixed inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-[#111823]/80" style={{ zIndex: 0 }} />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[#ff4654] text-xs font-bold tracking-[0.3em] uppercase mb-3">Tactical Planning</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-wider mb-3">
            MAP
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff4654] to-[#ff6b6b] tracking-wider">
            PLANNER
          </h1>
        </div>

        {/* Map Selection */}
        {!selectedMap && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-black text-xl sm:text-2xl tracking-wider">SELECT MAP</h2>
                <p className="text-gray-500 text-xs mt-1">Choose a map to start planning</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playableMaps.map(map => (
                <button
                  key={map.uuid}
                  onClick={() => setSelectedMap(map)}
                  className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-[1.03]"
                >
                  <div className="aspect-[16/10] relative">
                    {map.splash ? (
                      <img src={map.splash} alt={map.displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#1a2332]"></div>
                    )}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-bold text-sm tracking-wide">{map.displayName}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Planner - 2 Column Layout */}
        {selectedMap && (
          <div className="max-w-[1600px] mx-auto">
            {/* Map name bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedMap(null)}
                  className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Planning on</p>
                  <h2 className="text-white font-black text-xl tracking-wider">{selectedMap.displayName}</h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
              {/* Left Sidebar - Tools */}
              <div className="space-y-3">
                {/* Tools Section */}
                <div className="bg-[#1a2332] border border-white/5 rounded-2xl p-4">
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-3">Tools</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'draw', icon: '✏️', label: 'Draw' },
                      { id: 'smoke', icon: '💨', label: 'Smoke' },
                      { id: 'spike', icon: '💣', label: 'Spike' },
                      { id: 'agent', icon: '🎭', label: 'Agent' },
                    ].map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border font-bold text-sm transition-all duration-200 ${
                          selectedTool === tool.id
                            ? 'border-[#ff4654]/50 bg-[#ff4654]/10 text-white ring-1 ring-[#ff4654]/20'
                            : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{tool.icon}</span>
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker - Draw */}
                {selectedTool === 'draw' && (
                  <div className="bg-[#1a2332] border border-white/5 rounded-2xl p-4">
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-3">Pen Color</p>
                    <div className="flex items-center gap-2">
                      {['#ff4654', '#3b82f6', '#22c55e', '#eab308', '#ffffff'].map(color => (
                        <button
                          key={color}
                          onClick={() => setDrawColor(color)}
                          className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                            drawColor === color ? 'border-white scale-110 shadow-lg' : 'border-white/10'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Agent Selector */}
                {selectedTool === 'agent' && (
                  <div className="bg-[#1a2332] border border-white/5 rounded-2xl p-4">
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-3">Select Agent</p>
                    <div className="grid grid-cols-4 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
                      {agents.map(agent => (
                        <button
                          key={agent.uuid}
                          onClick={() => setSelectedAgent(agent)}
                          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                            selectedAgent?.uuid === agent.uuid
                              ? 'border-[#ff4654]/50 bg-[#ff4654]/10 ring-1 ring-[#ff4654]/20'
                              : 'border-transparent hover:border-white/10 hover:bg-white/5'
                          }`}
                        >
                          {agent.displayIcon && (
                            <img src={agent.displayIcon} alt={agent.displayName} className="w-10 h-10 object-contain" />
                          )}
                          <span className="text-white text-[8px] font-bold truncate w-full text-center">{agent.displayName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool Info */}
                <div className="bg-[#1a2332] border border-white/5 rounded-2xl p-4">
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2">Active Tool</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      {selectedTool === 'draw' ? '✏️' : selectedTool === 'smoke' ? '💨' : selectedTool === 'spike' ? '💣' : '🎭'}
                    </span>
                    <div>
                      <p className="text-white font-bold text-sm capitalize">{selectedTool}</p>
                      <p className="text-gray-500 text-[10px]">
                        {selectedTool === 'draw' && 'Click & drag to draw paths'}
                        {selectedTool === 'smoke' && 'Click to place smoke zone'}
                        {selectedTool === 'spike' && 'Click to mark spike plant'}
                        {selectedTool === 'agent' && (selectedAgent ? `Pinning: ${selectedAgent.displayName}` : 'Pick an agent above')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={clearCanvas}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 text-gray-400 font-bold text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    CLEAR ALL
                  </button>
                  <button
                    onClick={saveStrategy}
                    className="group relative w-full py-3.5 overflow-hidden rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654] to-[#ff6b6b]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff4654] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center justify-center gap-2 tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      SAVE STRATEGY
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Side - Canvas */}
              <div className="relative bg-[#1a2332] border border-white/5 rounded-2xl overflow-hidden">
                {/* Map label */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#111823]/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse"></div>
                  <span className="text-white text-xs font-bold tracking-wider">{selectedMap.displayName}</span>
                </div>

                <div className="flex items-center justify-center p-2">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '75vh',
                      borderRadius: '0.75rem',
                      cursor: selectedTool === 'draw' ? 'crosshair' : 'pointer',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPlannerPage;
