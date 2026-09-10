import { VoiceEngineInfo } from '../types';
import { Sparkles, AlertCircle, Radio } from 'lucide-react';

interface VoiceBadgeProps {
  info: VoiceEngineInfo;
  compact?: boolean;
}

export function VoiceBadge({ info, compact = false }: VoiceBadgeProps) {
  const isRime = info.isVerifiedRime && info.provider === 'Rime';

  if (compact) {
    return (
      <div
        id="voice-engine-badge-compact"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border border-white/15 bg-white/5 text-zinc-200 backdrop-blur-md"
        title={info.statusNote || 'Voice Engine'}
      >
        <span className={`w-2 h-2 rounded-full ${isRime ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50' : 'bg-zinc-400'}`} />
        <span className="font-semibold text-white">{isRime ? 'RIME TTS' : 'VOICE ENGINE'}</span>
        <span className="text-zinc-400 text-[10px]">({info.model || 'mistv2'} • 24kHz)</span>
      </div>
    );
  }

  return (
    <div
      id="voice-engine-badge-full"
      className="p-3.5 rounded-2xl border border-white/10 bg-zinc-950 text-zinc-300 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {isRime ? (
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-zinc-400">
            VOICE SYNTHESIS
          </span>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full font-medium border border-white/10 bg-white/5 text-white">
          {isRime ? 'Rime mistv2' : 'Local Fallback'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 font-mono text-[11px]">
        <div>
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">MODEL</span>
          <span className="text-zinc-200 font-medium">{info.model}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">VOICE</span>
          <span className="text-zinc-200 font-medium">{info.voice}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">SAMPLE RATE</span>
          <span className="text-zinc-200 font-medium">{info.samplingRate / 1000} kHz</span>
        </div>
      </div>
    </div>
  );
}
