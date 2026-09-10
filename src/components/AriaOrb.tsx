import { motion } from 'motion/react';
import { VoiceState } from '../types';

interface AriaOrbProps {
  state: VoiceState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
}

export function AriaOrb({ state, size = 'hero', className = '', onClick }: AriaOrbProps) {
  // Dimensions map
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    hero: 'w-72 h-72 sm:w-96 sm:h-96',
  }[size];

  // Refined monochromatic luxury aura
  const getOrbAura = () => {
    switch (state) {
      case 'LISTENING':
        return 'from-white/20 via-zinc-400/15 to-zinc-900/40 shadow-[0_0_80px_15px_rgba(255,255,255,0.2)]';
      case 'THINKING':
        return 'from-zinc-200/25 via-zinc-500/15 to-zinc-950/50 shadow-[0_0_90px_20px_rgba(255,255,255,0.15)]';
      case 'SPEAKING':
        return 'from-white/35 via-zinc-300/20 to-zinc-900/40 shadow-[0_0_110px_25px_rgba(255,255,255,0.3)]';
      case 'INTERRUPTED':
        return 'from-rose-500/40 via-rose-700/20 to-zinc-950/60 shadow-[0_0_80px_20px_rgba(244,63,94,0.35)]';
      case 'RECOVERING':
        return 'from-white/30 via-zinc-400/20 to-zinc-900/50 shadow-[0_0_90px_20px_rgba(255,255,255,0.25)]';
      case 'IDLE':
      default:
        return 'from-zinc-400/15 via-zinc-700/10 to-zinc-950/40 shadow-[0_0_50px_10px_rgba(255,255,255,0.08)]';
    }
  };

  return (
    <div
      id="aria-voice-orb-container"
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group ${className}`}
    >
      {/* Outer ambient glow field */}
      <motion.div
        animate={{
          scale: state === 'SPEAKING' ? [1, 1.12, 1] : state === 'INTERRUPTED' ? [1.1, 0.9] : [1, 1.04, 1],
          opacity: state === 'INTERRUPTED' ? [0.9, 0.4] : [0.5, 0.75, 0.5],
        }}
        transition={{
          duration: state === 'SPEAKING' ? 1.2 : state === 'INTERRUPTED' ? 0.25 : 4,
          repeat: state === 'INTERRUPTED' ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute rounded-full -inset-4 blur-2xl transition-all duration-700 bg-gradient-to-tr ${getOrbAura()}`}
      />

      {/* Orbiting harmonic ring 1 (Thinking & Speaking) */}
      <motion.div
        animate={{
          rotate: state === 'THINKING' ? 360 : 0,
          scale: state === 'SPEAKING' ? [1, 1.05, 0.98, 1] : 1,
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={`absolute rounded-full border border-white/20 w-[112%] h-[112%] pointer-events-none ${
          state === 'THINKING' || state === 'SPEAKING' ? 'opacity-70' : 'opacity-20'
        }`}
      />

      {/* Orbiting harmonic ring 2 */}
      <motion.div
        animate={{
          rotate: state === 'RECOVERING' ? -360 : 180,
          scale: state === 'INTERRUPTED' ? 0.75 : state === 'RECOVERING' ? [0.8, 1.05, 1] : 1,
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.5, ease: 'easeOut' },
        }}
        className={`absolute rounded-full border border-white/10 w-[124%] h-[124%] pointer-events-none ${
          state === 'RECOVERING' ? 'opacity-80' : 'opacity-15'
        }`}
      />

      {/* Central Orb Sphere */}
      <motion.div
        animate={{
          scale:
            state === 'SPEAKING'
              ? [1, 1.04, 0.98, 1.03, 1]
              : state === 'INTERRUPTED'
              ? [1.05, 0.9]
              : state === 'RECOVERING'
              ? [0.92, 1.02, 1]
              : state === 'LISTENING'
              ? [1, 1.03, 1]
              : [1, 1.01, 1],
        }}
        transition={{
          duration:
            state === 'SPEAKING'
              ? 0.9
              : state === 'INTERRUPTED'
              ? 0.2
              : state === 'RECOVERING'
              ? 0.6
              : state === 'LISTENING'
              ? 1.5
              : 3.5,
          repeat: state === 'INTERRUPTED' ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        className={`${sizeClasses} relative rounded-full overflow-hidden backdrop-blur-xl border border-white/15 bg-gradient-to-b from-[#18181c] via-[#0e0e11] to-[#08080a] flex items-center justify-center`}
      >
        {/* Deep monochromatic fluid backdrop */}
        <motion.div
          animate={{
            rotate: [0, 180, 360],
            scale: state === 'SPEAKING' ? [1, 1.15, 1] : [1, 1.04, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute inset-0 bg-radial from-white/15 via-zinc-600/10 to-transparent opacity-70"
        />

        {/* Secondary node */}
        <motion.div
          animate={{
            x: state === 'LISTENING' ? [0, 6, -6, 0] : state === 'SPEAKING' ? [-8, 8, -4, 0] : [0, 3, 0],
            y: state === 'LISTENING' ? [0, -5, 5, 0] : state === 'SPEAKING' ? [4, -8, 4, 0] : [0, -3, 0],
            opacity: state === 'INTERRUPTED' ? 0.2 : [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-3/4 h-3/4 rounded-full bg-radial from-white/10 via-zinc-500/10 to-transparent blur-md"
        />

        {/* Inner nucleus */}
        <motion.div
          animate={{
            scale: state === 'SPEAKING' ? [0.96, 1.08, 0.96] : state === 'INTERRUPTED' ? 0.65 : [1, 1.02, 1],
          }}
          transition={{ duration: 1.4, repeat: state === 'INTERRUPTED' ? 0 : Infinity }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          {/* Audio reactive core / visual state badge */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            {state === 'INTERRUPTED' ? (
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            ) : state === 'RECOVERING' ? (
              <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
            ) : state === 'SPEAKING' ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-4 bg-white rounded-full animate-[bounce_0.6s_infinite]" />
                <span className="w-1 h-7 bg-white rounded-full animate-[bounce_0.8s_infinite]" />
                <span className="w-1 h-4 bg-white rounded-full animate-[bounce_0.5s_infinite]" />
              </div>
            ) : state === 'LISTENING' ? (
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" />
            ) : state === 'THINKING' ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            )}
          </div>
        </motion.div>

        {/* State label on bottom edge of orb */}
        <div className="absolute bottom-6 sm:bottom-8 z-20 text-center">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-zinc-300 font-medium px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
            {state}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
