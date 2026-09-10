import { Heart, Sparkles, ShieldCheck, Radio, Mic, Feather } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#08080b]">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 mb-3">
            <Feather className="w-3.5 h-3.5 text-zinc-400" />
            <span>DESIGN PHILOSOPHY & MANIFESTO</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            The Grace to Stop.
          </h1>
          <p className="text-zinc-400 text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Why the true measure of a conversational intelligence is not how fluently it speaks, but how gracefully it yields.
          </p>
        </div>

        {/* Story Section 1: The Human Reflex */}
        <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4 tracking-tight">
            1. The Nature of Spoken Thought
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light mb-4">
            In written interfaces, people formulate an entire thought before clicking "Submit." In voice, thinking and speaking happen simultaneously. A person asks for a 3:00 PM massage, and midway through hearing the confirmation, realizes their calendar has a flight at 4:30 PM.
          </p>
          <p className="text-zinc-400 leading-relaxed font-light">
            In human conversation, saying "Wait, actually..." causes the listener to immediately halt speech, erase the pending expectation, and seamlessly pivot to the new reality. Most voice AI fails here: it talks over the speaker, crashes into race conditions, or worse—submits the obsolete booking anyway.
          </p>
        </section>

        {/* Story Section 2: Why Serenity Wellness? */}
        <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4 tracking-tight">
            2. High-End Hospitality Demands Restraint
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light mb-4">
            Serenity Wellness is a luxury restorative clinic where guests seek tranquility, neuromuscular relief, and bespoke treatment. A voice concierge representing such a sanctuary cannot sound like an aggressive IVR telephone tree or an unyielding bot that insists on finishing its scripted paragraph.
          </p>
          <p className="text-zinc-400 leading-relaxed font-light">
            ARIA was designed as a digital counterpart to the world’s finest hotel concierges: attentive, softly spoken, acoustically precise, and possessing the instinctive intuition to pause the second you open your mouth.
          </p>
        </section>

        {/* Story Section 3: Engineering as Empathy */}
        <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4 tracking-tight">
            3. Engineering as Empathy
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light mb-6">
            We chose to solve the hardest problem in conversational voice: full-duplex interruption recovery with monotonic turn fencing. By discarding stale asynchronous results at the memory barrier, ARIA guarantees that what you hear is always what is reserved.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <Radio className="w-4 h-4 text-zinc-300 mb-2" />
              <span className="text-white font-bold block mb-1">Rime Neural Voice</span>
              <p className="text-zinc-400 font-normal">mistv2 architecture tuned for intimate acoustic warmth.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-zinc-300 mb-2" />
              <span className="text-white font-bold block mb-1">Monotonic Fencing</span>
              <p className="text-zinc-400 font-normal">Mathematical guarantee against obsolete slot overwrites.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <Sparkles className="w-4 h-4 text-zinc-300 mb-2" />
              <span className="text-white font-bold block mb-1">Zero Amnesia</span>
              <p className="text-zinc-400 font-normal">Corrections preserve already negotiated services.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
