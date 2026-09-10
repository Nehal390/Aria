/**
 * ARIA Voice-Native AI Concierge
 * Global Domain Types
 */

export type VoiceState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'RECOVERING';

export interface VoiceEngineInfo {
  provider: 'Rime' | 'LOCAL FALLBACK SPEECH';
  model: string;
  voice: string;
  samplingRate: number;
  isVerifiedRime: boolean;
  statusNote?: string;
  availableVoices?: { id: string; name: string; style: string; gender: string }[];
}

export type TimelineEventType =
  | 'REQUEST_RECEIVED'
  | 'TOOL_STARTED'
  | 'RIME_SPEAKING'
  | 'BARGE_IN_DETECTED'
  | 'PLAYBACK_STOPPED'
  | 'TURN_INVALIDATED'
  | 'STALE_RESULT_RECEIVED'
  | 'STALE_RESULT_DISCARDED'
  | 'NEW_TURN_STARTED'
  | 'STATE_RECONCILED'
  | 'BOOKING_CONFIRMED'
  | 'RIME_RESPONSE';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  timeOffsetMs: number;
  turnId: number;
  type: TimelineEventType;
  title: string;
  description: string;
  fenced?: boolean;
  meta?: Record<string, unknown>;
}

export interface ConversationTurn {
  turnId: number;
  userUtterance: string;
  assistantSpeech?: string;
  serviceIntent?: string;
  timeIntent?: string;
  dateIntent?: string;
  status: 'active' | 'invalidated' | 'completed';
  invalidatedAt?: number;
  interruptedByTurnId?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  turnId: number;
  timestamp: number;
  interrupted?: boolean;
  fenced?: boolean;
  audioDurationMs?: number;
}

export interface ClinicService {
  id: string;
  title: string;
  name?: string;
  category: string;
  tagline: string;
  description: string;
  durations: { minutes: number; price: number }[];
  durationMinutes?: number;
  price?: number;
  popular?: boolean;
  recommendedTimeOfDay?: string;
}

export interface Practitioner {
  id: string;
  name: string;
  role: string;
  title?: string;
  specialties: string[];
  bio: string;
}

export interface BookingRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  date: string;
  time: string;
  practitionerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string;
  turnId?: number;
  recoveryNote?: string;
}

export interface BookingState {
  serviceId?: string;
  serviceName?: string;
  time?: string;
  date?: string;
  practitionerName?: string;
  durationMinutes?: number;
  price?: number;
  currentTurnId: number;
  fencedTurnIds: number[];
  status: 'IDLE' | 'CHECKING_AVAILABILITY' | 'INTERRUPTED' | 'RECOVERING' | 'CONFIRMED';
  lastAuthoritativeTurnId: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface InterruptionStressTestResult {
  runId: string;
  executedAt: string;
  toolDelayMs: number;
  audioCutoffLatencyMs: number;
  staleResultsReceived: number;
  staleResultsFenced: number;
  staleLeaksDetected: number;
  initialTurnId: number;
  interruptedTurnId: number;
  finalAuthoritativeTime: string;
  stateConsistencyPass: boolean;
  allEvents: TimelineEvent[];
}
