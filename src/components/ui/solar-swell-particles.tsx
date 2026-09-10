'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SolarSwellParticlesProps {
  className?: string;
  particleColor?: 'amber' | 'monochrome' | 'gold';
  showOrbitalRings?: boolean;
  showTelemetry?: boolean;
  showHeader?: boolean;
  interactive?: boolean;
}

export function SolarSwellParticles({
  className,
  particleColor = 'amber',
  showOrbitalRings = true,
  showTelemetry = true,
  showHeader = true,
  interactive = true,
}: SolarSwellParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const [timeString, setTimeString] = useState('10:30 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Particle Grid Simulation Settings
    const COLS = 85;
    const ROWS = 45;
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.42;

      // -------------------------------------------------------------
      // 1. Draw Faint Celestial Orbital Rings (Concentric & Geometric)
      // -------------------------------------------------------------
      if (showOrbitalRings) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';

        // Ring 1: Primary Large Central Orbit
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.36, width * 0.36, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 2: Upper Elevated Orbit
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - height * 0.08, width * 0.22, width * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 3: Top Zenith Small Orbit
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - height * 0.16, width * 0.11, width * 0.11, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 4: Giant Outer Faint Ellipse
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + height * 0.05, width * 0.52, height * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 2. Render Solar Swell 3D Particle Mesh
      // -------------------------------------------------------------
      ctx.save();
      // Additive blending for luminous glow
      ctx.globalCompositeOperation = 'lighter';

      const gridWidth = width * 1.25;
      const gridDepth = height * 0.85;
      const startX = -gridWidth * 0.125;
      const startY = height * 0.32;

      const mouseInfluenceX = (mouseRef.current.x - 0.5) * 120;
      const mouseInfluenceY = (mouseRef.current.y - 0.5) * 80;

      for (let r = 0; r < ROWS; r++) {
        const rowProgress = r / ROWS;
        // Perspective scaling (closer rows are larger and lower)
        const perspective = 0.35 + rowProgress * 0.95;
        const yBase = startY + rowProgress * gridDepth + Math.sin(rowProgress * Math.PI) * 20;

        for (let c = 0; c < COLS; c++) {
          const colProgress = c / COLS;
          const x = startX + colProgress * gridWidth;

          // Normalized distance from center (for swell peak)
          const distFromCenter = Math.abs(colProgress - 0.5) * 2;
          const swellDamping = Math.exp(-distFromCenter * 2.2);

          // Complex undulating wave equation (harmonics + sine ripples)
          const wave1 = Math.sin(colProgress * 12 + time * 1.5) * 24;
          const wave2 = Math.cos(rowProgress * 10 - time * 2) * 18;
          const wave3 = Math.sin((colProgress + rowProgress) * 8 + time) * 14;

          // Central solar crest swell
          const centralSwell = Math.sin(colProgress * Math.PI) * 55 * swellDamping;

          // Interactive mouse wave
          const mouseDist = Math.hypot(
            (colProgress - mouseRef.current.x),
            (rowProgress - mouseRef.current.y)
          );
          const mouseWave = Math.exp(-mouseDist * 8) * 35;

          const elevation = (wave1 + wave2 + wave3 + centralSwell + mouseWave) * perspective;
          const finalY = yBase - elevation + mouseInfluenceY * rowProgress;
          const finalX = x + mouseInfluenceX * (1 - rowProgress);

          // Distance and luminosity calculations
          const alphaBase = Math.min(1, Math.max(0.1, rowProgress * 1.1)) * (0.3 + swellDamping * 0.7);
          const particleSize = (1.2 + rowProgress * 2.2 + (elevation > 20 ? 1.2 : 0)) * 0.8;

          // Colors based on selected palette
          let color = '';
          if (particleColor === 'amber') {
            if (elevation > 28) {
              // Solar apex crest: brilliant incandescent white-gold
              color = `rgba(255, 245, 220, ${alphaBase * 0.95})`;
            } else if (elevation > 8) {
              // Mid wave: glowing amber solar flare
              color = `rgba(245, 158, 45, ${alphaBase * 0.85})`;
            } else {
              // Deep trough: dark burnished copper / embers
              color = `rgba(180, 80, 20, ${alphaBase * 0.45})`;
            }
          } else if (particleColor === 'gold') {
            color = elevation > 20
              ? `rgba(255, 235, 170, ${alphaBase * 0.9})`
              : `rgba(215, 170, 60, ${alphaBase * 0.6})`;
          } else {
            // Monochrome minimalist
            color = elevation > 20
              ? `rgba(255, 255, 255, ${alphaBase * 0.9})`
              : `rgba(180, 180, 190, ${alphaBase * 0.5})`;
          }

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(finalX, finalY, Math.max(0.6, particleSize), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseRef.current.targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        mouseRef.current.targetY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0.5;
      mouseRef.current.targetY = 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, showOrbitalRings, interactive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-[480px] sm:h-[540px] lg:h-[600px] rounded-[32px] sm:rounded-[40px] bg-[#050508] border border-white/10 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] select-none',
        className
      )}
    >
      {/* Background Subtle Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,45,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10"
      />

      {/* Studio Header Overlay */}
      {showHeader && (
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 pointer-events-none flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            Solar Particle Field · Light in Motion
          </span>
        </div>
      )}

      {/* Telemetry Footer Overlays (matching the screenshot reference) */}
      {showTelemetry && (
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-20 flex flex-wrap items-end justify-between gap-6 pointer-events-none">
          {/* Location & Time Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>New York, {timeString}</span>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-6 sm:gap-10 font-mono">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-white block">4.9</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">User Reviews</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-xl sm:text-2xl font-bold text-white block">30k</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Active Clients</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-xl sm:text-2xl font-bold text-white block">15k</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Good Feedback</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
