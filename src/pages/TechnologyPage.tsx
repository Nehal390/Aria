import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Radio,
  VolumeX,
  ShieldCheck,
  Zap,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Code,
  Layers,
} from 'lucide-react';

export function TechnologyPage() {
  const [activeCodeTab, setActiveCodeTab] = useState<'cutoff' | 'fencing' | 'reconciliation'>('fencing');

  const snippets = {
    fencing: `// Monotonic Turn Fencing: Discards late-arriving asynchronous tool results
async function handleToolResult(turnId: number, toolResult: AppointmentSlot) {
  // Turn Fencing Check: Strict monotonic barrier
  if (turnId !== currentTurnIdRef.current) {
    console.warn(\`[FENCE ACTIVE] Turn \${turnId} !== CurrentTurn \${currentTurnIdRef.current}. Discarding stale tool output.\`);
    logTimelineEvent({
      type: 'STALE_RESULT_DISCARDED',
      turnId,
      fenced: true,
      description: \`Stale \${toolResult.time} availability response silenced.\`
    });
    return; // Stop execution: prevent state mutation and audio synthesis
  }

  // Authoritative turn: safe to update state
  setBookingDraft(toolResult);
  await synthesizeSpeech(toolResult.confirmationText, turnId);
}`,
    cutoff: `// WebAudio Cutoff Engine: Immediate buffer severance without acoustic pops
function stopAudioImmediate(): number {
  const t0 = performance.now();
  
  // 1. Exponential gain ramp to zero in 8ms (prevents speaker pop/click)
  if (gainNodeRef.current && audioCtxRef.current) {
    gainNodeRef.current.gain.setValueAtTime(
      gainNodeRef.current.gain.value,
      audioCtxRef.current.currentTime
    );
    gainNodeRef.current.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtxRef.current.currentTime + 0.008
    );
  }

  // 2. Disconnect and stop buffer source
  if (activeSourceRef.current) {
    activeSourceRef.current.stop();
    activeSourceRef.current.disconnect();
    activeSourceRef.current = null;
  }

  return Math.round(performance.now() - t0); // Measured cutoff latency (<5ms)
}`,
    reconciliation: `// Conversational State Reconciliation: Pivot intent without wiping partial draft
function reconcileDraft(previousDraft: BookingState, userCorrection: ParsedIntent): BookingState {
  return {
    ...previousDraft,
    // Preserve service and practitioner unless explicitly overridden
    serviceName: userCorrection.serviceName || previousDraft.serviceName,
    practitionerName: userCorrection.practitionerName || previousDraft.practitionerName,
    // Apply corrected slot
    time: userCorrection.time || previousDraft.time,
    date: userCorrection.date || previousDraft.date,
    status: 'RECOVERING',
    lastAuthoritativeTurnId: userCorrection.turnId,
  };
}`,
  };

  const failureModes = [
    {
      title: 'Acoustic Overlap & Audio Collisions',
      hazard: 'The assistant keeps reading the 3:00 PM availability while the user is already talking about 5:00 PM.',
      mitigation: 'Barge-in detection drops the audio output gain to zero within 8 milliseconds and flushes the buffer queue.',
    },
    {
      title: 'Stale State Mutation (Race Condition)',
      hazard: 'The background availability tool for 3:00 PM finishes 800ms after the user switched to 5:00 PM, accidentally overwriting the 5:00 PM draft.',
      mitigation: 'Monotonic Turn Fencing: All asynchronous tool promises carry the originating turnId and are discarded if turnId < activeTurnId.',
    },
    {
      title: 'Acoustic Speaker Popping / Clicking',
      hazard: 'Hard-stopping an active audio buffer produces high-frequency speaker clicks due to sudden DC offset voltage changes.',
      mitigation: 'WebAudio gain ramping with an 8ms exponential decay curve prevents sudden DC voltage shifts while halting sound imperceptibly.',
    },
    {
      title: 'Context Amnesia on Pivot',
      hazard: 'When the user says "actually make that 5 PM", naive LLM architectures wipe out the selected service and practitioner.',
      mitigation: 'Differential state reconciliation preserves the validated appointment parameters and only replaces the interrupted property.',
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
            SYSTEM ARCHITECTURE & SPECIFICATION
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            The Interruption Engine.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg font-normal leading-relaxed">
            A real-time voice pipeline engineered around monotonic turn identifiers, asynchronous fencing, and zero-leak state reconciliation.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 1. ARCHITECTURE DIAGRAM */}
        {/* ============================================================ */}
        <section className="mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-zinc-300" />
                <h3 className="font-mono text-sm tracking-wider uppercase text-white font-semibold">
                  FULL-DUPLEX CONVERSATIONAL ARCHITECTURE
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-400">
                End-to-End Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Box 1: Input */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">STAGE 1</span>
                  <h4 className="font-display font-bold text-white text-base mb-2">Microphone & STT</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Continuous acoustic stream & VAD. Interim phonemes stream directly into barge-in detector.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-zinc-400">
                  VAD Threshold: 18 dB
                </div>
              </div>

              {/* Box 2: Barge-In Detector */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">STAGE 2</span>
                  <h4 className="font-display font-bold text-white text-base mb-2">Barge-In Detector</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Intercepts user speech during assistant playback. Signals instant Audio Cutoff.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-rose-300">
                  Cutoff: &lt;8ms (AudioNode)
                </div>
              </div>

              {/* Box 3: Turn Fencer */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/20 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-300 uppercase block mb-1">STAGE 3 (CORE)</span>
                  <h4 className="font-display font-bold text-white text-base mb-2">Monotonic Turn Fencer</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Maintains monotonic turnId sequence. Tags every outbound tool query. Filters late arrivals.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-white font-medium">
                  turnId += 1 on barge-in
                </div>
              </div>

              {/* Box 4: Orchestrator & State */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">STAGE 4</span>
                  <h4 className="font-display font-bold text-white text-base mb-2">State Reconciler</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Re-evaluates appointment intent with differential update. Preserves stable slots.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-zinc-300">
                  Zero Context Wipeout
                </div>
              </div>

              {/* Box 5: Rime TTS */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase block mb-1">STAGE 5</span>
                  <h4 className="font-display font-bold text-white text-base mb-2">Rime Neural TTS</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Synthesizes authoritative response via mistv2 (astra) at 24 kHz high-res audio.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-white">
                  Sampling: 24,000 Hz
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. SEQUENCE DIAGRAM: THE RECOVERY FLOW */}
        {/* ============================================================ */}
        <section className="mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <div className="flex items-center gap-3">
                <GitCommit className="w-5 h-5 text-zinc-300" />
                <h3 className="font-mono text-sm tracking-wider uppercase text-white font-semibold">
                  SEQUENCE DIAGRAM: 3 PM → INTERRUPTION → 5 PM RECOVERY
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-400">Deterministic Recovery</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px]">1</span>
                  <span className="text-zinc-200">[USER] "Book me a massage for 3 PM"</span>
                </div>
                <span className="text-zinc-500">t = 0ms • Turn 1</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between ml-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px]">2</span>
                  <span className="text-zinc-200">[SYSTEM] Dispatches Availability Tool(3:00 PM, Turn 1) with 800ms async delay</span>
                </div>
                <span className="text-zinc-500">t = 40ms • Pending</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between ml-8">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px]">3</span>
                  <span className="text-zinc-200">[RIME TTS] Starts audio playback: "Checking availability for 3 PM tomorrow..."</span>
                </div>
                <span className="text-zinc-400">t = 180ms • Audio Playing</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white text-[10px]">4</span>
                  <span className="text-rose-200 font-bold">[BARGE-IN] "Wait, actually make that 5 PM"</span>
                </div>
                <span className="text-rose-400">t = 310ms • User Interruption</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between ml-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">5</span>
                  <span className="text-zinc-200">[AUDIO CUTOFF] WebAudio node halted. Turn 1 marked INVALIDATED. CurrentTurn := 2</span>
                </div>
                <span className="text-zinc-300">t = 315ms • Latency: 5ms</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between ml-8">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-700 flex items-center justify-center text-white text-[10px]">6</span>
                  <span className="line-through text-zinc-400">[LATE TOOL RESULT] 3:00 PM availability completes (Turn 1)</span>
                </div>
                <span className="text-rose-300 font-bold">t = 840ms • DISCARDED BY FENCE</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/20 flex items-center justify-between ml-12">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px]">7</span>
                  <span className="text-white font-medium">[RECONCILIATION] Authoritative 5:00 PM confirmed. Rime speaks confirmation.</span>
                </div>
                <span className="text-zinc-300 font-bold">t = 920ms • 100% CONSISTENT</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. CODE SNIPPETS SHOWCASE */}
        {/* ============================================================ */}
        <section className="mb-20">
          <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-zinc-300" />
                <h3 className="font-mono text-sm tracking-wider uppercase text-white font-semibold">
                  PRODUCTION ALGORITHMIC IMPLEMENTATION
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {(['fencing', 'cutoff', 'reconciliation'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs capitalize transition-colors ${
                      activeCodeTab === tab
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-5 rounded-2xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 font-mono overflow-x-auto leading-relaxed">
              <code>{snippets[activeCodeTab]}</code>
            </pre>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. FAILURE MODES AVOIDED */}
        {/* ============================================================ */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
              ROBUSTNESS & RELIABILITY
            </span>
            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
              Failure Modes Explicitly Engineered Out
            </h2>
            <p className="text-zinc-400 text-sm">
              Standard chatbots fail silently on edge-case audio timing. ARIA models and neutralizes every hazard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {failureModes.map((fm) => (
              <div key={fm.title} className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
                <div className="flex items-center gap-2 text-zinc-300 mb-3">
                  <AlertTriangle className="w-4 h-4 text-zinc-400" />
                  <h4 className="font-display font-bold text-white text-base">{fm.title}</h4>
                </div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">THE HAZARD</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{fm.hazard}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">ARIA ARCHITECTURAL MITIGATION</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{fm.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
