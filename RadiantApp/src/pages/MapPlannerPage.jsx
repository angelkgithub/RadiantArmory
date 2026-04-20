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
  const { data: maps = [], isLoading: mapsLoading } = useGetAllMapsQuery();
  const { data: agents = [], isLoading: agentsLoading } = useGetAllAgentsQuery();

  const playableMaps = maps.filter(m => m.displayName && m.mapUrl && !['Range', 'Skirmish', 'Basic Training'].some(exclude => m.displayName.includes(exclude)));

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
  }, [agents, agentImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMap) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
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
      const iconSize = 64; 
      const cachedImg = agentImages[selectedAgent.uuid];
      if (cachedImg) {
        ctx.shadowColor = '#ff4654';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, iconSize / 2 + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(17, 24, 35, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#ff4654';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.drawImage(cachedImg, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      }
      return;
    }

    if (selectedTool === 'spike') {
      const size = 32;
      ctx.shadowColor = '#ff4654';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fillStyle = '#ff4654';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', x, y + 1);
      return;
    }

    if (selectedTool === 'smoke') {
      ctx.shadowColor = 'rgba(139, 90, 43, 0.7)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 90, 43, 0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 150, 80, 0.5)';
      ctx.lineWidth = 4;
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

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMap) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
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
    link.download = `plan-${selectedMap?.displayName || 'strategy'}.png`;
    link.click();
  };

  if (mapsLoading || agentsLoading) return (
    <div className="min-h-screen bg-[#111823] flex items-center justify-center text-white italic tracking-widest uppercase font-black">
      Loading Operations...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111823] text-white flex flex-col items-center justify-center p-6 md:p-10 overflow-x-hidden relative">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4654] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px]">
        <div className="text-center mb-10">
          <p className="text-[#ff4654] font-black tracking-[0.5em] text-[10px] mb-3 uppercase">Field Operations</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Map <span className="text-[#ff4654]">Planner</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
          
          {/* LEFT: COMMAND PANEL (ADJUSTED FOR SIZE) */}
          <div className="space-y-10">
            {/* Map Selection */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-black italic uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="text-[#ff4654] text-xs not-italic font-mono bg-[#ff4654]/10 px-2 py-1 rounded">01</span> Map
              </h2>
              <div className="relative">
                <select 
                  className="w-full bg-[#1a2332] border border-white/10 rounded-xl p-5 outline-none focus:border-[#ff4654] transition-all appearance-none cursor-pointer font-black uppercase tracking-widest text-[13px] shadow-lg"
                  value={selectedMap?.uuid || ''}
                  onChange={(e) => setSelectedMap(playableMaps.find(m => m.uuid === e.target.value))}
                >
                  <option value="" className="bg-[#111823]">Select Deployment Zone</option>
                  {playableMaps.map(m => (
                    <option key={m.uuid} value={m.uuid} className="bg-[#111823]">{m.displayName}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
              </div>
            </div>

            {/* Toolkit - Buttons and Text sized up */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-black italic uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="text-[#ff4654] text-xs not-italic font-mono bg-[#ff4654]/10 px-2 py-1 rounded">02</span> Tools
              </h2>
              
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { id: 'draw', icon: '✏️', label: 'Tactical Markings' },
                  { id: 'smoke', icon: '💨', label: 'Smoke Coverage' },
                  { id: 'spike', icon: '💣', label: 'Spike Placement' },
                  { id: 'agent', icon: '🎭', label: 'Agent Position' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex items-center gap-6 px-6 py-5 rounded-2xl border font-black italic uppercase text-[12px] tracking-[0.2em] transition-all duration-300 ${
                      selectedTool === tool.id
                        ? 'border-[#ff4654] bg-[#ff4654]/15 text-white shadow-[0_0_25px_rgba(255,70,84,0.25)] scale-[1.02]'
                        : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    {tool.label}
                  </button>
                ))}
              </div>

              {/* Tool Options */}
              {selectedTool === 'draw' && (
                <div className="pt-6 border-t border-white/5 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-black uppercase text-[#ff4654] tracking-[0.3em] mb-5">Select Color</p>
                  <div className="flex items-center justify-between px-1">
                    {['#ff4654', '#3b82f6', '#22c55e', '#eab308', '#ffffff'].map(color => (
                      <button
                        key={color}
                        onClick={() => setDrawColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-125 ${
                          drawColor === color ? 'border-white scale-125' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedTool === 'agent' && (
                <div className="pt-6 border-t border-white/5 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-black uppercase text-[#ff4654] tracking-[0.3em] mb-5">Select Agent</p>
                  <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {agents.map(agent => (
                      <button
                        key={agent.uuid}
                        onClick={() => setSelectedAgent(agent)}
                        className={`relative aspect-square rounded-xl transition-all ${
                          selectedAgent?.uuid === agent.uuid ? 'bg-[#ff4654] ring-2 ring-[#ff4654] scale-105' : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <img src={agent.displayIcon} className="p-1" alt="" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={clearCanvas}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-black italic tracking-widest text-[11px] uppercase hover:bg-red-500/10 hover:border-red-500/30 transition-all active:scale-[0.98]"
              >
                Clear Plan
              </button>
              <button 
                onClick={saveStrategy}
                disabled={!selectedMap}
                className="w-full group relative h-20 bg-[#ff4654] rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-xl shadow-[#ff4654]/10"
              >
                <span className="relative z-10 font-black italic tracking-[0.3em] text-[14px] uppercase">Export Operational Intel</span>
                <div className="absolute inset-0 bg-white translate-y-20 group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
              </button>
            </div>
          </div>

          {/* RIGHT: DRAWING SECTION (Stays same size ratio) */}
          <div className="relative">
            {!selectedMap ? (
              <div className="aspect-[16/10] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                  <span className="text-5xl opacity-10">🗺️</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-[0.2em] text-gray-700">Awaiting Target Selection</h3>
              </div>
            ) : (
              <div className="relative bg-[#1a2332] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-2xl">
                <div className="absolute top-8 left-8 z-10 flex items-center gap-4 bg-[#111823]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
                  <div className="flex flex-col">
                    <span className="text-[#ff4654] text-[8px] font-black tracking-[0.4em] uppercase mb-0.5">Location</span>
                    <span className="text-white text-xl font-black italic tracking-widest uppercase">{selectedMap.displayName}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#ff4654] animate-pulse"></div>
                </div>

                <div className="flex items-center justify-center p-6">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="max-w-full max-h-[72vh] rounded-[2rem] shadow-2xl cursor-crosshair"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MapPlannerPage;