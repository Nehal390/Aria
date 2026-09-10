import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  UserCheck,
  DollarSign,
  AlertCircle,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Mic,
} from 'lucide-react';
import { BookingRecord } from '../types';

interface MyBookingsPageProps {
  onNavigate: (route: string) => void;
}

export function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/bookings');
      const data = await resp.json();
      setBookings(data);
    } catch (e) {
      console.error('Failed fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      if (res.ok) {
        setActionMessage('Appointment cancelled successfully.');
        setTimeout(() => setActionMessage(null), 4000);
        fetchBookings();
      }
    } catch (e) {
      console.error('Cancel booking error:', e);
    }
  };

  const handleRescheduleBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: '05:00 PM', date: '2026-09-15' }),
      });
      if (res.ok) {
        setActionMessage('Appointment rescheduled to 5:00 PM on Sept 15.');
        setTimeout(() => setActionMessage(null), 4000);
        fetchBookings();
      }
    } catch (e) {
      console.error('Reschedule error:', e);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-8 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 block mb-1">
              RESTORATIVE SCHEDULE
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              My Appointments
            </h1>
          </div>

          <button
            onClick={() => onNavigate('/experience')}
            className="px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm transition-all"
          >
            <Mic className="w-3.5 h-3.5 text-black animate-pulse" />
            <span>BOOK ANOTHER BY VOICE</span>
          </button>
        </div>

        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-zinc-900 border border-white/15 text-zinc-200 text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20 font-mono text-xs text-zinc-500">
            Retrieving clinic booking records...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 p-10 rounded-3xl bg-zinc-950 border border-white/10">
            <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-display font-bold text-lg mb-1 tracking-tight">No appointments found</h3>
            <p className="text-zinc-400 text-xs mb-6 font-normal">Talk to ARIA or browse the booking catalog to reserve your first treatment.</p>
            <button
              onClick={() => onNavigate('/booking')}
              className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full uppercase font-semibold text-[10px] border ${
                        b.status === 'upcoming'
                          ? 'bg-zinc-800 border-white/20 text-white'
                          : b.status === 'completed'
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-zinc-500">#{b.id}</span>
                    {b.turnId && (
                      <span className="text-zinc-400 font-mono text-[10px]">
                        • Voice Turn #{b.turnId}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-1 tracking-tight">
                    {b.serviceName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mt-2">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {b.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {b.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                      {b.practitionerName}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                      ${b.price} ({b.durationMinutes} min)
                    </span>
                  </div>
                </div>

                {b.status === 'upcoming' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRescheduleBooking(b.id)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
