import { useState, FormEvent } from 'react';
import { User, Lock, ArrowRight, AlertCircle, Mail } from 'lucide-react';

interface SignupPageProps {
  onSignup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onNavigate: (route: string) => void;
}

export function SignupPage({ onSignup, onNavigate }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);

    const res = await onSignup(name, email, password);
    setLoading(false);
    if (res.success) {
      onNavigate('/my-bookings');
    } else {
      setError(res.error || 'Account creation failed');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-[#08080b]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 p-[1px] mx-auto mb-3 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">Create Membership</h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">Join Serenity Wellness with voice concierge</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Rostova"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@serenitywellness.com"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE MEMBERSHIP'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-zinc-400">
          <span>Already have an account? </span>
          <button
            onClick={() => onNavigate('/login')}
            className="text-white hover:underline font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
