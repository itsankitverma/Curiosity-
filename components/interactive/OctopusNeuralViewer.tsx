'use client';

import React, { useState } from 'react';
import { Cpu, Network, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export default function OctopusNeuralViewer() {
  const [selectedNode, setSelectedNode] = useState<number | 'central'>('central');
  const [waterTemp, setWaterTemp] = useState<number>(18);
  const [rnaEditingActive, setRnaEditingActive] = useState<boolean>(true);

  const armData: Record<number, { name: string; action: string; sensor: string }> = {
    1: { name: 'Arm 1 (Right Dorsal)', action: 'Probing crevice texture', sensor: 'Chemical taste: 9,800 receptors' },
    2: { name: 'Arm 2 (Right Lateral)', action: 'Wrapping prey crab', sensor: 'Autonomous tactile grip calculation' },
    3: { name: 'Arm 3 (Right Ventral)', action: 'Anchoring to basalt reef', sensor: 'Substrate suction pressure: 1.8 bars' },
    4: { name: 'Arm 4 (Right Hectocotylus)', action: 'Coordinating crawl kinetics', sensor: 'Proprioceptive angle feedback' },
    5: { name: 'Arm 5 (Left Dorsal)', action: 'Scanning water current', sensor: 'Hydrodynamic shear detection' },
    6: { name: 'Arm 6 (Left Lateral)', action: 'Passing food toward beak', sensor: 'Chemical sugar & protein taste' },
    7: { name: 'Arm 7 (Left Ventral)', action: 'Guarding mantle siphon', sensor: 'Vibration & predator proximity' },
    8: { name: 'Arm 8 (Left Tail)', action: 'Independent search sweep', sensor: 'Autonomous nerve cord processing' },
  };

  return (
    <div id="octopus-interactive-container" className="my-6 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 p-5 sm:p-6 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-800/40">
            <Network className="w-3.5 h-3.5" /> Cephalopod Neural Mesh Simulator
          </span>
          <h4 className="text-base font-semibold text-white mt-1">Decentralized 8-Arm Co-Processing & On-The-Fly RNA Recoding</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Total Neurons:</span>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-1 rounded-md border border-purple-800/50">
            500 Million (67% in Limbs)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Network Graph Visualizer */}
        <div className="lg:col-span-8 relative flex flex-col justify-center items-center min-h-[320px] rounded-xl bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-950 border border-purple-900/40 p-4 overflow-hidden">
          {/* Central Donut Brain & 8 Arm Nodes */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Central Donut Brain */}
            <button
              onClick={() => setSelectedNode('central')}
              className={`relative z-20 w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                selectedNode === 'central'
                  ? 'bg-purple-600 border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.7)] scale-110 text-white font-bold'
                  : 'bg-neutral-900 border-purple-600/60 text-purple-200 hover:border-purple-400'
              }`}
            >
              <Cpu className="w-5 h-5 mb-1 text-purple-200" />
              <span className="text-[10px] uppercase font-bold text-center leading-tight">Central Brain (Esophagus Ring)</span>
            </button>

            {/* 8 Radial Arm Nodes */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((armNum) => {
              const angle = (armNum * 45 - 90) * (Math.PI / 180);
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedNode === armNum;

              return (
                <button
                  key={armNum}
                  onClick={() => setSelectedNode(armNum)}
                  className={`absolute z-30 w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-purple-400 border-white shadow-[0_0_20px_rgba(192,132,252,0.9)] text-neutral-950 scale-125'
                      : 'bg-neutral-900/90 border-purple-700/80 text-purple-300 hover:border-purple-400 hover:bg-neutral-800'
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  #{armNum}
                </button>
              );
            })}

            {/* Connecting Neural Ring */}
            <div className="absolute w-52 h-52 rounded-full border border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '30s' }} />
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 px-2 pt-2 border-t border-neutral-800/60">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Click any arm node to inspect autonomous sensory decision loop
            </span>
            <span className="font-mono text-neutral-400">Axial Nerve Ring Bus</span>
          </div>
        </div>

        {/* Node Telemetry & RNA Editing */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="rounded-xl bg-purple-950/30 border border-purple-800/50 p-4 space-y-3">
            <div className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              {selectedNode === 'central' ? 'Central Brain Executive Controller' : `Arm #${selectedNode} Autonomous Processor`}
            </div>

            {selectedNode === 'central' ? (
              <p className="text-xs text-neutral-300 leading-relaxed">
                Issues high-level tactical goals (&ldquo;find shelter&rdquo;, &ldquo;hunt prey&rdquo;). Does NOT manage individual sucker suction or limb trajectories.
              </p>
            ) : (
              <div className="text-xs space-y-1.5">
                <p className="text-neutral-300 font-medium">{armData[selectedNode as number]?.name}</p>
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800 text-[11px] text-purple-200">
                  <span className="text-neutral-400 block">Current Action:</span>
                  {armData[selectedNode as number]?.action}
                </div>
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800 text-[11px] text-emerald-300">
                  <span className="text-neutral-400 block">Chemotactile Receptors:</span>
                  {armData[selectedNode as number]?.sensor}
                </div>
              </div>
            )}
          </div>

          {/* Environmental RNA Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-300">
              <span>Seawater Temp (Triggers RNA Recoding)</span>
              <span className="text-purple-400 font-mono font-bold">{waterTemp} °C</span>
            </div>
            <input
              type="range"
              min="4"
              max="28"
              value={waterTemp}
              onChange={(e) => setWaterTemp(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              {waterTemp < 10 ? 'Cold-adapted K+ channel RNA edits active (60,000 sites)' : 'Warm-adapted neural conformation'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
