import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { CLINIC_SERVICES, CLINIC_PRACTITIONERS } from '../data/clinic';
import { ClinicService } from '../types';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface BookingPageProps {
  onNavigate: (route: string) => void;
}

export function BookingPage({ onNavigate }: BookingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ClinicService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-12');
  const [selectedTime, setSelectedTime] = useState<string>('03:00 PM');
  const [selectedPractitioner, setSelectedPractitioner] = useState<string>('Elena Vance, LMT');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'Massage Therapy', label: 'Massage Therapy' },
    { id: 'Aesthetic Wellness', label: 'Skincare & Facials' },
    { id: 'Thermal Healing', label: 'Thermal Healing' },
    { id: 'Eastern Medicine', label: 'Holistic & Energy' },
    { id: 'Somatic Sound', label: 'Mindfulness' },
  ];

  const filteredServices = CLINIC_SERVICES.filter((svc) => {
    if (selectedCategory === 'all') return true;
    return svc.category === selectedCategory;
  });

  const availableSlots = [
    '09:00 AM',
    '10:30 AM',
    '01:15 PM',
    '03:00 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  const handleManualBook = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);

    const dur = selectedService.durations[0];

    try {
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.title,
          durationMinutes: dur?.minutes || 60,
          price: dur?.price || 140,
          date: selectedDate,
          time: selectedTime,
          practitionerName: selectedPractitioner,
          customerName: 'Guest Client',
          customerEmail: 'guest@serenitywellness.com',
        }),
      });

      if (resp.ok) {
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 8000);
      }
    } catch (e) {
      console.error('Failed booking:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Clean Professional Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                SERENITY CLINICAL WELLNESS
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
              Reserve a Sanctuary Session
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Browse curated clinical wellness treatments or speak directly with ARIA for sub-80ms hands-free scheduling and real-time interruption recovery.
            </p>
          </div>

          <LiquidButton
            id="booking-speak-to-aria-btn"
            onClick={() => onNavigate('/experience')}
            size="lg"
            className="text-xs font-semibold px-6 py-3 text-white border border-white/20 hover:border-white/40"
          >
            <Mic className="w-4 h-4 text-white animate-pulse" />
            <span>Speak to Book with ARIA</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </LiquidButton>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-zinc-500 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main 2-Column: Offerings Grid + Live Booking Slip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services List (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              const primaryDuration = service.durations[0];
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900/90 border-white/40 shadow-xl scale-[1.01]'
                      : 'bg-zinc-950/60 border-white/10 hover:border-white/25 hover:bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="text-zinc-400 font-medium uppercase tracking-wider text-[11px]">
                        {service.category}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {primaryDuration.minutes} min
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-white mb-2 leading-snug tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-5">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-white tracking-tight">
                      ${primaryDuration.price}
                    </span>
                    <button
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors border ${
                        isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 border-white/15 text-zinc-200 hover:bg-white hover:text-black hover:border-white'
                      }`}
                    >
                      {isSelected ? 'SELECTED' : 'SELECT'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Slip (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 sticky top-28 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block">
                    RESERVATION DETAILS
                  </span>
                  <h3 className="font-display font-bold text-lg text-white tracking-tight mt-0.5">
                    {selectedService ? selectedService.title : 'Select a Treatment'}
                  </h3>
                </div>
                {selectedService && (
                  <span className="font-display font-bold text-2xl text-white tracking-tight">
                    ${selectedService.durations[0]?.price}
                  </span>
                )}
              </div>

              {/* Slot & Date Pickers */}
              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    SELECT DATE
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['2026-09-12', '2026-09-13', '2026-09-14'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all border ${
                          selectedDate === d
                            ? 'bg-white text-black font-semibold border-white shadow-sm'
                            : 'bg-zinc-900/60 text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {d.split('-').slice(1).join('/')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    AVAILABLE TIME SLOT
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all border ${
                          selectedTime === slot
                            ? 'bg-white text-black font-semibold border-white shadow-sm'
                            : 'bg-zinc-900/60 text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    WELLNESS PRACTITIONER
                  </label>
                  <select
                    value={selectedPractitioner}
                    onChange={(e) => setSelectedPractitioner(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                  >
                    {CLINIC_PRACTITIONERS.map((p) => (
                      <option key={p.id} value={`${p.name}, ${p.role}`} className="bg-zinc-950">
                        {p.name} — {p.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="booking-confirm-manual-btn"
                disabled={!selectedService || isSubmitting}
                onClick={handleManualBook}
                className="w-full py-4 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:hover:bg-white shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'RESERVING...' : 'CONFIRM APPOINTMENT'}</span>
              </button>

              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3.5 rounded-xl bg-zinc-900 border border-white/20 text-zinc-200 text-xs font-mono text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Session confirmed! View in My Bookings.</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
