'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun,
  Flame,
  Zap,
  Activity,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Eye,
  Sliders,
  Layers,
  Crosshair
} from 'lucide-react';

interface SunPlasmaViewerProps {
  data?: Record<string, any>;
}

type WavelengthMode = 'photosphere' | 'h-alpha' | 'coronal-euv' | 'doppler' | 'magnetogram';

interface GranuleCell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  temp: number; // in Celsius
  velocity: number; // km/s (positive = upwelling, negative = sinking)
  magneticField: number; // Gauss
  phase: number;
  growthRate: number;
  maxRadius: number;
  minRadius: number;
}

interface NanoflareBurst {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function SunPlasmaViewer({ data }: SunPlasmaViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewer state
  const [wavelength, setWavelength] = useState<WavelengthMode>('photosphere');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [showMagneticVectors, setShowMagneticVectors] = useState<boolean>(true);
  const [showDopplerArrows, setShowDopplerArrows] = useState<boolean>(false);
  const [showAcousticWaves, setShowAcousticWaves] = useState<boolean>(true);
  const [activeNanoflares, setActiveNanoflares] = useState<NanoflareBurst[]>([]);

  // Telemetry probe cursor state
  const [probePos, setProbePos] = useState<{ x: number; y: number } | null>(null);
  const [probeData, setProbeData] = useState<{
    xKm: number;
    yKm: number;
    temp: number;
    velocity: number;
    magnetic: number;
    feature: string;
  }>({
    xKm: 650,
    yKm: 520,
    temp: 5780,
    velocity: 6.8,
    magnetic: 180,
    feature: 'Granule Cell Core (Convective Upwelling)',
  });

  // Granule cell particles simulation state
  const cellsRef = useRef<GranuleCell[]>([]);
  const flaresRef = useRef<NanoflareBurst[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Initialize Voronoi granulation centers
  const initCells = useCallback((width: number, height: number) => {
    const numCells = 24;
    const cells: GranuleCell[] = [];
    const cellSpacing = Math.sqrt((width * height) / numCells);

    for (let i = 0; i < numCells; i++) {
      const gx = ((i % 5) + 0.5 + (Math.random() * 0.5 - 0.25)) * (width / 5);
      const gy = (Math.floor(i / 5) + 0.5 + (Math.random() * 0.5 - 0.25)) * (height / 5);

      const baseTemp = 5500 + Math.random() * 600;
      const baseVel = 5.5 + Math.random() * 2.8; // km/s upwelling
      const baseMag = Math.random() < 0.35 ? 2800 + Math.random() * 1500 : 80 + Math.random() * 350;

      cells.push({
        x: gx,
        y: gy,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 35 + Math.random() * 25,
        maxRadius: 55 + Math.random() * 20,
        minRadius: 20 + Math.random() * 10,
        temp: baseTemp,
        velocity: baseVel,
        magneticField: baseMag,
        phase: Math.random() * Math.PI * 2,
        growthRate: 0.008 + Math.random() * 0.008,
      });
    }
    cellsRef.current = cells;
  }, []);

  // Trigger manual magnetic reconnection nanoflare
  const triggerNanoflare = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const fx = Math.random() * (w - 60) + 30;
    const fy = Math.random() * (h - 60) + 30;

    const burst: NanoflareBurst = {
      x: fx,
      y: fy,
      radius: 4,
      maxRadius: 40 + Math.random() * 30,
      alpha: 1.0,
      color: wavelength === 'coronal-euv' ? '#38bdf8' : '#fef08a',
    };
    flaresRef.current.push(burst);
    setActiveNanoflares([...flaresRef.current]);
  }, [wavelength]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas sizing with high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    if (cellsRef.current.length === 0) {
      initCells(width, height);
    }

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        timeRef.current += delta * simSpeed;
      }
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // 1. Render Background Base
      let bgGrad: CanvasGradient;
      if (wavelength === 'photosphere') {
        bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#782006');
        bgGrad.addColorStop(1, '#2a0802');
      } else if (wavelength === 'h-alpha') {
        bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#991b1b');
        bgGrad.addColorStop(1, '#450a0a');
      } else if (wavelength === 'coronal-euv') {
        bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#0e7490');
        bgGrad.addColorStop(1, '#020617');
      } else if (wavelength === 'doppler') {
        bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#1e293b');
        bgGrad.addColorStop(1, '#0f172a');
      } else {
        // Magnetogram
        bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#334155');
        bgGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Acoustic p-mode Sound Waves (Pressure ripples across convection zone)
      if (showAcousticWaves) {
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = wavelength === 'coronal-euv' ? '#38bdf8' : '#fde047';
        ctx.lineWidth = 2;
        const waveCount = 5;
        for (let w = 0; w < waveCount; w++) {
          const r = ((t * 35 + w * 70) % (Math.max(width, height) * 0.9));
          ctx.beginPath();
          ctx.arc(width * 0.45, height * 0.52, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Render Granule Convection Cells (Boiling Plasma Parcels)
      const cells = cellsRef.current;

      // Update positions and breathing phases
      cells.forEach((cell) => {
        if (isPlaying) {
          cell.x += cell.vx * simSpeed;
          cell.y += cell.vy * simSpeed;

          // Boundary bouncing
          if (cell.x < 30 || cell.x > width - 30) cell.vx *= -1;
          if (cell.y < 30 || cell.y > height - 30) cell.vy *= -1;

          cell.phase += cell.growthRate * simSpeed;
          const sizeOsc = Math.sin(cell.phase);
          cell.radius = cell.minRadius + (cell.maxRadius - cell.minRadius) * (0.5 + sizeOsc * 0.5);
        }

        // Draw Granule Cell
        const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.radius);

        if (wavelength === 'photosphere') {
          // Hot upwelling center (bright golden white) to cool dark edges
          grad.addColorStop(0, 'rgba(255, 255, 230, 0.95)');
          grad.addColorStop(0.35, 'rgba(251, 191, 36, 0.85)');
          grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.6)');
          grad.addColorStop(1, 'rgba(120, 32, 6, 0.0)');
        } else if (wavelength === 'h-alpha') {
          // Chromospheric H-alpha
          grad.addColorStop(0, 'rgba(254, 202, 202, 0.9)');
          grad.addColorStop(0.4, 'rgba(239, 68, 68, 0.8)');
          grad.addColorStop(0.8, 'rgba(185, 28, 28, 0.5)');
          grad.addColorStop(1, 'rgba(69, 10, 10, 0.0)');
        } else if (wavelength === 'coronal-euv') {
          // 17.1 nm Fe IX Extreme UV Corona
          grad.addColorStop(0, 'rgba(224, 242, 254, 0.95)');
          grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.75)');
          grad.addColorStop(0.8, 'rgba(2, 132, 199, 0.45)');
          grad.addColorStop(1, 'rgba(8, 47, 73, 0.0)');
        } else if (wavelength === 'doppler') {
          // Doppler: Blueshift (upwelling core) to Redshift (sinking lanes)
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.95)');
          grad.addColorStop(0.5, 'rgba(147, 197, 253, 0.7)');
          grad.addColorStop(0.8, 'rgba(239, 68, 68, 0.5)');
          grad.addColorStop(1, 'rgba(153, 27, 27, 0.0)');
        } else {
          // Stokes-V Magnetogram
          const isPositive = cell.magneticField > 1500;
          if (isPositive) {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(0.6, 'rgba(203, 213, 225, 0.6)');
            grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
          } else {
            grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
            grad.addColorStop(0.6, 'rgba(71, 85, 105, 0.6)');
            grad.addColorStop(1, 'rgba(203, 213, 225, 0.0)');
          }
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4. Intergranular Dark Lanes (Cool sinking plasma boundary)
        ctx.strokeStyle = wavelength === 'coronal-euv'
          ? 'rgba(2, 6, 23, 0.6)'
          : wavelength === 'doppler'
          ? 'rgba(220, 38, 38, 0.5)'
          : 'rgba(30, 8, 3, 0.75)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 5. Bright Magnetic Knots & Flux Tubes (Photospheric bright points at cell vertices)
        if (cell.magneticField > 1800) {
          const knotX = cell.x + Math.cos(cell.phase * 2) * (cell.radius * 0.75);
          const knotY = cell.y + Math.sin(cell.phase * 2) * (cell.radius * 0.75);

          const knotGlow = ctx.createRadialGradient(knotX, knotY, 1, knotX, knotY, 9);
          knotGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
          knotGlow.addColorStop(0.4, wavelength === 'coronal-euv' ? '#38bdf8' : '#fde047');
          knotGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

          ctx.fillStyle = knotGlow;
          ctx.beginPath();
          ctx.arc(knotX, knotY, 9, 0, Math.PI * 2);
          ctx.fill();

          // Magnetic Vector Lines
          if (showMagneticVectors) {
            ctx.save();
            ctx.strokeStyle = wavelength === 'coronal-euv' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(253, 224, 71, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(knotX, knotY);
            ctx.quadraticCurveTo(
              knotX + Math.sin(t + cell.phase) * 25,
              knotY - 30,
              knotX + 15,
              knotY - 50
            );
            ctx.stroke();
            ctx.restore();
          }
        }

        // 6. Doppler Flow Velocity Field Vectors
        if (showDopplerArrows) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.5;

          // Vector pointing radially outward from center of cell
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const startR = cell.radius * 0.25;
            const endR = cell.radius * 0.75;
            const sx = cell.x + Math.cos(a + cell.phase * 0.2) * startR;
            const sy = cell.y + Math.sin(a + cell.phase * 0.2) * startR;
            const ex = cell.x + Math.cos(a + cell.phase * 0.2) * endR;
            const ey = cell.y + Math.sin(a + cell.phase * 0.2) * endR;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
          }
          ctx.restore();
        }
      });

