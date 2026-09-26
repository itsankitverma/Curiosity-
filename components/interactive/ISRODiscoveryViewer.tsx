'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Thermometer,
  Gauge,
  Eye,
  Radio,
  Layers,
  Activity,
  Compass,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ISRODiscoveryViewerProps {
  initialMode?: 'lunar' | 'solar';
  data?: Record<string, any>;
}

export default function ISRODiscoveryViewer({
  initialMode = 'lunar',
  data = {},
}: ISRODiscoveryViewerProps) {
  const [activeMode, setActiveMode] = useState<'lunar' | 'solar'>(initialMode);

  // Lunar Mode State (Chandrayaan-3 Pragyan Rover)
  const [probeDepthMm, setProbeDepthMm] = useState<number>(50);
  const [laserFired, setLaserFired] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<string>('Sulfur (S)');

  // Solar Mode State (Aditya-L1 VELC & SUIT)
  const [cmeVelocity, setCmeVelocity] = useState<number>(1400); // km/s
  const [uvWavelength, setUvWavelength] = useState<number>(279); // Mg II k line (nm)

  // Calculate Lunar Subsurface Temperature based on ChaSTE experimental data
  // Surface: ~+50°C, 80mm depth: ~-10°C
  const calculatedLunarTemp = Math.round(50 - (probeDepthMm / 80) * 60);

  // Calculate Solar storm arrival time to Earth (150 Million km)
  const earthArrivalHours = (150000000 / (cmeVelocity * 3600)).toFixed(1);

  const triggerLaser = () => {
    setLaserFired(true);
    setTimeout(() => setLaserFired(false), 900);
  };

  const spectralElements = [
    { name: 'Sulfur (S)', wavelength: '253.6 nm', intensity: 94, color: '#f59e0b', role: 'Key volatile for lunar concrete & solar cells' },
    { name: 'Aluminum (Al)', wavelength: '396.1 nm', intensity: 78, color: '#38bdf8', role: 'Crustal anorthosite signature' },
    { name: 'Calcium (Ca)', wavelength: '422.7 nm', intensity: 85, color: '#a855f7', role: 'Plagioclase feldspar mineral' },
    { name: 'Iron (Fe)', wavelength: '516.7 nm', intensity: 62, color: '#ef4444', role: 'Basaltic impact melt regolith' },
    { name: 'Titanium (Ti)', wavelength: '334.9 nm', intensity: 45, color: '#10b981', role: 'Ilmenite mineral indicator' },
  ];

  return (
    <div className="my-6 rounded-3xl bg-[#080808] text-[#e0e0e0] border border-white/10 p-5 sm:p-7 shadow-2xl overflow-hidden relative">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-orange-400 font-bold">
              ISRO Deep Science Telemetry Lab
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-light text-white tracking-tight">
            {activeMode === 'lunar' ? (
              <>
                Chandrayaan-3 Pragyan: <span className="italic font-serif">Laser LIBS & ChaSTE Probe</span>
              </>
            ) : (
              <>
                Aditya-L1: <span className="italic font-serif">VELC Solar Corona & CME Monitor</span>
              </>
            )}
          </h3>
        </div>

        {/* Mission Switcher */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold">
          <button
            onClick={() => setActiveMode('lunar')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeMode === 'lunar'
                ? 'bg-white text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>🌕</span> Pragyan Lunar 69°S
          </button>
          <button
            onClick={() => setActiveMode('solar')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeMode === 'solar'
                ? 'bg-white text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>☀️</span> Aditya-L1 Corona
          </button>
        </div>
      </div>

      {/* LUNAR LAB: Chandrayaan-3 Pragyan Rover Mode */}
      {activeMode === 'lunar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 animate-fadeIn">
          {/* Visual Simulation Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0e0e0e] to-black border border-white/10 p-5 min-h-[340px] relative overflow-hidden">
            {/* Ambient moon glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #f27d26 0%, transparent 70%)',
                filter: 'blur(70px)',
              }}
            />

            <div className="flex items-center justify-between text-xs text-white/60 font-mono z-10">
              <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest">
                <Compass className="w-3 h-3 text-orange-400" /> Shiv Shakti Point (69.37° S)
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                LIBS Nd:YAG Laser (1064 nm)
              </span>
            </div>

            {/* Laser & Regolith Interaction Visual */}
            <div className="relative my-8 flex flex-col items-center justify-center">
              {/* Laser Beam Flash */}
              {laserFired && (
                <div className="absolute top-0 w-1 h-36 bg-gradient-to-b from-orange-400 via-amber-300 to-white shadow-[0_0_20px_#f59e0b] animate-pulse z-20" />
              )}

              {/* Laser Target Regolith Spot */}
              <div className="relative w-48 h-24 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/15 flex items-center justify-center shadow-inner">
                <div
                  className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
                    laserFired
                      ? 'bg-amber-400 scale-150 shadow-[0_0_30px_#f59e0b]'
                      : 'bg-orange-500/30 border border-orange-400/50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
                <span className="absolute -bottom-6 font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Pragyan LIBS Laser Spot
                </span>
              </div>
            </div>

            {/* ChaSTE Subsurface Depth Visualizer */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 z-10">
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-white/70 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                  ChaSTE Soil Depth: <strong className="text-white font-bold">{probeDepthMm} mm</strong>
                </span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded ${
                    calculatedLunarTemp > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                  }`}
                >
                  Temp: {calculatedLunarTemp}°C
                </span>
              </div>

              {/* Thermal Gradient Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-purple-500 to-sky-500 rounded-full relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border border-black shadow"
                  style={{ left: `${(probeDepthMm / 100) * 96}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1 uppercase tracking-widest">
                <span>0 mm (+50°C Sunlit)</span>
                <span>50 mm (+12°C)</span>
                <span>100 mm (-25°C Shadow)</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 z-10">
              <button
                onClick={triggerLaser}
                className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(242,125,38,0.4)]"
              >
                <Zap className="w-3.5 h-3.5" /> Fire LIBS Laser Pulse
              </button>

              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In-Situ Ground Truth
              </span>
            </div>
          </div>

          {/* Telemetry and Controls */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Depth Slider */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-medium font-mono uppercase tracking-wider">
                  ChaSTE Depth Penetration
                </span>
                <span className="font-mono font-bold text-orange-400">{probeDepthMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={probeDepthMm}
                onChange={(e) => setProbeDepthMm(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-[11px] text-white/50 font-light leading-relaxed">
                The lunar polar soil has extreme vacuum thermal resistance (0.002 W/m-K). Sunlight cannot conduct downward, creating an abrupt 60°C freeze just 3 inches below.
              </p>
            </div>

            {/* In-Situ Spectroscopic Elements Identified */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-orange-400" /> Pragyan Spectral Lines
              </div>

              <div className="space-y-2">
                {spectralElements.map((el) => (
                  <div
                    key={el.name}
                    onClick={() => setSelectedElement(el.name)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      selectedElement === el.name
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: el.color }} />
                      <span className="font-medium text-white">{el.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/40">{el.wavelength}</span>
                      <span className="font-mono font-bold text-white text-[11px]">{el.intensity}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-mono text-orange-300/80 pt-1">
                Selected: {spectralElements.find((s) => s.name === selectedElement)?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SOLAR LAB: Aditya-L1 Spacecraft Mode */}
      {activeMode === 'solar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 animate-fadeIn">
          {/* Visual Simulation Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#120803] to-black border border-white/10 p-5 min-h-[340px] relative overflow-hidden">
            {/* Ambient solar corona glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #f27d26 0%, transparent 65%)',
                filter: 'blur(70px)',
              }}
            />

            <div className="flex items-center justify-between text-xs text-white/60 font-mono z-10">
              <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest">
                <Compass className="w-3 h-3 text-orange-400" /> Sun-Earth L1 Halo Orbit (1.5M km)
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">
                VELC Occulting Disk Active
              </span>
            </div>

            {/* Sun Corona Occulter Visual */}
            <div className="relative my-8 flex items-center justify-center">
              {/* Pulsing Coronal Ejection Ring */}
              <div
                className="absolute w-44 h-44 rounded-full border-2 border-orange-500/60 animate-ping opacity-25"
                style={{ animationDuration: `${Math.max(1.5, 3000 / cmeVelocity)}s` }}
              />

              {/* Artificial Moon / Occulter Disk */}
              <div className="relative w-28 h-28 rounded-full bg-[#050505] border-2 border-orange-500 shadow-[0_0_50px_rgba(242,125,38,0.7)] flex flex-col items-center justify-center z-10">
                <span className="text-[9px] font-mono uppercase text-orange-400 font-bold">VELC Disk</span>
                <span className="text-[8px] font-mono text-white/40">Sun Obscured</span>
              </div>
            </div>

            {/* Early Warning Telemetry Box */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 z-10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                  Geomagnetic Storm Transit Time
                </span>
                <span className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-400" /> {earthArrivalHours} Hours to Earth
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                  CME Plasma Speed
                </span>
                <span className="text-lg font-bold font-mono text-orange-400">
                  {cmeVelocity} km/s
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Controls */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Speed Slider */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-medium font-mono uppercase tracking-wider">
                  Coronal Ejection Velocity
                </span>
                <span className="font-mono font-bold text-orange-400">{cmeVelocity} km/s</span>
              </div>
              <input
                type="range"
                min="400"
                max="2500"
                step="50"
                value={cmeVelocity}
                onChange={(e) => setCmeVelocity(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-[11px] text-white/50 font-light leading-relaxed">
                Aditya-L1 sits 1.5 million km upwind in the solar wind stream, providing Earth with up to 24 hours of advance alert before space-weather shockwaves strike communications satellites.
              </p>
            </div>

            {/* SUIT UV Spectral Bands */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" /> SUIT Near-UV Filter Bands
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { nm: 214, name: 'Photosphere Continuum', desc: 'Solar surface baseline' },
                  { nm: 279, name: 'Mg II k Line', desc: 'Chromospheric flares' },
                  { nm: 300, name: 'Mid-UV Band', desc: 'Active magnetic regions' },
                  { nm: 393, name: 'Ca II K Line', desc: 'Magnetic network plages' },
                ].map((band) => (
                  <button
                    key={band.nm}
                    onClick={() => setUvWavelength(band.nm)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      uvWavelength === band.nm
                        ? 'border-orange-500 bg-orange-500/15 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{band.nm} nm</div>
                    <div className="text-[10px] font-medium text-white/80">{band.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
