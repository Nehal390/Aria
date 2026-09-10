import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  MicOff,
  Square,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  DollarSign,
  Send,
  ExternalLink,
  ShieldCheck,
  Music,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { AriaOrb } from '../components/AriaOrb';
import { Waveform } from '../components/Waveform';
import { VoiceBadge } from '../components/VoiceBadge';
import { useVoiceConcierge } from '../hooks/useVoiceConcierge';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface ExperiencePageProps {
  onNavigate: (route: string) => void;
}

export function ExperiencePage({ onNavigate }: ExperiencePageProps) {
  const {
    voiceState,
    isMicActive,
    liveTranscript,
    engineInfo,
    bookingState,
    chatMessages,
    timelineEvents,
    audioVolume,
    micError,
    isTranscribing,
    isAmbienceActive,
    setVoice,
    toggleAmbience,
    clearMicError,
    startListening,
    stopListening,
    triggerInterruption,
    processUserSpeech,
    resetConversation,
    stopAudio,
  } = useVoiceConcierge();

  const [textInput, setTextInput] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showSanctuaryDetails, setShowSanctuaryDetails] = useState(false);

  // Dynamic test utterances showcasing open conversational questions, wellness science, and natural scheduling
  const quickPrompts = [
    {
      label: 'Why Massage Relieves Stress?',
      text: 'Can you explain why massage therapy is so good for mental health and stress relief?',
    },
    {
      label: 'Sauna vs Steam Room',
      text: 'What is the actual difference between your cedar dry sauna and eucalyptus steam room?',
    },
    {
      label: 'Schedule (9:00 AM)',
      text: 'Can I book a Swedish massage tomorrow morning at 9:00 AM?',
    },
    {
      label: 'Location (Sausalito)',
      text: 'Do you have another location besides San Francisco?',
    },
    {
      label: 'Post-Workout Soreness',
      text: 'Why do muscles get so sore after working out, and what treatment helps most?',
    },
    {
      label: 'Barge-In (Actually 6:30 PM)',
      text: 'Wait, actually make that 6:30 PM in the evening instead.',
    },
    {
      label: 'Hydrafacial Science',
      text: 'How does the Serenity Hydrafacial work for exfoliating and glowing skin?',
    },
    {
      label: 'Lock & Confirm',
      text: 'Yes, that sounds wonderful. Please lock that in and confirm.',
    },
  ];

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    clearMicError();
    processUserSpeech(textInput.trim());
    setTextInput('');
  };

  const handleConfirmBooking = async () => {
    try {
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: bookingState.serviceName || 'Full Body Swedish Massage',
          durationMinutes: bookingState.durationMinutes || 60,
          price: bookingState.price || 140,
          date: bookingState.date || '2026-09-12',
          time: (bookingState.time && !bookingState.time.includes('Flexible') && !bookingState.time.includes('Select'))
            ? bookingState.time
            : '10:00 AM',
          practitionerName: bookingState.practitionerName || 'Elena Vance, LMT',
          customerName: 'Guest Client',
          customerEmail: 'guest@serenitywellness.com',
          turnId: bookingState.currentTurnId,
        }),
      });
      if (resp.ok) {
        setBookingConfirmed(true);
        setTimeout(() => setBookingConfirmed(false), 8000);
      }
    } catch (e) {
      console.error('Error confirming booking:', e);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                LIVE CONCIERGE SESSION
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Serenity Wellness Concierge
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ambient Soundscape Toggle */}
            <button
              id="exp-ambience-toggle-btn"
              onClick={toggleAmbience}
              className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                isAmbienceActive
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-950'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Toggle Procedural 432Hz Drone Ambience with automatic vocal ducking"
            >
              <Music className={`w-3.5 h-3.5 ${isAmbienceActive ? 'animate-pulse text-emerald-400' : 'text-zinc-500'}`} />
              <span>{isAmbienceActive ? 'Ambience: 432Hz Active' : 'Spa Ambience: Off'}</span>
            </button>

            {/* Voice Persona Selector */}
            {engineInfo.availableVoices && engineInfo.availableVoices.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Voice:</span>
                <select
                  value={engineInfo.voice || 'astra'}
                  onChange={(e) => setVoice(e.target.value)}
                  className="bg-transparent text-xs font-mono text-zinc-200 focus:outline-none cursor-pointer pr-1"
                >
                  {engineInfo.availableVoices.map((v) => (
                    <option key={v.id} value={v.id} className="bg-zinc-900 text-zinc-200">
                      {v.name} ({v.style})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <VoiceBadge info={engineInfo} compact />
          </div>
        </div>

        {/* Sanctuary Knowledge & Amenities Quick Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-semibold text-white">Sanctuary Locations & Amenities</span>
              <span className="text-zinc-500 hidden sm:inline">• SF Financial District & Sausalito Waterfront</span>
            </div>
            <button
              onClick={() => setShowSanctuaryDetails((prev) => !prev)}
              className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showSanctuaryDetails ? 'Hide Details' : 'View Amenities & Locations'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSanctuaryDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showSanctuaryDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs text-zinc-300 font-sans"
            >
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="font-mono text-[11px] uppercase text-zinc-400 font-semibold mb-1">
                  1. San Francisco Flagship
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  550 Montgomery St (Financial District). Complimentary valet parking at our grand porte-cochère. Private elevator to Level 4.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="font-mono text-[11px] uppercase text-zinc-400 font-semibold mb-1">
                  2. Sausalito Retreat
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  1200 Bridgeway (Waterfront). Panoramic San Francisco Bay views, sea-breeze sun deck, and dedicated guest parking.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="font-mono text-[11px] uppercase text-zinc-400 font-semibold mb-1">
                  3. Complimentary Amenities
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  Eucalyptus steam room, cedar dry sauna, mineral cold plunge pool, organic herbal tea lounge, couples treatment suites, plush robes & slippers.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main 2-Column Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): ARIA Core Orb & Voice Controls */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Orb Stage */}
            <div className="w-full p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[420px]">
              {/* Status Header inside Stage */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      voiceState === 'INTERRUPTED'
                        ? 'bg-rose-500 animate-ping'
                        : voiceState === 'RECOVERING'
                        ? 'bg-white animate-pulse'
                        : voiceState === 'SPEAKING'
                        ? 'bg-white animate-pulse'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="font-mono text-xs text-zinc-300 font-semibold tracking-wider uppercase">
                    STATE: {voiceState}
                  </span>
                </div>

                <span className="font-mono text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  TURN #{bookingState.currentTurnId}
                </span>
              </div>

              {/* Central Luminous Orb */}
              <div className="my-6">
                <AriaOrb state={voiceState} size="hero" />
              </div>

              {/* Audio Waveform */}
              <div className="w-full max-w-md">
                <Waveform state={voiceState} barCount={32} />
              </div>

              {/* Live Speech Interim Recognition Transcript */}
              {liveTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 py-2 rounded-full bg-zinc-900 border border-white/15 text-white text-xs font-mono max-w-md text-center truncate"
                >
                  "{liveTranscript}"
                </motion.div>
              )}

              {/* Live Audio Activity & State Indicators */}
              {isMicActive && (
                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Microphone Live • Speak naturally, click Finish when done</span>
                </div>
              )}

              {isTranscribing && (
                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Transcribing speech audio with neural engine...</span>
                </div>
              )}

              {/* Main Interaction Controls */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 w-full">
                {/* Microphone Toggle */}
                {isMicActive ? (
                  <button
                    id="exp-stop-mic-btn"
                    onClick={stopListening}
                    className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer animate-pulse hover:scale-105"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>FINISH SPEAKING</span>
                  </button>
                ) : (
                  <button
                    id="exp-start-mic-btn"
                    onClick={startListening}
                    className="px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-md cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-black animate-pulse" />
                    <span>START SPEAKING</span>
                  </button>
                )}

                {/* Instant Test Voice Button */}
                <button
                  id="exp-test-voice-btn"
                  onClick={() => {
                    clearMicError();
                    processUserSpeech('Can I schedule a Swedish massage tomorrow morning at 10:30 AM?');
                  }}
                  className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  title="Test ARIA conversation and voice response directly"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>TEST VOICE</span>
                </button>

                {/* Barge-In / Interrupt Trigger Button */}
                <button
                  id="exp-interrupt-btn"
                  onClick={() => {
                    clearMicError();
                    triggerInterruption('Wait, actually make that 6:30 PM instead.');
                  }}
                  className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  title="Force an interruption event during speech"
                >
                  <Square className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>INTERRUPT</span>
                </button>

                {/* Session Reset */}
                <button
                  id="exp-reset-btn"
                  onClick={resetConversation}
                  className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Microphone Error / Iframe Notice Card */}
              {micError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full max-w-xl p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 text-zinc-200 text-xs flex flex-col gap-3 text-left shadow-lg"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-300 text-xs font-mono uppercase tracking-wider">
                        Browser Restricted Microphone in Preview Frame
                      </p>
                      <p className="mt-1 text-zinc-300 text-xs leading-relaxed">
                        For security, web browsers prevent embedded iframes from capturing your microphone hardware directly. To use your physical microphone, open the app in a full browser tab where permission prompts are enabled, or test ARIA right here using the prompts below.
                      </p>
                    </div>
                    <button
                      onClick={clearMicError}
                      className="text-zinc-400 hover:text-white text-base leading-none p-1 cursor-pointer"
                      title="Dismiss notice"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                    <a
                      href="/experience"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open in Full Browser Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => {
                        clearMicError();
                        processUserSpeech('Can I schedule a Swedish massage tomorrow morning at 10:30 AM?');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      Test Spoken Response Now
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Voice Scenarios */}
            <div className="w-full mt-6 p-5 rounded-2xl bg-zinc-950 border border-white/10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-3">
                QUICK SPOKEN PROMPTS (CLICK TO SIMULATE VOICE)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickPrompts.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => {
                      clearMicError();
                      processUserSpeech(q.text);
                    }}
                    className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all group"
                  >
                    <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1 group-hover:text-white">
                      {q.label}
                    </span>
                    <span className="text-xs text-zinc-200 font-medium leading-tight">
                      "{q.text}"
                    </span>
                  </button>
                ))}
              </div>

              {/* Text Input Fallback */}
              <form onSubmit={handleManualSubmit} className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ask ARIA anything... (e.g. 'Schedule Deep Tissue for 2 PM', 'What treatments do you offer?')"
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-mono"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (5 cols): Live State Card & Conversation Transcript */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Live Synchronized Booking Card */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                    RECONCILED BOOKING STATE
                  </span>
                  <h3 className="font-display font-bold text-lg text-white tracking-tight mt-0.5">
                    {bookingState.serviceName || 'Service Pending'}
                  </h3>
                </div>
                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border ${
                    bookingState.status === 'RECOVERING'
                      ? 'bg-zinc-800 text-white border-white/30 animate-pulse'
                      : bookingState.status === 'INTERRUPTED'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                      : 'bg-white/10 text-zinc-200 border-white/20'
                  }`}
                >
                  {bookingState.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-300" />
                    <span>TIME</span>
                  </div>
                  <span className="text-white font-bold text-sm">{bookingState.time}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                    <span>DATE</span>
                  </div>
                  <span className="text-white font-semibold">{bookingState.date}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-300" />
                    <span>THERAPIST</span>
                  </div>
                  <span className="text-white font-semibold truncate block">
                    {bookingState.practitionerName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-300" />
                    <span>PRICE</span>
                  </div>
                  <span className="text-white font-semibold">${bookingState.price} ({bookingState.durationMinutes}m)</span>
                </div>
              </div>

              {bookingState.fencedTurnIds.length > 0 && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[11px] leading-relaxed">
                    <div className="flex items-center justify-between font-semibold font-mono uppercase tracking-wider">
                      <span>Interruption Guard Active</span>
                      <span className="text-zinc-400 text-[10px]">
                        Turn {bookingState.fencedTurnIds.map((id) => `#${id}`).join(', ')} Overridden
                      </span>
                    </div>
                    <p className="text-zinc-400 mt-0.5 text-[11px]">
                      Previous AI response was safely discarded mid-turn so outdated times or cancelled speech never overwrite your updated appointment.
                    </p>
                  </div>
                </div>
              )}

              {/* Confirm Booking Action */}
              <button
                id="exp-lock-booking-btn"
                onClick={handleConfirmBooking}
                className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM & LOCK APPOINTMENT</span>
              </button>

              {bookingConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-zinc-900 border border-white/20 text-zinc-200 text-xs font-mono text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Reservation confirmed! Saved to My Bookings.</span>
                </motion.div>
              )}
            </div>

            {/* Live Conversation Transcript */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 flex-1 flex flex-col min-h-[300px] max-h-[420px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                  TRANSCRIPT & TURN LOG
                </h3>
                <span className="font-mono text-[10px] text-zinc-500">
                  {chatMessages.length} Messages
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border ${
                      msg.role === 'user'
                        ? 'bg-white/5 border-white/10 ml-6 text-zinc-200'
                        : 'bg-zinc-900 border-white/10 mr-6 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span className="uppercase font-semibold text-zinc-400">
                        {msg.role === 'user' ? 'YOU' : 'ARIA'}
                      </span>
                      <span>Turn #{msg.turnId}</span>
                    </div>
                    <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