      // 7. Render Active Magnetic Reconnection Nanoflares
      const flares = flaresRef.current;
      for (let i = flares.length - 1; i >= 0; i--) {
        const flare = flares[i];
        flare.radius += 1.8 * simSpeed;
        flare.alpha -= 0.02 * simSpeed;

        if (flare.alpha <= 0) {
          flares.splice(i, 1);
          continue;
        }

        const flareGrad = ctx.createRadialGradient(
          flare.x,
          flare.y,
          1,
          flare.x,
          flare.y,
          flare.radius
        );
        flareGrad.addColorStop(0, `rgba(255, 255, 255, ${flare.alpha})`);
        flareGrad.addColorStop(0.3, `${flare.color}`);
        flareGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');

        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(flare.x, flare.y, flare.radius, 0, Math.PI * 2);
        ctx.fill();

        // Shock wave ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${flare.alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 8. Render Telemetry Crosshair Probe if active
      if (probePos) {
        ctx.save();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(probePos.x, 0);
        ctx.lineTo(probePos.x, height);
        ctx.moveTo(0, probePos.y);
        ctx.lineTo(width, probePos.y);
        ctx.stroke();

        // Center reticle
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(probePos.x, probePos.y, 8, 0, Math.PI * 2);
        ctx.arc(probePos.x, probePos.y, 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    wavelength,
    isPlaying,
    simSpeed,
    showMagneticVectors,
    showDopplerArrows,
    showAcousticWaves,
    probePos,
    initCells,
  ]);

  // Handle probe interaction (hover / touch on canvas)
  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.x;
    const y = clientY - rect.y;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    setProbePos({ x, y });

    // Calculate nearest cell data for scientific telemetry
    const cells = cellsRef.current;
    let closestDist = Infinity;
    let closestCell = cells[0];

    cells.forEach((cell) => {
      const dist = Math.hypot(cell.x - x, cell.y - y);
      if (dist < closestDist) {
        closestDist = dist;
        closestCell = cell;
      }
    });

    if (closestCell) {
      const isCore = closestDist < closestCell.radius * 0.55;
      const isLane = closestDist >= closestCell.radius * 0.85;

      const xKm = Math.round((x / rect.width) * 1500);
      const yKm = Math.round((y / rect.height) * 1500);

      let temp = isCore ? Math.round(closestCell.temp) : Math.round(closestCell.temp - 1400);
      if (wavelength === 'coronal-euv') temp = Math.round(temp * 380); // Coronal temperature in Kelvin
      const velocity = isCore
        ? Number(closestCell.velocity.toFixed(1))
        : Number((-closestCell.velocity * 0.7).toFixed(1));
      const magnetic = isLane
        ? Math.round(closestCell.magneticField * 1.3)
        : Math.round(closestCell.magneticField * 0.2);

      const feature = isLane
        ? 'Intergranular Lane (Cool Sinking Downflow & Magnetic Flux Trap)'
        : isCore
        ? 'Granule Cell Core (Hot Upwelling Convective Plasma)'
        : 'Granular Transition Shear Layer';

      setProbeData({ xKm, yKm, temp, velocity, magnetic, feature });
    }
  };

