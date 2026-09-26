'use client';

import React, { useState } from 'react';
import { Wind, Droplets, Compass, Thermometer, ShieldAlert } from 'lucide-react';

export default function ExoplanetViewer() {
  const [machSpeed, setMachSpeed] = useState<number>(7.1);
  const [showPrecipitation, setShowPrecipitation] = useState<boolean>(true);
  const [activeSide, setActiveSide] = useState<'terminator' | 'day' | 'night'>('terminator');

  return (
    <div id="exoplanet-interactive-container" className="my-6 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 p-5 sm:p-6 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
            <Wind className="w-3.5 h-3.5" /> Supersonic Atmospheric Flight Simulator
          </span>
          <h4 className="text-base font-semibold text-white mt-1">HD 189733b Silicate Aerosol & Molten Glass Precipitation</h4>
        </div>
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveSide('terminator')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${activeSide === 'terminator' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Terminator (Glass Rain)
          </button>
          <button
            onClick={() => setActiveSide('day')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${activeSide === 'day' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Day Side (1,200°C)
          </button>
          <button
            onClick={() => setActiveSide('night')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${activeSide === 'night' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Night Side (650°C)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Visualizer Area */}
        <div className="lg:col-span-8 relative flex flex-col justify-center items-center min-h-[300px] rounded-xl bg-gradient-to-r from-blue-950 via-cyan-950 to-indigo-950 border border-cyan-900/40 p-4 overflow-hidden">
          {/* Planet Horizon Curve */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-950 shadow-[inset_0_0_60px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.4)] border border-cyan-400/30 flex items-center justify-center overflow-hidden">
            {/* Supersonic streaks */}
            <div className="absolute inset-0 flex flex-col justify-around opacity-60">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent w-full"
                  style={{
                    transform: `translateX(${((idx * 25) % 100) - 50}px)`,
                    filter: 'drop-shadow(0 0 4px #22d3ee)'
                  }}
                />
              ))}
            </div>

            {/* Horizontal Glass Rain Droplets */}
            {showPrecipitation && (
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="flex gap-2 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="text-cyan-200 text-xs font-mono font-bold tracking-widest rotate-90">
                      ──➤
                    </span>
                  ))}
                </div>
                <span className="text-[11px] bg-black/60 px-2 py-0.5 rounded text-cyan-300 font-mono mt-2">
                  MgSiO3 Enstatite Glass Shards
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 px-2 pt-2 border-t border-neutral-800/60">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Droplets className="w-3.5 h-3.5" /> Horizontal Glass Storm Velocity: {(machSpeed * 1225).toFixed(0)} km/h
            </span>
            <span className="font-mono text-neutral-400">Rayleigh Silicate Scattering</span>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Zonal Equatorial Wind Speed</span>
                <span className="text-cyan-400 font-mono font-bold">Mach {machSpeed.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.5"
                step="0.1"
                value={machSpeed}
                onChange={(e) => setMachSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">7x speed of sound—crosses Earth in ~4.5 hours.</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-neutral-300 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPrecipitation}
                  onChange={(e) => setShowPrecipitation(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                Show Silicate Glass Rain Paths
              </label>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Atmosphere Color:</span>
              <span className="text-cyan-300 font-semibold">Deep Cobalt Azure</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Orbital Distance:</span>
              <span className="text-neutral-200 font-mono">0.031 AU (Tidally Locked)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Rain Composition:</span>
              <span className="text-emerald-400 font-mono">Molten Liquid Glass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
