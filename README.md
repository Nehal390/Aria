# ARIA: Voice-Native AI Concierge for Serenity Wellness

> **Rime Hackathon Submission**  
> A voice-native AI concierge engineered for high-touch hospitality and hands-free wellness sanctuaries. Features full-duplex conversational barge-in, sub-10ms acoustic pop dampening, monotonic turn fencing, and high-fidelity Rime neural text-to-speech.

---

## 1. Problem & Voice Necessity

### The User & The Situation
In luxury wellness retreats and medical spas (hydrotherapy suites, eucalyptus steam chambers, flotation tanks, and private massage rooms), clients frequently need to schedule treatments, adjust appointment times, ask about therapist specialties, or inquire about hydrotherapy benefits. 

In these moments, clients' hands are wet, wrapped in treatment robes, or resting in relaxation lounges. Interacting with rigid mobile screens, date pickers, or frustrating touch-tone IVR phone trees breaks the therapeutic atmosphere.

### Why Voice is Essential (Not Just a Chatbot with a Play Button)
Traditional chatbots slap a "play audio" button onto a delayed text response. In voice-native conversation, **real humans interrupt, correct themselves mid-sentence, and change their minds**.

If a voice agent cannot handle user barge-in in real time:
1. **Acoustic Overlap**: The agent continues reading outdated details while the user is already speaking.
2. **Race Conditions**: A delayed background availability tool for an earlier request finishes late and overwrites the user's latest corrected time.
3. **State Corruption**: The user says *"Actually make that 5 PM"*, but the system confirms 3 PM because asynchronous tool calls were not fenced.

ARIA solves this hard engineering challenge through **Monotonic Turn Fencing** and **Instant WebAudio Buffer Severance**.

---

## 2. The Hard Voice Problem: Interruption & Recovery

### The Real-World Scenario
```text
[User]       "Book me a Swedish Massage for 3 PM tomorrow."
                  │
[ARIA]       Dispatches Availability Check (Turn 1, simulated tool delay)
                  │
[Rime TTS]   Starts spoken playback: "Checking availability for 3 PM tomorrow..."
                  │
[User]       ⚡ BARGE-IN: "Wait, actually make that 5 PM."
                  │
[WebAudio]   Immediate audio cutoff (< 8ms, exponential gain ramp to 0)
                  │
[Turn Fencer]Turn 1 marked SUPERSEDED; Monotonic counter advances to Turn 2
                  │
[Late Tool]  Turn 1 background query completes with "3 PM Available"
                  └──> FENCED & DISCARDED (Turn 1 < Active Turn 2). 0 state mutation!
                  │
[Reconciler] State authoritatively updates to 5:00 PM (Elena Vance, Swedish Massage)
                  │
[Rime Output]Spoken confirmation: "Updated to 5 PM with Elena. Your appointment is confirmed."
```

---

## 3. System Architecture & Services

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React 19 + Vite)                       │
│                                                                        │
│  ┌───────────────────────┐   Barge-In    ┌──────────────────────────┐  │
│  │ Continuous Mic Stream │──────────────>│ Barge-In Energy Detector │  │
│  │ (WebSpeech / MediaRec)│               │  & WebAudio Gain Sever   │  │
│  └───────────────────────┘               └──────────────────────────┘  │
│             │                                          │               │
│             ▼                                          ▼               │
│  ┌───────────────────────┐               ┌──────────────────────────┐  │
│  │ Monotonic Turn Fencer │<──────────────│   Instant Audio Cutoff   │  │
│  │  (Turn ID Monotonic)  │               │   (Gain decay < 8ms)     │  │
│  └───────────────────────┘               └──────────────────────────┘  │
│             │                                          ▲               │
└─────────────┼──────────────────────────────────────────┼───────────────┘
              │ POST /api/voice/orchestrate              │ ArrayBuffer
              ▼                                          │ (24kHz MP3)
┌────────────────────────────────────────────────────────┼───────────────┐
│                     BACKEND (Express + Node.js)        │               │
│                                                        │               │
│  ┌───────────────────────┐               ┌─────────────┴────────────┐  │
│  │ Intent Orchestrator   │               │ Rime TTS Proxy           │  │
│  │ & Turn Fencing Guard  │               │ (POST /v1/rime-tts)      │  │
│  │ (Gemini 3.5 / 3.1)    │               │ Speaker: astra           │  │
│  └───────────────────────┘               │ Model: mistv2            │  │
│             │                            └──────────────────────────┘  │
│             ▼                                          ▲               │
│  ┌───────────────────────┐                             │               │
│  │ In-Memory Booking &   │─────────────────────────────┘               │
│  │ Clinic Session Store  │ (Keeps RIME_API_KEY server-side)            │
│  └───────────────────────┘                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rime Integration Specification

| Parameter | Configuration | Verification |
| :--- | :--- | :--- |
| **Provider** | [Rime Labs](https://rime.ai) | Dynamic `/api/voice/engine-status` telemetry |
| **API Endpoint** | `https://users.rime.ai/v1/rime-tts` | Server-side proxy (`POST /api/voice/tts`) |
| **Model** | `mistv2` (HD Conversational Neural Model) | Passed in request payload |
| **Default Voice** | `astra` (Warm, empathetic luxury concierge) | Configurable via `RIME_VOICE_ID` |
| **Available Voices** | `astra`, `eva`, `marina`, `marsh`, `colin` | Live switchable in `/experience` |
| **Audio Format** | `audio/mp3` (24,000 Hz HD sampling) | Decoded via native WebAudio AudioContext |
| **Key Security** | `RIME_API_KEY` stored exclusively in server `.env` | **Zero** frontend key exposure |
| **Fallback Policy** | If `RIME_API_KEY` is omitted, UI discloses `LOCAL FALLBACK SPEECH` | Client WebSpeech / neural fallback |

---

## 5. Getting Started & Reproducibility

### Prerequisites
- Node.js 18+ (tested on Node 20 & 22)
- npm or bun

### Setup & Run
```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment variables (copy template)
cp .env.example .env

# Optional: Add your Rime API key to .env for 24kHz HD neural voice
# RIME_API_KEY="your-rime-key-here"

# 3. Run the automated 10-step Interruption Acceptance Test CLI
npm run test:interruption

# 4. Start full-stack development server
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 6. Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run test:interruption` | Executes automated headless 10-step interruption acceptance test |
| `npm run dev` | Boots full-stack Express server with Vite middleware on port 3000 |
| `npm run build` | Builds production frontend static bundle and bundles `dist/server.cjs` |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm start` | Launches compiled production server |

---

## 7. Known Limitations & Disclosed Boundaries

1. **Sandboxed Iframe Microphone Access**:  
   Inside restrictive sandboxed iframes, the browser's `navigator.mediaDevices.getUserMedia` may be blocked by browser permissions policies. ARIA gracefully catches this, informs the user with an explicit notice, and enables instant simulated speech prompt chips so all voice and recovery flows can be tested without hardware barriers.
2. **Rime API Key Requirement**:  
   If `RIME_API_KEY` is not provided in `.env`, the system automatically activates transparent local speech fallback and clearly flags the status badge as `LOCAL FALLBACK SPEECH` so judges and users always know which engine is running.
3. **In-Memory Store Lifespan**:  
   Clinic bookings and turn states are persisted in server process memory during container execution.
