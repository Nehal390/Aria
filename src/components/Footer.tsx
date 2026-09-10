import { Mic, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="aria-global-footer" className="relative border-t border-white/10 bg-[#08080b] text-zinc-400 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Column 1 & 2: Brand & Positioning */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 p-[1px] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-wider text-white">
                  ARIA
                </span>
                <span className="block font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 -mt-1">
                  VOICE-NATIVE AI CONCIERGE
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6 font-normal">
              Full-duplex voice concierge architecture engineered for the moment people interrupt, change their minds, and still expect the correct booking outcome.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
              <Mic className="w-3.5 h-3.5 text-zinc-400" />
              <span>Voice AI Evaluation 2026</span>
            </div>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/experience')}
                  className="hover:text-white transition-colors"
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/technology')}
                  className="hover:text-white transition-colors"
                >
                  Technology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/demo')}
                  className="hover:text-white transition-colors"
                >
                  Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/evidence')}
                  className="hover:text-white transition-colors"
                >
                  Evidence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/booking')}
                  className="hover:text-white transition-colors"
                >
                  Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="hover:text-white transition-colors"
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/my-bookings')}
                  className="hover:text-white transition-colors"
                >
                  My Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/profile')}
                  className="hover:text-white transition-colors"
                >
                  Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Technical */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-4">
              Technical
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://rime.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Rime TTS</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/technology')}
                  className="hover:text-white transition-colors text-left"
                >
                  Interruption Recovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/evidence')}
                  className="hover:text-white transition-colors text-left"
                >
                  Acceptance Criteria
                </button>
              </li>
              <li>
                <span className="text-zinc-600 block text-xs font-mono mt-2">
                  Monotonic Turn Fencing v2.4
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 ARIA. Designed for Serenity Wellness Clinic.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Latency Target: &lt;50ms</span>
            <span>•</span>
            <span>Rime Sampling: 24 kHz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