  return (
    <div
      id="sun-plasma-interactive-container"
      className="my-4 rounded-2xl bg-[#080808] text-white border border-white/15 p-4 sm:p-6 overflow-hidden shadow-2xl space-y-4"
    >
      {/* Header & Observational Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30 font-mono">
              <Sun className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '20s' }} />
              High-Resolution Plasma Convection Observatory
            </span>
            <span className="text-[9px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline">
              DKIST 4m Primary Mirror · 18 km/px
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-light text-white tracking-tight font-serif">
            Live Granulation Dynamics & Magnetic Knots
          </h3>
        </div>

        {/* Spectroscopic Filter Mode Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setWavelength('photosphere')}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              wavelength === 'photosphere'
                ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(242,125,38,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Photosphere (430 nm)</span>
          </button>
          <button
            onClick={() => setWavelength('h-alpha')}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              wavelength === 'h-alpha'
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Chromosphere H-α</span>
          </button>
          <button
            onClick={() => setWavelength('coronal-euv')}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              wavelength === 'coronal-euv'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Corona EUV (17.1 nm)</span>
          </button>
          <button
            onClick={() => setWavelength('doppler')}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              wavelength === 'doppler'
                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Doppler Flow</span>
          </button>
          <button
            onClick={() => setWavelength('magnetogram')}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
              wavelength === 'magnetogram'
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Stokes-V (B-Field)</span>
          </button>
        </div>
      </div>

      {/* Interactive Stage & Live Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Interactive Canvas Stage */}
        <div className="lg:col-span-8 relative rounded-xl bg-black border border-white/15 overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
          <canvas
            ref={canvasRef}
            onMouseMove={(e) => handleCanvasInteraction(e.clientX, e.clientY)}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onMouseLeave={() => setProbePos(null)}
            className="w-full h-full absolute inset-0 cursor-crosshair"
          />

          {/* Top Stage Badges Overlay */}
          <div className="relative z-10 p-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-orange-400 font-bold flex items-center gap-1.5">
                <Crosshair className="w-3 h-3" /> Interactive Telemetry Probe Active
              </span>
            </div>

            <div className="text-[10px] font-mono text-white/70 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              Field of View: 1,500 km × 1,500 km
            </div>
          </div>

          {/* Bottom Stage Scale Bar & Controls Bar */}
          <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Resolution Scale Bar */}
            <div className="flex items-center gap-2 text-white/70">
              <div className="flex flex-col items-center">
                <div className="w-16 h-1 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(242,125,38,0.8)]" />
                <span className="text-[9px] uppercase tracking-wider text-orange-300 mt-0.5">250 km</span>
              </div>
              <span className="text-[10px] text-white/40 border-l border-white/20 pl-2">
                18 km/pixel (Diffraction Limit)
              </span>
            </div>

