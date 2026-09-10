import { User, Mail, Shield, Mic, Radio, Award } from 'lucide-react';
import { AuthUser } from '../types';

interface ProfilePageProps {
  user: AuthUser | null;
  onNavigate: (route: string) => void;
}

export function ProfilePage({ user, onNavigate }: ProfilePageProps) {
  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 p-[2px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-2xl font-bold text-white uppercase">
              {user ? user.name.charAt(0) : 'G'}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300 mb-2">
              <Award className="w-3.5 h-3.5 text-zinc-400" />
              <span>SERENITY PREMIER MEMBER</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white tracking-tight">
              {user ? user.name : 'Guest Member'}
            </h1>
            <p className="text-zinc-400 text-sm font-mono mt-0.5">
              {user ? user.email : 'guest@serenitywellness.com'}
            </p>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            VOICE & CONCIERGE PREFERENCES
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-300 mb-2">
                <Radio className="w-4 h-4 text-zinc-400" />
                <span className="font-semibold text-white">SPEECH SYNTHESIS ENGINE</span>
              </div>
              <p className="text-zinc-400 mb-1">Rime Neural (mistv2 / astra)</p>
              <span className="text-[10px] text-zinc-500">24 kHz High Resolution Audio</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-300 mb-2">
                <Mic className="w-4 h-4 text-zinc-400" />
                <span className="font-semibold text-white">INTERRUPTION SENSITIVITY</span>
              </div>
              <p className="text-zinc-400 mb-1">Standard Full-Duplex</p>
              <span className="text-[10px] text-zinc-500">Acoustic Cutoff &lt;8ms</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => onNavigate('/my-bookings')}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => onNavigate('/experience')}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Start Session with ARIA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
