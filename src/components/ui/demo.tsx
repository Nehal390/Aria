'use client';

import React, { useState } from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";
import { SolarSwellParticles } from "@/components/ui/solar-swell-particles";
import { cn } from "@/lib/utils";
import { Sparkles, Activity, Calendar, ArrowRight, Waves } from "lucide-react";

interface SplineSceneBasicProps {
  onLaunchVoice?: () => void;
  onBook?: () => void;
}

export function SplineSceneBasic({ onLaunchVoice, onBook }: SplineSceneBasicProps) {
  const [visualMode, setVisualMode] = useState<'spline' | 'particles'>('spline');

  return (
    <Card className="w-full min-h-[520px] lg:h-[600px] rounded-[28px] sm:rounded-[36px] bg-zinc-950/90 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Top right subtle animation switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono">
        <button
          type="button"
          onClick={() => setVisualMode('spline')}
          className={cn(
            "px-3 py-1 rounded-full transition-all cursor-pointer",
            visualMode === 'spline'
              ? "bg-white/20 text-white font-medium shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          3D Spatial Core
        </button>
        <button
          type="button"
          onClick={() => setVisualMode('particles')}
          className={cn(
            "px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer",
            visualMode === 'particles'
              ? "bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Solar Swell (Orbital Wave)
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 sm:p-10 md:p-14 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-6 w-fit">
            <Activity className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Interactive Neural Spatial Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.05]">
            Human-Machine <br />
            <span className="text-zinc-400">
              Voice Symbiosis
            </span>
          </h1>

          <p className="mt-5 text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg font-normal">
            Experience ARIA’s sub-80ms full-duplex conversational engine with natural zero-latency interruption recovery and tactile acoustic presence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {onLaunchVoice && (
              <LiquidButton
                onClick={onLaunchVoice}
                size="lg"
                className="px-6 py-3 text-sm font-semibold text-white border border-white/20 hover:border-white/40 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Start Live Voice Session</span>
              </LiquidButton>
            )}

            {onBook && (
              <button
                onClick={onBook}
                className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Book Clinic</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full-Duplex Audio Engine Ready</span>
            </div>
          </div>
        </div>

        {/* Right content - Switchable 3D Scene or Solar Swell Particle Wave */}
        <div className="flex-1 relative min-h-[380px] lg:min-h-full overflow-hidden">
          {visualMode === 'spline' ? (
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full p-4 flex items-center justify-center">
              <SolarSwellParticles
                className="w-full h-full rounded-2xl border-0 shadow-none bg-transparent"
                particleColor="amber"
                showOrbitalRings={true}
                showTelemetry={true}
                interactive={true}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="relative h-[200px] w-[800px] max-w-full mx-auto flex items-center justify-center">
      <LiquidButton className="z-10">
        Liquid Glass
      </LiquidButton>
    </div>
  );
}

