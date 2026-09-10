import { motion } from 'motion/react';
import { VoiceState } from '../types';

interface WaveformProps {
  state: VoiceState;
  barCount?: number;
  className?: string;
}

export function Waveform({ state, barCount = 28, className = '' }: WaveformProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  const getBarHeight = (index: number) => {
    if (state === 'SPEAKING') {
      const normalized = Math.sin((index / barCount) * Math.PI);
      return [10, Math.max(14, normalized * 38 + Math.random() * 16), 8];
    }
    if (state === 'LISTENING') {
      return [6, 14 + (index % 4) * 3, 6];
    }
    if (state === 'INTERRUPTED') {
      return [4, 4];
    }
    if (state === 'RECOVERING') {
      return [6, 20, 8];
    }
    return [4, 6, 4];
  };

  const getBarColor = () => {
    if (state === 'INTERRUPTED') return 'bg-rose-500/80';
    if (state === 'RECOVERING') return 'bg-white';
    if (state === 'SPEAKING') return 'bg-white';
    if (state === 'LISTENING') return 'bg-zinc-300';
    return 'bg-zinc-700/60';
  };

  return (
    <div id="aria-waveform" className={`flex items-center justify-center gap-1.5 h-14 px-4 ${className}`}>
      {bars.map((bar, i) => (
        <motion.div
          key={bar}
          animate={{
            height: getBarHeight(i),
            opacity: state === 'INTERRUPTED' ? 0.3 : [0.6, 1, 0.6],
          }}
          transition={{
            duration: state === 'SPEAKING' ? 0.4 + (i % 5) * 0.1 : 1.2,
            repeat: state === 'INTERRUPTED' ? 0 : Infinity,
            repeatType: 'reverse',
            delay: (i * 0.03) % 0.4,
          }}
          className={`w-1 rounded-full transition-colors duration-300 ${getBarColor()}`}
        />
      ))}
    </div>
  );
}
