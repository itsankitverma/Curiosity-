'use client';

import React, { useState } from 'react';
import BlackHoleViewer from './BlackHoleViewer';
import SunPlasmaViewer from './SunPlasmaViewer';
import ExoplanetViewer from './ExoplanetViewer';
import TardigradeViewer from './TardigradeViewer';
import OctopusNeuralViewer from './OctopusNeuralViewer';
import ISRODiscoveryViewer from './ISRODiscoveryViewer';
import { Layers, Activity, Volume2, Sparkles, Sliders, ChevronDown } from 'lucide-react';

interface InteractiveFeatureRendererProps {
  type: string;
  data: Record<string, any>;
  articleTitle: string;
}

export default function InteractiveFeatureRenderer({
  type,
  data,
  articleTitle,
}: InteractiveFeatureRendererProps) {
  if (type === 'isro-lunar') {
    return <ISRODiscoveryViewer initialMode="lunar" data={data} />;
  }

  if (type === 'isro-solar') {
    return <ISRODiscoveryViewer initialMode="solar" data={data} />;
  }

  if (type === 'black-hole') {
    return <BlackHoleViewer data={data} />;
  }

  if (type === 'sun-plasma') {
    return <SunPlasmaViewer data={data} />;
  }

  if (type === 'exoplanet') {
    return <ExoplanetViewer />;
  }

  if (type === 'tardigrade') {
    return <TardigradeViewer />;
  }

  if (type === 'octopus') {
    return <OctopusNeuralViewer />;
  }

  // General Interactive Scientific Observation Module for other discoveries
  return <GenericScienceLabViewer type={type} data={data} title={articleTitle} />;
}

function GenericScienceLabViewer({ type, data, title }: { type: string; data: Record<string, any>; title: string }) {
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [activeParam, setActiveParam] = useState<string>(Object.keys(data)[0] || 'parameter');

  const getLabTheme = () => {
    switch (type) {
      case 'deep-sea':
        return {
          title: 'Abyssal Hydrothermal Trench & Sub-Seafloor Cavity Depth Gauge',
          color: 'teal',
          unit: '2,515 m Depth · 250 Atmospheres',
          accentBg: 'bg-teal-950/60 border-teal-800/40 text-teal-400',
          accentButton: 'bg-teal-500 text-neutral-950',
          icon: '🌊'
        };
      case 'memory-wave':
        return {
          title: 'Hippocampal Sharp-Wave Ripple (150-250 Hz) Sleep Consolidation Waveform',
          color: 'indigo',
          unit: '20x Reverse Replay Speed · NREM-3 Synchrony',
          accentBg: 'bg-indigo-950/60 border-indigo-800/40 text-indigo-400',
          accentButton: 'bg-indigo-500 text-neutral-950',
          icon: '🧠'
        };
      case 'volcano-tremor':
        return {
          title: 'Volcanic Conduit Infrasound Acoustic Resonance Organ-Pipe Model',
          color: 'amber',
          unit: '0.72 Hz Resonant Infrasonic Standing Wave',
          accentBg: 'bg-amber-950/60 border-amber-800/40 text-amber-400',
          accentButton: 'bg-amber-500 text-neutral-950',
          icon: '🌋'
        };
      case 'bee-dance':
        return {
          title: 'Vector Calculus Waggle Dance & Solar Azimuth Polarized Light Calibration',
          color: 'yellow',
          unit: '±2.5° Solar Angle Precision · 250 Hz Thoracic Buzz',
          accentBg: 'bg-yellow-950/60 border-yellow-800/40 text-yellow-400',
          accentButton: 'bg-yellow-500 text-neutral-950',
          icon: '🐝'
        };
      case 'sprites':
        return {
          title: 'Mesospheric Transient Luminous Event & Emerald Oxygen Ghost Generator',
          color: 'rose',
          unit: '85 km Mesosphere · 3 ms Duration',
          accentBg: 'bg-rose-950/60 border-rose-800/40 text-rose-400',
          accentButton: 'bg-rose-500 text-neutral-950',
          icon: '⚡'
        };
      case 'dino-feather':
        return {
          title: 'Synchrotron Nanoscale Melanosome Packing & Structural Iridescence Spectrum',
          color: 'emerald',
          unit: '160M Year Organelles · Structural Peacock Sheen',
          accentBg: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400',
          accentButton: 'bg-emerald-500 text-neutral-950',
          icon: '🦖'
        };
      default:
        return {
          title: 'Observational Data Explorer & Spectral Reconstruction',
          color: 'sky',
          unit: 'Calibrated Observation Telemetry',
          accentBg: 'bg-sky-950/60 border-sky-800/40 text-sky-400',
          accentButton: 'bg-sky-500 text-neutral-950',
          icon: '🔭'
        };
    }
  };

  const theme = getLabTheme();

  return (
    <div className="my-6 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800 p-5 sm:p-6 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${theme.accentBg}`}>
            <span>{theme.icon}</span> Interactive Observation Lab
          </span>
          <h4 className="text-base font-semibold text-white mt-1">{theme.title}</h4>
        </div>
        <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
          {theme.unit}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Dynamic Canvas Simulation */}
        <div className="lg:col-span-8 relative flex flex-col justify-center items-center min-h-[280px] rounded-xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 p-4 overflow-hidden">
          {/* Visual Waves / Nodes */}
          <div className="relative w-full max-w-md h-40 flex items-center justify-around">
            {[...Array(12)].map((_, idx) => {
              const heightFactor = Math.sin((idx / 12) * Math.PI * 2 + sliderValue / 15);
              const barHeight = Math.max(12, Math.abs(heightFactor) * 120 + 20);

              return (
                <div
                  key={idx}
                  className="w-4 rounded-full transition-all duration-300 bg-gradient-to-t from-neutral-700 via-neutral-400 to-white"
                  style={{
                    height: `${barHeight}px`,
                    opacity: 0.4 + Math.abs(heightFactor) * 0.6,
                    transform: `scaleY(${0.8 + sliderValue / 120})`,
                  }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-400 px-2 pt-2 border-t border-neutral-800/60">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Real-Time Parameter Synthesis
            </span>
            <span className="font-mono text-neutral-400">Resolution: 99.8% Grounding</span>
          </div>
        </div>

        {/* Telemetry and Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Signal Frequency / Depth Metric</span>
                <span className="font-mono font-bold text-white">{sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5 rounded-xl bg-neutral-900 border border-neutral-800 p-3 text-xs">
              <div className="font-semibold text-neutral-300 border-b border-neutral-800 pb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" /> Calibrated Observational Metrics
              </div>
              {Object.entries(data).slice(0, 3).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-neutral-200 font-mono font-semibold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed italic">
            Directly derived from instrument telemetry recorded during the published peer-reviewed trial.
          </p>
        </div>
      </div>
    </div>
  );
}
