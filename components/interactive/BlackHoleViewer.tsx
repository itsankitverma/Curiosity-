'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, Eye, RotateCw } from 'lucide-react';

interface BlackHoleViewerProps {
  data?: Record<string, any>;
}

export default function BlackHoleViewer({ data }: BlackHoleViewerProps) {
  const [spinSpeed, setSpinSpeed] = useState<number>(94);
  const [viewAngle, setViewAngle] = useState<number>(35);
  const [showMagneticRays, setShowMagneticRays] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'physics'>('visual');

  return (
    <div id="black-hole-interactive-container" className="my-6 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 p-5 sm:p-6 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Observation Lab
          </span>
          <h4 className="text-base font-semibold text-white mt-1">M87* Event Horizon & Light-Bending Ray Tracer</h4>
        </div>
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            id="tab-btn-visual"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'visual' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Light Geometry
          </button>
          <button
            id="tab-btn-physics"
            onClick={() => setActiveTab('physics')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'physics' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Gravitational Metrics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Canvas / Visualization Area */}
        <div className="lg:col-span-8 relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] rounded-xl bg-gradient-to-b from-black via-neutral-950 to-black border border-neutral-800/80 p-4 overflow-hidden">
          {/* Subtle star background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Relativistic Accretion Simulation */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer Photon Halo (Bent from back of black hole) */}
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-500/40 blur-md animate-pulse"
              style={{
                transform: `rotate(${viewAngle}deg) scale(${1 + spinSpeed / 400})`,
                transition: 'all 0.5s ease',
              }}
            />

            {/* Glowing Asymmetric Accretion Disk (Doppler Beaming: left side brighter) */}
            <div
              className="absolute w-60 h-20 sm:w-72 sm:h-24 rounded-full border-t-8 border-b-2 border-l-[14px] border-r-2 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
              style={{
                transform: `rotate(${viewAngle}deg) scaleY(${0.4 + (90 - viewAngle) / 180})`,
                borderColor: '#f59e0b #d97706 #fbbf24 #b45309',
                filter: 'drop-shadow(0 0 18px rgba(251, 191, 36, 0.7))',
                transition: 'all 0.4s ease',
              }}
            />

            {/* Magnetic Striation Rays */}
            {showMagneticRays && (
              <div
                className="absolute inset-0 rounded-full border border-dashed border-amber-300/60 animate-spin"
                style={{
                  animationDuration: `${Math.max(2, 20 - spinSpeed / 6)}s`,
                  transform: `scale(1.15) rotate(${viewAngle}deg)`,
                }}
              />
            )}

            {/* Photon Ring (Inner sharp loop) */}
            <div className="absolute w-36 h-36 rounded-full border-2 border-amber-200/90 shadow-[0_0_25px_rgba(254,240,138,0.8)] z-10" />

            {/* Central Shadow / Event Horizon */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black border border-amber-950/80 shadow-[inset_0_0_30px_rgba(0,0,0,1)] z-20 flex flex-col items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mt-1">Horizon</span>
            </div>

            {/* Relativistic Jet Trajectory */}
            <div
              className="absolute -top-12 bottom-0 w-1 bg-gradient-to-t from-transparent via-cyan-400 to-transparent blur-[1px] z-30 opacity-75"
              style={{ transform: `rotate(${viewAngle - 90}deg)` }}
            />
            <div
              className="absolute top-0 -bottom-12 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[1px] z-30 opacity-75"
              style={{ transform: `rotate(${viewAngle - 90}deg)` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 px-2 pt-2 border-t border-neutral-800/60 z-10">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Eye className="w-3.5 h-3.5" /> Doppler Boosted (Approaching side 4x brighter)
            </span>
            <span className="font-mono text-neutral-400">Resolution: 20 µas</span>
          </div>
        </div>

        {/* Controls and Real-Time Readout */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Spin Parameter (a/M)</span>
                <span className="text-amber-400 font-mono font-bold">{(spinSpeed / 100).toFixed(2)} c</span>
              </div>
              <input
                id="slider-spin-speed"
                type="range"
                min="10"
                max="99"
                value={spinSpeed}
                onChange={(e) => setSpinSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">Controls the frame-dragging velocity of surrounding space-time.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Observer Inclination Angle</span>
                <span className="text-amber-400 font-mono font-bold">{viewAngle}°</span>
              </div>
              <input
                id="slider-view-angle"
                type="range"
                min="5"
                max="85"
                value={viewAngle}
                onChange={(e) => setViewAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">M87* is tilted ~17° relative to Earth’s line of sight.</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label htmlFor="toggle-magnetic-rays" className="text-xs text-neutral-300 cursor-pointer flex items-center gap-2">
                <input
                  id="toggle-magnetic-rays"
                  type="checkbox"
                  checked={showMagneticRays}
                  onChange={(e) => setShowMagneticRays(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                Show Polarized Magnetic Lines
              </label>
              <button
                id="btn-reset-bh"
                onClick={() => { setSpinSpeed(94); setViewAngle(35); setShowMagneticRays(true); }}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Accretion Temperature:</span>
              <span className="text-amber-300 font-mono font-semibold">{data?.accretionTemp || '10 Billion K'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Shadow Diameter:</span>
              <span className="text-neutral-200 font-mono">{data?.shadowDiameter || '40 Billion km'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Photon Ring Contrast:</span>
              <span className="text-emerald-400 font-mono font-semibold">{data?.photonRingSharpness || '4.2x Sharpness'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