            {/* Playback & Nanoflare Trigger Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
                title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setSimSpeed(simSpeed === 1 ? 2.5 : simSpeed === 2.5 ? 5 : 1)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition border border-white/15"
              >
                {simSpeed}x Speed
              </button>

              <button
                onClick={triggerNanoflare}
                className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-[10px] uppercase tracking-wider transition flex items-center gap-1 shadow-md"
              >
                <Zap className="w-3 h-3" />
                <span>Inject Nanoflare</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Spectroscopic HUD & Diagnostic Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          {/* Probe Live Readout Card */}
          <div className="rounded-xl bg-white/[0.03] border border-orange-500/30 p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-orange-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5" /> Live Spectroscopic Probe
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                Locked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block">Observed Temp</span>
                <span className="text-sm font-bold text-orange-300">
                  {probeData.temp.toLocaleString()} {wavelength === 'coronal-euv' ? 'K' : '°C'}
                </span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block">Doppler Vector</span>
                <span className={`text-sm font-bold ${probeData.velocity >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {probeData.velocity >= 0 ? `+${probeData.velocity}` : probeData.velocity} km/s
                </span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block">Magnetic Flux (B)</span>
                <span className="text-sm font-bold text-amber-300">
                  {probeData.magnetic.toLocaleString()} Gauss
                </span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block">Spatial Offset</span>
                <span className="text-xs font-bold text-white/80">
                  [{probeData.xKm} km, {probeData.yKm} km]
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-orange-950/20 border border-orange-500/20 text-[11px] text-white/80 space-y-0.5 font-light">
              <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 font-bold block">
                Feature Classification:
              </span>
              <p className="leading-snug text-white font-medium">{probeData.feature}</p>
            </div>
          </div>

          {/* Diagnostic Overlay Layer Toggles */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3 space-y-2 text-xs font-mono">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">
              Observatory Telemetry Layers
            </span>

            <div className="space-y-1.5">
              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition">
                <span className="text-white/80 text-[11px]">Magnetic Field Lines (B-Vectors)</span>
                <input
                  type="checkbox"
                  checked={showMagneticVectors}
                  onChange={(e) => setShowMagneticVectors(e.target.checked)}
                  className="rounded border-white/20 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition">
                <span className="text-white/80 text-[11px]">Doppler Convective Flow Arrows</span>
                <input
                  type="checkbox"
                  checked={showDopplerArrows}
                  onChange={(e) => setShowDopplerArrows(e.target.checked)}
                  className="rounded border-white/20 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition">
                <span className="text-white/80 text-[11px]">5-Min Solar Acoustic Waves (p-modes)</span>
                <input
                  type="checkbox"
                  checked={showAcousticWaves}
                  onChange={(e) => setShowAcousticWaves(e.target.checked)}
                  className="rounded border-white/20 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
