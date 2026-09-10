import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  ArrowRight,
  Radio,
  ShieldAlert,
  Cpu,
  Sparkles,
  VolumeX,
  CheckCircle2,
  Activity,
  Layers,
  Zap,
  Globe2,
  Calendar,
  Compass,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { AriaOrb } from '../components/AriaOrb';
import { VoiceState } from '../types';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { SplineSceneBasic } from '@/components/ui/demo';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import { SolarSwellParticles } from '@/components/ui/solar-swell-particles';
import { CircularCarousel, type CarouselItem } from '@/components/ui/circular-carousel';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [interactiveState, setInteractiveState] = useState<VoiceState>('IDLE');
  const [activeStoryStep, setActiveStoryStep] = useState(2);

  const storySteps = [
    {
      id: 'step-1',
      time: '3:00 PM',
      tag: 'INITIAL INTENT',
      label: '3:00 PM Booking Initiated',
      desc: 'User speaks: "Book me a Swedish massage for 3 PM." Availability background tool runs.',
      badge: 'Turn 1 Active',
      color: 'border-zinc-700 bg-zinc-900/60 text-zinc-300',
    },
    {
      id: 'step-2',
      time: '3:00 PM',
      tag: 'SPEECH ACTIVE',
      label: 'ARIA Spoken Output',
      desc: 'Rime synthesis begins audio stream: "Checking availability for 3 PM tomorrow..."',
      badge: 'Rime Streaming',
      color: 'border-zinc-500 bg-zinc-800/40 text-zinc-200',
    },
    {
      id: 'step-3',
      time: 'BARGE-IN',
      tag: 'USER INTERRUPTS',
      label: '"Actually, make that 5 PM"',
      desc: 'User speaks over ARIA. Acoustic energy and phoneme detection trigger immediate barge-in.',
      badge: 'Interrupted',
      color: 'border-rose-500/50 bg-rose-950/30 text-rose-300',
    },
    {
      id: 'step-4',
      time: '0ms',
      tag: 'AUDIO CUTOFF',
      label: 'Audio Stopped Instantly',
      desc: 'WebAudio buffer source disconnected. Output gain drops to zero immediately. Zero residual echo.',
      badge: 'Cutoff Latency <5ms',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      id: 'step-5',
      time: 'TURN 2',
      tag: 'TURN INVALIDATED',
      label: 'Monotonic Turn Invalidation',
      desc: 'Turn 1 is permanently sealed as obsolete. Turn 2 created. Active state fenced against Turn 1.',
      badge: 'Turn 1 Sealed',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    },
    {
      id: 'step-6',
      time: 'FENCED',
      tag: 'STALE RESULT FENCED',
      label: 'Stale 3 PM Discarded',
      desc: 'Background 3 PM tool completes late. Verified turnId (1) < activeTurnId (2) — silently discarded!',
      badge: 'Leak Suppressed',
      color: 'border-zinc-500 bg-zinc-800/50 text-zinc-300',
    },
    {
      id: 'step-7',
      time: '5:00 PM',
      tag: 'STATE RECONCILED',
      label: '5:00 PM Confirmed by ARIA',
      desc: 'Authoritative booking state updated to 5:00 PM. Rime synthesizes clean confirmation.',
      badge: 'Authoritative',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 overflow-hidden bg-[#08080b]">
      {/* Background Precision Grid & Ambient Spotlights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-radial from-white/[0.04] to-transparent blur-[140px] pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. TOP SHOWCASE HEADER (motionsites.ai style) */}
      {/* ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-zinc-300">
              Prompt: Human-Machine
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              Full-Duplex Voice Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/demo')}
              className="px-4 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              <span>Launch Stress Test</span>
            </button>
            <LiquidButton
              onClick={() => onNavigate('/experience')}
              size="sm"
              className="text-xs font-semibold px-4 py-1.5 text-white"
            >
              <Mic className="w-3.5 h-3.5 text-white" />
              <span>Talk to ARIA</span>
            </LiquidButton>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. INTERACTIVE 3D SPLINE ROBOT HERO SCENE (Screenshot 2) */}
        {/* ============================================================ */}
        <div className="mt-8">
          <SplineSceneBasic
            onLaunchVoice={() => onNavigate('/experience')}
            onBook={() => onNavigate('/booking')}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. READY FOR EVALUATION (Swapped: Section 2 from Screenshot) */}
      {/* ============================================================ */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-zinc-950/80 border border-white/15 relative overflow-hidden shadow-2xl group">
          {/* Animated Solar Swell Particle Field in the background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <SolarSwellParticles
              className="w-full h-full rounded-none border-0 shadow-none bg-transparent"
              particleColor="amber"
              showOrbitalRings={true}
              showTelemetry={false}
              showHeader={false}
              interactive={true}
            />
            {/* Atmospheric overlay to preserve contrast and crisp typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-zinc-950/80 pointer-events-none" />
          </div>

          <Spotlight className="-top-20 left-1/2 -translate-x-1/2" fill="white" />

          <div className="relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4 block">
              READY FOR EVALUATION
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              SPEAK NATURALLY. <br />
              ARIA HANDLES THE REST.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto font-light mb-10">
              Experience the full voice concierge with 0ms audio cutoff or launch the automated stress test suite.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <LiquidButton
                onClick={() => onNavigate('/experience')}
                size="xxl"
                className="w-full sm:w-auto px-8 text-white font-semibold"
              >
                <Mic className="w-5 h-5 text-white animate-pulse" />
                <span>START CONVERSATION</span>
              </LiquidButton>

              <button
                onClick={() => onNavigate('/demo')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm tracking-wider uppercase border border-white/20 transition-all"
              >
                LAUNCH DEMO STRESS TEST
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ARIA RESPONSIVE LUMINOUS ENVELOPE (Voice Orb) */}
      {/* ============================================================ */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
          ACOUSTIC VISUALIZATION
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 tracking-tight">
          Luminous Voice Envelope
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-10">
          ARIA dynamically shifts its physical presence across 6 micro-states in response to your voice.
        </p>

        <div className="relative max-w-lg mx-auto flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
          <AriaOrb state={interactiveState} size="hero" />

          {/* State selector */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {(['IDLE', 'LISTENING', 'THINKING', 'SPEAKING', 'INTERRUPTED', 'RECOVERING'] as VoiceState[]).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setInteractiveState(st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                    interactiveState === st
                      ? 'bg-white text-black shadow font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-3">
            Click any state to preview ARIA’s acoustic feedback reactions
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SIGNATURE INTERACTION STORYTELLING & PIPELINE */}
      {/* ============================================================ */}
      <section
        id="signature-interruption-story"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3 block">
            THE DEFINING HARD VOICE PROBLEM
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Most voice agents know how to speak. <br />
            <span className="text-zinc-400">Few know when to stop.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            In human conversation, changing your mind is effortless. But in traditional voice AI, changing your mind produces audio collisions, stale booking updates, and race conditions where the robot answers the question you just cancelled.
          </p>
        </div>

        {/* Visual Timeline Diagram */}
        <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="font-mono text-sm tracking-wider uppercase text-zinc-200 font-semibold">
                THE SIGNATURE INTERACTION PIPELINE
              </h3>
            </div>
            <span className="font-mono text-xs text-zinc-400">
              Deterministic Monotonic Turn Fencing
            </span>
          </div>

          {/* Interactive Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-8">
            {storySteps.map((step, idx) => {
              const isSelected = activeStoryStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStoryStep(idx)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? `${step.color} shadow-lg scale-[1.02]`
                      : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="opacity-70 font-semibold">0{idx + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                      {step.time}
                    </span>
                  </div>
                  <h4 className="font-display font-semibold text-xs text-white mb-1 line-clamp-1">
                    {step.label}
                  </h4>
                  <span className="font-mono text-[9px] uppercase tracking-wider block opacity-75">
                    {step.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Detail Showcase */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/10 text-white border border-white/20">
                  {storySteps[activeStoryStep].badge}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  Phase {activeStoryStep + 1} of 7
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                {storySteps[activeStoryStep].label}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {storySteps[activeStoryStep].desc}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveStoryStep((prev) => (prev > 0 ? prev - 1 : 6))}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10"
              >
                ← Prev
              </button>
              <button
                onClick={() => setActiveStoryStep((prev) => (prev < 6 ? prev + 1 : 0))}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-mono text-white border border-white/30"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TECH-FORWARD CONCIERGE CARD (Swapped: Section 1 from Screenshot) */}
      {/* ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3 block">
              TECH-FORWARD WELLNESS ACCESS
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6 leading-tight">
              One Voice, <br />
              Zero Friction. Worldwide.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light mb-8">
              ARIA provides members with instantaneous, hands-free concierge access to premium wellness clinics, licensed practitioners, and personalized recovery protocols.
            </p>

            <div className="space-y-4 font-mono text-xs text-zinc-300 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Zero cancellation fees on mid-sentence rescheduled appointments</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Deterministic sync with Serenity Wellness clinic live calendar</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Sub-80ms Rime mistv2 speech synthesis with high-definition audio presence</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/booking')}
                className="px-7 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                See Clinic Services
              </button>
              <button
                onClick={() => onNavigate('/technology')}
                className="px-7 py-3 rounded-full bg-white/5 border border-white/15 text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/10 transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Right Showcase: Interactive Circular Carousel replacing static robotic hand */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative bg-zinc-950/80 backdrop-blur-xl p-6 py-8">
              {/* Soft ambient light glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                <div>
                  <span className="text-zinc-400 block text-[10px] tracking-wider uppercase">Treatment Roster</span>
                  <span className="text-white font-bold">FEATURING ARIA SPOKEN CONCIERGE</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md text-[11px]">
                  TOUCHLESS & VOICE-READY
                </span>
              </div>

              <CircularCarousel
                items={[
                  {
                    id: "1",
                    title: "Swedish Massage",
                    description: "Rhythmic full-body tension release & parasympathetic nervous system reboot.",
                    tag: "Restorative",
                  },
                  {
                    id: "2",
                    title: "Deep Tissue",
                    description: "Athletic decompression targeting chronic fascial knots and trigger points.",
                    tag: "Recovery",
                  },
                  {
                    id: "3",
                    title: "Hot Stone Therapy",
                    description: "Heated volcanic basalt stones for deep thermal muscle tension relief.",
                    tag: "Thermal",
                  },
                  {
                    id: "4",
                    title: "Hydrafacial Glow",
                    description: "Vortex suction pore cleansing with antioxidant peptide infusion.",
                    tag: "Skincare",
                  },
                  {
                    id: "5",
                    title: "Cedar Dry Sauna",
                    description: "Aromatic Finnish dry heat chamber for cardiovascular endurance and flush.",
                    tag: "Hydrotherapy",
                  },
                  {
                    id: "6",
                    title: "Eucalyptus Steam",
                    description: "Botanical humid mist opening respiratory airways and deeply soothing skin.",
                    tag: "Aromatherapy",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
