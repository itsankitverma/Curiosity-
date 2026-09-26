'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, Activity, RefreshCw, AlertTriangle } from 'lucide-react';

export default function TardigradeViewer() {
  const [isTunState, setIsTunState] = useState<boolean>(false);
  const [activeStress, setActiveStress] = useState<'vacuum' | 'radiation' | 'cryo' | 'heat'>('cryo');

  return (
    <div id="tardigrade-interactive-container" className="my-6 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 p-5 sm:p-6 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <Shield className="w-3.5 h-3.5" /> Anhydrobiosis Cryo-EM Chamber
          </span>
          <h4 className="text-base font-semibold text-white mt-1">TDP Vitrification & Cryptobiotic State Transition</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTunState(!isTunState)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isTunState ? 'bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTunState ? 'rotate-180 transition-transform' : ''}`} />
            {isTunState ? 'Hydrate Back to Active State' : 'Desiccate into "Tun" Glass State'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Cell / Organism Graphic */}
        <div className="lg:col-span-8 relative flex flex-col justify-center items-center min-h-[300px] rounded-xl bg-gradient-to-br from-neutral-950 via-emerald-950/30 to-neutral-950 border border-emerald-900/40 p-4 overflow-hidden">
          {/* Microbe Body Simulation */}
          <div
            className={`relative flex items-center justify-center rounded-3xl transition-all duration-700 border-2 ${
              isTunState
                ? 'w-48 h-32 bg-emerald-950/80 border-emerald-400/80 shadow-[0_0_40px_rgba(52,211,153,0.4)] scale-90'
                : 'w-64 h-40 bg-neutral-900 border-emerald-600/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            }`}
          >
            {/* Cytoplasm Matrix / Bioglass */}
            <div className="text-center p-3">
              <div className="text-3xl mb-1">{isTunState ? '🛡️' : '🔬'}</div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                {isTunState ? 'Bioglass Vitrified State' : 'Active Hydrated Water Bear'}
              </h5>
              <p className="text-[11px] text-emerald-300 font-mono mt-1">
                {isTunState ? 'TDP Solid Matrix (Metabolism: 0.00%)' : '85% Water Content · Active Crawling'}
              </p>
            </div>

            {/* Suspended animation particles */}
            {isTunState && (
              <div className="absolute inset-0 border-2 border-dashed border-emerald-300/40 rounded-3xl animate-pulse" />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 px-2 pt-2 border-t border-neutral-800/60">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              {isTunState ? 'DNA locked in glass armor · Immune to radiation' : 'Sensitive to hydration loss'}
            </span>
            <span className="font-mono text-neutral-400">Cryo-EM 2.1 Ångström</span>
          </div>
        </div>

        {/* Environmental Stressors */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-medium text-neutral-300 block">Apply Extreme Environmental Stressor:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cryo', label: 'Absolute Zero (-272°C)', icon: '❄️' },
                { id: 'vacuum', label: 'Space Vacuum (0 atm)', icon: '🌌' },
                { id: 'radiation', label: '5,000 Gy Radiation', icon: '☢️' },
                { id: 'heat', label: 'Boiling (+150°C)', icon: '🔥' },
              ].map((stress) => (
                <button
                  key={stress.id}
                  onClick={() => setActiveStress(stress.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                    activeStress === stress.id
                      ? 'border-emerald-500 bg-emerald-950/60 text-white'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-base block mb-1">{stress.icon}</span>
                  <span className="text-[11px] leading-tight block">{stress.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Survival Status:</span>
              <span className={`font-mono font-bold ${isTunState ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isTunState ? '100% Intact (Protected)' : 'Critical Stress (Dehydrating)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">DNA Break Repair:</span>
              <span className="text-neutral-200 font-mono">24 Hours post-water</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
