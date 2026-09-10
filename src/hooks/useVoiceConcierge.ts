import { useState, useEffect, useRef, useCallback } from 'react';
import {
  VoiceState,
  VoiceEngineInfo,
  TimelineEvent,
  ChatMessage,
  BookingState,
} from '../types';
import { spaAmbience } from '../utils/spaAmbience';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceConcierge() {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [isMicActive, setIsMicActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [engineInfo, setEngineInfo] = useState<VoiceEngineInfo>({
    provider: 'Rime',
    model: 'mistv2',
    voice: 'astra',
    samplingRate: 24000,
    isVerifiedRime: false,
    statusNote: 'Checking voice engine status...',
  });

  const [bookingState, setBookingState] = useState<BookingState>({
    serviceName: 'Full Body Swedish Massage',
    time: 'Flexible / Request Any Time',
    date: '2026-09-12',
    practitionerName: 'Elena Vance, LMT',
    price: 140,
    durationMinutes: 60,
    currentTurnId: 1,
    fencedTurnIds: [],
    status: 'IDLE',
    lastAuthoritativeTurnId: 1,
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: 'Welcome to Serenity Wellness. I am ARIA, your voice concierge. You can request any appointment time from 8 AM to 8 PM, ask about our treatments or therapists, or adjust your schedule on the fly. What can I arrange for you today?',
      turnId: 0,
      timestamp: Date.now(),
    },
  ]);

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Stale-closure prevention refs for conversational state
  const bookingStateRef = useRef<BookingState>(bookingState);
  bookingStateRef.current = bookingState;

  const chatMessagesRef = useRef<ChatMessage[]>(chatMessages);
  chatMessagesRef.current = chatMessages;

  const processUserSpeechRef = useRef<(utterance: string, assignedTurnId?: number, isFromInterrupt?: boolean) => Promise<void>>(null as any);
  const triggerInterruptionRef = useRef<(utterance: string) => void>(null as any);

  // Refs for audio and turn management
  const turnIdRef = useRef<number>(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const startTimeRef = useRef<number>(Date.now());

  // Speech buffering & natural conversational pause debouncing
  const speechDebounceTimerRef = useRef<any>(null);
  const accumulatedSpeechRef = useRef<string>('');
  const [isAmbienceActive, setIsAmbienceActive] = useState<boolean>(false);

  // Hardware microphone & recording refs
  const isMicActiveRef = useRef<boolean>(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [micError, setMicError] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Log timeline event
  const logEvent = useCallback((type: any, title: string, description: string, turnId?: number, fenced = false) => {
    const evt: TimelineEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      timeOffsetMs: Date.now() - startTimeRef.current,
      turnId: turnId ?? turnIdRef.current,
      type,
      title,
      description,
      fenced,
    };
    setTimelineEvents((prev) => [...prev.slice(-40), evt]);
  }, []);

  // Fetch Voice Engine Status from server
  useEffect(() => {
    fetch('/api/voice/engine-status')
      .then((res) => res.json())
      .then((data) => {
        setEngineInfo({
          provider: data.provider || 'LOCAL FALLBACK SPEECH',
          model: data.model || 'mistv2',
          voice: data.voice || 'astra',
          samplingRate: data.samplingRate || 24000,
          isVerifiedRime: Boolean(data.isVerifiedRime),
          availableVoices: data.availableVoices || [],
          statusNote: data.statusNote,
        });
      })
      .catch((err) => {
        console.warn('Could not read voice status:', err);
      });
  }, []);

  // Stop active audio immediately (Audio Cutoff)
  const stopAudio = useCallback(() => {
    const t0 = Date.now();
    isSpeakingRef.current = false;
    spaAmbience.duck(false);

    // Instant gain cutoff to eliminate pops
    if (activeGainRef.current && audioCtxRef.current) {
      try {
        activeGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      } catch (e) {
        // audio context might be closed
      }
    }

    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch (e) {
        // already stopped
      }
      activeSourceRef.current = null;
    }

    // Stop browser synthesis if fallback was running
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const latency = Date.now() - t0;
    return latency;
  }, []);

  // Play audio buffer or fallback speech
  const playSpeech = useCallback(async (text: string, turnId: number) => {
    if (turnId !== turnIdRef.current) {
      logEvent('STALE_RESULT_DISCARDED', 'Stale Speech Suppressed', `Prevented audio playback for superseded Turn ${turnId}.`, turnId, true);
      return;
    }

    setVoiceState('SPEAKING');
    isSpeakingRef.current = true;
    spaAmbience.duck(true);
    logEvent('RIME_SPEAKING', 'Spoken Output Initiated', `Rendering: "${text.slice(0, 60)}..."`, turnId);

    try {
      // Lazy init AudioContext
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: engineInfo.voice || 'astra',
          modelId: engineInfo.model || 'mistv2',
        }),
      });

      // Check if turn was invalidated while waiting for TTS response!
      if (turnId !== turnIdRef.current) {
        spaAmbience.duck(false);
        logEvent('STALE_RESULT_DISCARDED', 'TTS Audio Discarded', `Turn ${turnId} invalidated while TTS audio was generating. Fenced.`, turnId, true);
        return;
      }

      const contentType = res.headers.get('Content-Type') || '';
      const voiceEngineHeader = res.headers.get('X-Voice-Engine') || '';

      if (contentType.includes('audio/mpeg') || contentType.includes('audio/wav')) {
        const arrayBuffer = await res.arrayBuffer();
        if (turnId !== turnIdRef.current) {
          spaAmbience.duck(false);
          return;
        }

        const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        if (turnId !== turnIdRef.current) {
          spaAmbience.duck(false);
          return;
        }

        stopAudio();
        const source = audioCtxRef.current.createBufferSource();
        const gainNode = audioCtxRef.current.createGain();
        source.buffer = audioBuffer;

        gainNode.gain.setValueAtTime(1, audioCtxRef.current.currentTime);
        source.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        activeSourceRef.current = source;
        activeGainRef.current = gainNode;
        isSpeakingRef.current = true;
        spaAmbience.duck(true);

        source.onended = () => {
          spaAmbience.duck(false);
          if (turnId === turnIdRef.current) {
            setVoiceState(isMicActive ? 'LISTENING' : 'IDLE');
            isSpeakingRef.current = false;
          }
        };

        source.start();
        return;
      }

      // If server instructed fallback speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          spaAmbience.duck(false);
          if (turnId === turnIdRef.current) {
            setVoiceState(isMicActive ? 'LISTENING' : 'IDLE');
            isSpeakingRef.current = false;
          }
        };
        window.speechSynthesis.speak(utterance);
      } else {
        spaAmbience.duck(false);
        setVoiceState('IDLE');
      }
    } catch (err) {
      spaAmbience.duck(false);
      console.warn('TTS playback error, using fallback utterance:', err);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
      setVoiceState(isMicActive ? 'LISTENING' : 'IDLE');
    }
  }, [engineInfo, isMicActive, logEvent, stopAudio]);

  // Barge-in / Interruption Handler
  const triggerInterruption = useCallback((newUtterance?: string) => {
    if (speechDebounceTimerRef.current) {
      clearTimeout(speechDebounceTimerRef.current);
      speechDebounceTimerRef.current = null;
    }
    accumulatedSpeechRef.current = '';

    const prevTurnId = turnIdRef.current;
    const nextTurnId = prevTurnId + 1;
    turnIdRef.current = nextTurnId;

    const cutoffLatency = stopAudio();

    logEvent('BARGE_IN_DETECTED', 'User Interruption Detected', `Barge-in triggered. Superseding Turn ${prevTurnId} with Turn ${nextTurnId}.`, nextTurnId);
    logEvent('PLAYBACK_STOPPED', 'Audio Cutoff Executed', `Audio buffer severed in ${cutoffLatency}ms. Acoustic pop dampening active.`, prevTurnId);
    logEvent('TURN_INVALIDATED', 'Monotonic Turn Invalidation', `Turn ${prevTurnId} invalidated. Any delayed tool output will be discarded.`, prevTurnId);

    setVoiceState('INTERRUPTED');
    setBookingState((prev) => ({
      ...prev,
      currentTurnId: nextTurnId,
      fencedTurnIds: [...prev.fencedTurnIds, prevTurnId],
      status: 'INTERRUPTED',
    }));

    // Notify backend
    fetch('/api/voice/interrupt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        turnId: prevTurnId,
      }),
    }).catch((e) => console.warn('Backend interrupt notify error:', e));

    // If a new utterance was provided immediately, process it
    if (newUtterance) {
      setTimeout(() => {
        processUserSpeechRef.current?.(newUtterance, nextTurnId, true);
      }, 150);
    } else {
      setTimeout(() => {
        setVoiceState('LISTENING');
      }, 400);
    }
  }, [logEvent, stopAudio]);

  // Keep triggerInterruptionRef updated
  triggerInterruptionRef.current = triggerInterruption;

  // Process user speech turn
  const processUserSpeech = useCallback(async (utterance: string, assignedTurnId?: number, isFromInterrupt = false) => {
    if (!utterance.trim()) return;

    // Determine turn ID
    let currentTurn = assignedTurnId;
    if (!currentTurn) {
      // Check if user is interrupting an active speech (only when audio is actively playing)
      if (isSpeakingRef.current || voiceState === 'SPEAKING') {
        triggerInterruptionRef.current?.(utterance);
        return;
      }
      currentTurn = turnIdRef.current;
    }

    setVoiceState('THINKING');
    logEvent(
      isFromInterrupt ? 'NEW_TURN_STARTED' : 'REQUEST_RECEIVED',
      `User Utterance (Turn ${currentTurn})`,
      `"${utterance}"`,
      currentTurn
    );

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: utterance,
        turnId: currentTurn!,
        timestamp: Date.now(),
      },
    ]);

    try {
      logEvent('TOOL_STARTED', 'Checking Availability & Resolving Intent', `Validating slots with Serenity Clinic schedule for Turn ${currentTurn}...`, currentTurn);

      const res = await fetch('/api/voice/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utterance,
          currentTurnId: currentTurn,
          sessionId: sessionIdRef.current,
          existingDraft: bookingStateRef.current,
          history: chatMessagesRef.current.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      // MONOTONIC TURN FENCING VERIFICATION
      if (data.fenced || currentTurn !== turnIdRef.current) {
        logEvent(
          'STALE_RESULT_DISCARDED',
          `Stale Result Fenced (Turn ${currentTurn})`,
          `Discarded response for Turn ${currentTurn}. Authoritative turn is currently Turn ${turnIdRef.current}.`,
          currentTurn,
          true
        );
        return;
      }

      // Authoritative turn matches! Reconcile state
      if (data.isInterruption) {
        setVoiceState('RECOVERING');
        logEvent('STATE_RECONCILED', 'Conversational State Reconciled', `Reconciled intent to ${data.reconciledIntent?.time} for ${data.reconciledIntent?.service}.`, currentTurn);
      }

      const isConfirmed = data.bookingDraft?.status === 'confirmed' || data.status === 'CONFIRMED';
      if (data.bookingDraft) {
        const nextBooking: BookingState = {
          ...bookingStateRef.current,
          serviceName: data.bookingDraft.serviceName || bookingStateRef.current.serviceName,
          time: data.bookingDraft.time || bookingStateRef.current.time,
          date: data.bookingDraft.date || bookingStateRef.current.date,
          practitionerName: data.bookingDraft.practitionerName || bookingStateRef.current.practitionerName,
          price: data.bookingDraft.price ?? bookingStateRef.current.price,
          durationMinutes: data.bookingDraft.durationMinutes ?? bookingStateRef.current.durationMinutes,
          status: isConfirmed ? 'CONFIRMED' : (data.isInterruption ? 'RECOVERING' : 'READY'),
          lastAuthoritativeTurnId: currentTurn!,
        };
        bookingStateRef.current = nextBooking;
        setBookingState(nextBooking);
      }

      // Append assistant message
      if (data.assistantSpeech) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `aria-${Date.now()}`,
            role: 'assistant',
            content: data.assistantSpeech,
            turnId: currentTurn!,
            timestamp: Date.now(),
          },
        ]);

        // Speak the response using Rime
        await playSpeech(data.assistantSpeech, currentTurn!);
      } else {
        setVoiceState(isMicActive ? 'LISTENING' : 'IDLE');
      }
    } catch (err: any) {
      console.error('Processing speech turn error:', err);
      setVoiceState(isMicActive ? 'LISTENING' : 'IDLE');
    }
  }, [isMicActive, logEvent, playSpeech, voiceState]);

  // Keep processUserSpeechRef updated
  processUserSpeechRef.current = processUserSpeech;

  // Start real microphone STT with dual-engine fallback (WebSpeech + MediaRecorder + Gemini)
  const startListening = useCallback(async () => {
    setMicError(null);

    // Warm up AudioContext on user gesture
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext warmup:', e);
    }

    // Check mediaDevices support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Audio recording is not supported in this browser window. Please use the spoken prompt buttons below or the text bar.');
      return;
    }

    try {
      // 1. Request hardware microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      isMicActiveRef.current = true;
      setIsMicActive(true);
      if (voiceState !== 'SPEAKING') {
        setVoiceState('LISTENING');
      }
      logEvent('MIC_OPENED', 'Microphone Engaged', 'Hardware audio stream acquired with echo cancellation.');

      // 2. Attach Analyser for real-time visual level feedback
      try {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          const source = audioCtxRef.current.createMediaStreamSource(stream);
          const analyser = audioCtxRef.current.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.5;
          source.connect(analyser);
          analyserRef.current = analyser;

          const pcmData = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!isMicActiveRef.current) return;
            analyser.getByteFrequencyData(pcmData);
            let sum = 0;
            for (let i = 0; i < pcmData.length; i++) {
              sum += pcmData[i];
            }
            const avg = sum / pcmData.length;
            setAudioVolume(Math.min(1, avg / 80));
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (visErr) {
        console.warn('Microphone visualizer warning:', visErr);
      }

      // 3. Start MediaRecorder as fallback audio capture engine
      try {
        if (typeof MediaRecorder !== 'undefined') {
          let mimeType = '';
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          }

          const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
          audioChunksRef.current = [];

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
              // Maintain a rolling buffer of max ~60 chunks (~18s of speech) to prevent unbounded memory growth & oversized payloads
              if (audioChunksRef.current.length > 70) {
                audioChunksRef.current.splice(0, audioChunksRef.current.length - 60);
              }
            }
          };

          recorder.start(300);
          mediaRecorderRef.current = recorder;
        }
      } catch (recErr) {
        console.warn('MediaRecorder init warning:', recErr);
      }

      // 4. Also activate native Web Speech Recognition if available for real-time streaming text
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
              isMicActiveRef.current = true;
              setIsMicActive(true);
            };

            recognition.onresult = (event: any) => {
              let interim = '';
              let finalTranscript = '';

              for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
                } else {
                  interim += event.results[i][0].transcript;
                }
              }

              const combinedDisplay = (accumulatedSpeechRef.current + ' ' + (interim || finalTranscript)).trim();
              if (combinedDisplay) {
                setLiveTranscript(combinedDisplay);
              }

              // Interruption detection: if ARIA is currently speaking audio
              if ((interim.trim().length > 2 || finalTranscript.trim().length > 2) && isSpeakingRef.current) {
                if (speechDebounceTimerRef.current) {
                  clearTimeout(speechDebounceTimerRef.current);
                  speechDebounceTimerRef.current = null;
                }
                const interruptSpeech = (accumulatedSpeechRef.current + ' ' + (finalTranscript || interim)).trim();
                accumulatedSpeechRef.current = '';
                setLiveTranscript('');
                triggerInterruptionRef.current?.(interruptSpeech);
                return;
              }

              // Natural Human Sentence Debounce:
              // WebSpeech frequently fires isFinal for single words or incomplete phrases (e.g. "is it").
              // Accumulate and wait for a 750ms natural conversational pause before dispatching.
              if (finalTranscript.trim().length > 0) {
                accumulatedSpeechRef.current = (accumulatedSpeechRef.current + ' ' + finalTranscript.trim()).trim();

                if (speechDebounceTimerRef.current) {
                  clearTimeout(speechDebounceTimerRef.current);
                }

                speechDebounceTimerRef.current = setTimeout(() => {
                  const fullUtterance = accumulatedSpeechRef.current.trim();
                  if (fullUtterance.length > 0) {
                    accumulatedSpeechRef.current = '';
                    setLiveTranscript('');
                    processUserSpeechRef.current?.(fullUtterance);
                  }
                }, 750);
              }
            };

            recognition.onerror = (e: any) => {
              console.warn('SpeechRecognition event notice:', e.error);
              // Do not abort session on minor error; MediaRecorder will transcribe
            };

            recognition.onend = () => {
              if (isMicActiveRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  // already active
                }
              }
            };

            recognitionRef.current = recognition;
          }

          try {
            recognitionRef.current.start();
          } catch (e) {
            // ignore if already started
          }
        } catch (speechErr) {
          console.warn('Native speech recognition notice:', speechErr);
        }
      }

    } catch (err: any) {
      console.warn('Microphone stream error:', err);
      isMicActiveRef.current = false;
      setIsMicActive(false);
      setVoiceState('IDLE');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was blocked by browser security or iframe sandbox. You can open in a new tab for direct browser speech access, or tap any prompt below to simulate speech.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicError('No microphone hardware was detected on your device. You can test ARIA using the prompt buttons below.');
      } else {
        setMicError('Microphone access was restricted. Click any quick prompt below or type your message to test ARIA.');
      }
    }
  }, [logEvent, processUserSpeech, triggerInterruption, voiceState]);

  const stopListening = useCallback(async () => {
    isMicActiveRef.current = false;
    setIsMicActive(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioVolume(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    // Process recorded audio via server transcription if speech recognition did not already fire
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        setIsTranscribing(true);

        // Allow final audio chunk to flush
        await new Promise((resolve) => setTimeout(resolve, 250));

        if (audioChunksRef.current.length > 0 && voiceState === 'LISTENING') {
          const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          if (audioBlob.size > 1200) {
            setVoiceState('THINKING');
            setLiveTranscript('Transcribing speech...');

            const reader = new FileReader();
            reader.onloadend = async () => {
              try {
                const base64Audio = reader.result as string;
                const resp = await fetch('/api/voice/transcribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    audioBase64: base64Audio,
                    mimeType,
                  }),
                });

                if (!resp.ok) {
                  console.warn('Transcription request failed with status:', resp.status);
                  setIsTranscribing(false);
                  setLiveTranscript('');
                  setVoiceState('IDLE');
                  return;
                }

                const data = await resp.json();
                setIsTranscribing(false);
                setLiveTranscript('');
                if (data.transcript && data.transcript.trim().length > 0) {
                  processUserSpeechRef.current?.(data.transcript.trim());
                  return;
                }
              } catch (transcribeErr) {
                console.warn('Transcription error:', transcribeErr);
              }
              setIsTranscribing(false);
              setLiveTranscript('');
              setVoiceState('IDLE');
            };
            reader.readAsDataURL(audioBlob);
          } else {
            setIsTranscribing(false);
            setVoiceState('IDLE');
          }
        } else {
          setIsTranscribing(false);
          if (voiceState === 'LISTENING') setVoiceState('IDLE');
        }
      } catch (recStopErr) {
        console.warn('Error stopping recorder:', recStopErr);
        setIsTranscribing(false);
        if (voiceState === 'LISTENING') setVoiceState('IDLE');
      }
    } else {
      if (voiceState === 'LISTENING') setVoiceState('IDLE');
    }

    // Flush any pending debounced speech immediately upon user manual stop
    if (speechDebounceTimerRef.current) {
      clearTimeout(speechDebounceTimerRef.current);
      speechDebounceTimerRef.current = null;
    }
    if (accumulatedSpeechRef.current.trim().length > 0) {
      const pending = accumulatedSpeechRef.current.trim();
      accumulatedSpeechRef.current = '';
      setLiveTranscript('');
      processUserSpeechRef.current?.(pending);
    }

    // Release microphone hardware tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, [processUserSpeech, voiceState]);

  const clearMicError = useCallback(() => {
    setMicError(null);
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    setEngineInfo((prev) => ({
      ...prev,
      voice: voiceId,
    }));
  }, []);

  const toggleAmbience = useCallback(() => {
    const nextRunning = spaAmbience.toggle();
    setIsAmbienceActive(nextRunning);
  }, []);

  const resetConversation = useCallback(() => {
    stopAudio();
    stopListening();
    turnIdRef.current = 1;
    sessionIdRef.current = `session-${Date.now()}`;
    setVoiceState('IDLE');
    setLiveTranscript('');
    setMicError(null);
    setBookingState({
      serviceName: 'Full Body Swedish Massage',
      time: 'Flexible / Request Any Time',
      date: '2026-09-12',
      practitionerName: 'Elena Vance, LMT',
      price: 140,
      durationMinutes: 60,
      currentTurnId: 1,
      fencedTurnIds: [],
      status: 'IDLE',
      lastAuthoritativeTurnId: 1,
    });
    setChatMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: 'Session reset. I am ARIA, ready to assist with your appointments and schedule adjustments.',
        turnId: 0,
        timestamp: Date.now(),
      },
    ]);
    setTimelineEvents([]);
    logEvent('NEW_TURN_STARTED', 'Conversation Reset', 'Session reset to Turn 1. Cleared fenced queues.');
  }, [logEvent, stopAudio, stopListening]);

  return {
    voiceState,
    isMicActive,
    liveTranscript,
    engineInfo,
    bookingState,
    chatMessages,
    timelineEvents,
    currentTurnId: turnIdRef.current,
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
  };
}
