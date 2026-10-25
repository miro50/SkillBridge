import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// TypeScript Domain Types for SkillBridge Supabase Database
// ============================================================================

export type SessionStatus = 'pending' | 'in_progress' | 'submitted' | 'expired';
export type RecommendationBadge = 'consigliato' | 'riserva' | 'non_idoneo';

export interface SessionTelemetry {
  blur_count: number;
  paste_count: number;
  time_spent_seconds: number;
  [key: string]: unknown;
}

export interface CandidateRawAnswers {
  stockoutDay?: number;
  downtimeDays?: number;
  expeditedOrderQty?: number;
  calculatedExtraCost?: number;
  calculatedDowntimeCost?: number;
  decisionMemo?: string;
  [key: string]: unknown;
}

export interface AssessmentSession {
  id: string;
  token: string;
  candidate_name: string;
  candidate_email: string;
  scenario_id: string;
  status: SessionStatus;
  started_at: string | null;
  submitted_at: string | null;
  telemetry: SessionTelemetry;
  raw_answers: CandidateRawAnswers | null;
  created_at: string;
}

export interface DeterministicBreakdown {
  stockoutDayScore: number;
  stockoutDayMax: number;
  downtimeDaysScore: number;
  downtimeDaysMax: number;
  downtimeCostScore: number;
  downtimeCostMax: number;
  reorderQtyScore: number;
  reorderQtyMax: number;
  extraCostScore: number;
  extraCostMax: number;
  details?: Record<string, unknown>;
}

export interface SemanticBreakdown {
  costTradeoffScore: number; // 1-5
  riskAwarenessScore: number; // 1-5
  clarityAndSynthesis: number; // 1-5
  normalizedScore: number; // 0-30
  details?: Record<string, unknown>;
}

export interface AssessmentEvaluation {
  id: string;
  session_id: string;
  deterministic_score: number; // 0-70
  deterministic_breakdown: DeterministicBreakdown;
  llm_score: number; // 0-30
  llm_breakdown: SemanticBreakdown;
  llm_feedback: string;
  total_score: number; // 0-100
  reviewer_override_score: number | null;
  reviewer_notes: string | null;
  recommendation_badge: RecommendationBadge;
  interview_requested_at: string | null;
  reviewer_feedback: string | null;
  created_at: string;
}

// Database schema definition matching PostgREST generic types
export interface Database {
  public: {
    Tables: {
      assessment_sessions: {
        Row: AssessmentSession;
        Insert: {
          id?: string;
          token: string;
          candidate_name: string;
          candidate_email: string;
          scenario_id?: string;
          status?: SessionStatus;
          started_at?: string | null;
          submitted_at?: string | null;
          telemetry?: SessionTelemetry;
          raw_answers?: CandidateRawAnswers | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          token?: string;
          candidate_name?: string;
          candidate_email?: string;
          scenario_id?: string;
          status?: SessionStatus;
          started_at?: string | null;
          submitted_at?: string | null;
          telemetry?: SessionTelemetry;
          raw_answers?: CandidateRawAnswers | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_evaluations: {
        Row: AssessmentEvaluation;
        Insert: {
          id?: string;
          session_id: string;
          deterministic_score: number;
          deterministic_breakdown: DeterministicBreakdown;
          llm_score: number;
          llm_breakdown: SemanticBreakdown;
          llm_feedback: string;
          total_score: number;
          reviewer_override_score?: number | null;
          reviewer_notes?: string | null;
          recommendation_badge: RecommendationBadge;
          interview_requested_at?: string | null;
          reviewer_feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          deterministic_score?: number;
          deterministic_breakdown?: DeterministicBreakdown;
          llm_score?: number;
          llm_breakdown?: SemanticBreakdown;
          llm_feedback?: string;
          total_score?: number;
          reviewer_override_score?: number | null;
          reviewer_notes?: string | null;
          recommendation_badge?: RecommendationBadge;
          interview_requested_at?: string | null;
          reviewer_feedback?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assessment_evaluations_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: true;
            referencedRelation: 'assessment_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      start_assessment_session: {
        Args: { p_token: string };
        Returns: AssessmentSession[];
      };
      submit_assessment_session: {
        Args: {
          p_token: string;
          p_raw_answers: CandidateRawAnswers;
          p_telemetry: SessionTelemetry;
        };
        Returns: AssessmentSession[];
      };
    };
  };
}

// ============================================================================
// Supabase Client Initializer & Resilience Layer
// ============================================================================

let cachedClient: SupabaseClient<any> | null = null;

export function getSupabaseUrl(): string | undefined {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

/**
 * Returns a typed Supabase client configured with the server-side service role key.
 * If credentials are not present in process.env, returns null.
 */
export function getSupabaseClient(): SupabaseClient<any> | null {
  if (cachedClient) return cachedClient;

  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();

  if (!url || !key) {
    return null;
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

// ============================================================================
// In-Memory Fallback Repository (for local offline dev & test verification)
// ============================================================================

class InMemoryStore {
  sessions = new Map<string, AssessmentSession>();
  evaluations = new Map<string, AssessmentEvaluation>();

  constructor() {
    this.seedDefaultData();
  }

  seedDefaultData() {
    const session1Id = '11111111-1111-4111-8111-111111111111';
    const session1: AssessmentSession = {
      id: session1Id,
      token: 'demo-candidate-1',
      candidate_name: 'Marco Rossi',
      candidate_email: 'marco.rossi@polimi.it',
      scenario_id: 'valvola-v104',
      status: 'pending',
      started_at: null,
      submitted_at: null,
      telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
      raw_answers: null,
      created_at: new Date().toISOString(),
    };

    const session2Id = '22222222-2222-4222-8222-222222222222';
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const session2: AssessmentSession = {
      id: session2Id,
      token: 'demo-candidate-2',
      candidate_name: 'Giulia Bianchi',
      candidate_email: 'giulia.bianchi@unibo.it',
      scenario_id: 'valvola-v104',
      status: 'in_progress',
      started_at: tenMinutesAgo,
      submitted_at: null,
      telemetry: { blur_count: 1, paste_count: 0, time_spent_seconds: 600 },
      raw_answers: {
        stockoutDay: 9,
        downtimeDays: 5,
        expeditedOrderQty: 200,
        decisionMemo: 'Analisi iniziale completata. Si valuta lotto di emergenza...',
      },
      created_at: tenMinutesAgo,
    };

    const session3Id = '33333333-3333-4333-8333-333333333333';
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const eightMinutesAgo = new Date(Date.now() - 8 * 60 * 1000).toISOString();
    const session3: AssessmentSession = {
      id: session3Id,
      token: 'demo-candidate-3',
      candidate_name: 'Alessandro Ferrari',
      candidate_email: 'a.ferrari@polito.it',
      scenario_id: 'valvola-v104',
      status: 'submitted',
      started_at: thirtyMinutesAgo,
      submitted_at: eightMinutesAgo,
      telemetry: { blur_count: 1, paste_count: 0, time_spent_seconds: 1320 },
      raw_answers: {
        stockoutDay: 9,
        downtimeDays: 5,
        expeditedOrderQty: 200,
        calculatedExtraCost: 7000,
        calculatedDowntimeCost: 48000,
        decisionMemo:
          "Priorità assoluta alla continuità operativa della Linea Montaggio 2: l'extra-costo di 7.000 € copre interamente il fabbisogno azzerando il rischio di 5 giorni di fermo linea da 48.000 €.",
      },
      created_at: thirtyMinutesAgo,
    };

    const evaluation3Id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const evaluation3: AssessmentEvaluation = {
      id: evaluation3Id,
      session_id: session3Id,
      deterministic_score: 65,
      deterministic_breakdown: {
        stockoutDayScore: 15,
        stockoutDayMax: 15,
        downtimeDaysScore: 10,
        downtimeDaysMax: 10,
        downtimeCostScore: 10,
        downtimeCostMax: 10,
        reorderQtyScore: 20,
        reorderQtyMax: 20,
        extraCostScore: 10,
        extraCostMax: 15,
        details: { note: 'Tutti i calcoli principali accurati; minima varianza arrotondamento extra-costo.' },
      },
      llm_score: 23,
      llm_breakdown: {
        costTradeoffScore: 5,
        riskAwarenessScore: 4,
        clarityAndSynthesis: 4,
        normalizedScore: 23,
        details: { summary: 'Eccellente analisi del trade-off tra extra-costo ed ore di fermo.' },
      },
      llm_feedback:
        'Decisione rapida e solida. Ha coperto il deficit azzerando il rischio fermo linea con rigorosa attenzione ai costi di fermo.',
      total_score: 88,
      reviewer_override_score: null,
      reviewer_notes: null,
      recommendation_badge: 'consigliato',
      interview_requested_at: null,
      reviewer_feedback: null,
      created_at: eightMinutesAgo,
    };

    this.sessions.set(session1Id, session1);
    this.sessions.set(session2Id, session2);
    this.sessions.set(session3Id, session3);
    this.evaluations.set(evaluation3Id, evaluation3);
  }

  clear() {
    this.sessions.clear();
    this.evaluations.clear();
  }
}

export const inMemoryStore = new InMemoryStore();

// ============================================================================
// Unified High-Level Operations (Supabase DB with Fallback)
// ============================================================================

export async function findSessionByToken(token: string): Promise<AssessmentSession | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) {
      console.error('[Supabase] Error finding session by token:', error.message);
      return null;
    }
    return (data as unknown as AssessmentSession) ?? null;
  }

  // Fallback to in-memory store
  for (const session of inMemoryStore.sessions.values()) {
    if (session.token === token) return session;
  }
  return null;
}

export async function findSessionById(id: string): Promise<AssessmentSession | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[Supabase] Error finding session by id:', error.message);
      return null;
    }
    return (data as unknown as AssessmentSession) ?? null;
  }

  return inMemoryStore.sessions.get(id) || null;
}

export async function startSession(token: string): Promise<{ session: AssessmentSession | null; alreadyStarted: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    // Attempt atomic conditional update
    const { data: existing, error: findErr } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('token', token)
      .single();

    if (findErr || !existing) {
      return { session: null, alreadyStarted: false };
    }

    if (existing.status === 'in_progress') {
      return { session: existing as AssessmentSession, alreadyStarted: true };
    }

    if (existing.status !== 'pending') {
      return { session: existing as AssessmentSession, alreadyStarted: true };
    }

    const { data: updated, error: updateErr } = await supabase
      .from('assessment_sessions')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('token', token)
      .eq('status', 'pending')
      .select()
      .single();

    if (updateErr) {
      // Re-fetch in case of concurrent start
      const refetched = await findSessionByToken(token);
      return { session: refetched, alreadyStarted: refetched?.status === 'in_progress' };
    }

    return { session: (updated as unknown as AssessmentSession) ?? null, alreadyStarted: false };
  }

  // In-memory fallback
  for (const session of inMemoryStore.sessions.values()) {
    if (session.token === token) {
      if (session.status === 'in_progress') {
        return { session, alreadyStarted: true };
      }
      if (session.status === 'pending') {
        session.status = 'in_progress';
        session.started_at = new Date().toISOString();
        return { session, alreadyStarted: false };
      }
      return { session, alreadyStarted: true };
    }
  }

  return { session: null, alreadyStarted: false };
}

export async function saveDraft(
  token: string,
  rawAnswers: CandidateRawAnswers,
  telemetry: SessionTelemetry
): Promise<AssessmentSession | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from('assessment_sessions')
      .update({
        raw_answers: rawAnswers,
        telemetry: telemetry,
      })
      .eq('token', token)
      .eq('status', 'in_progress')
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error saving draft:', error.message);
      return null;
    }
    return (data as unknown as AssessmentSession) ?? null;
  }

  for (const session of inMemoryStore.sessions.values()) {
    if (session.token === token && session.status === 'in_progress') {
      session.raw_answers = rawAnswers;
      session.telemetry = telemetry;
      return session;
    }
  }
  return null;
}

export async function submitSession(
  token: string,
  rawAnswers: CandidateRawAnswers,
  telemetry: SessionTelemetry
): Promise<AssessmentSession | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        raw_answers: rawAnswers,
        telemetry: telemetry,
      })
      .eq('token', token)
      .eq('status', 'in_progress')
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error submitting session:', error.message);
      return null;
    }
    return (data as unknown as AssessmentSession) ?? null;
  }

  // In-memory fallback
  for (const session of inMemoryStore.sessions.values()) {
    if (session.token === token && session.status === 'in_progress') {
      session.status = 'submitted';
      session.submitted_at = new Date().toISOString();
      session.raw_answers = rawAnswers;
      session.telemetry = telemetry;
      return session;
    }
  }
  return null;
}

export async function createEvaluation(
  evaluation: Omit<AssessmentEvaluation, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: AssessmentEvaluation | null; error: Error | null }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_evaluations')
      .insert({
        session_id: evaluation.session_id,
        deterministic_score: evaluation.deterministic_score,
        deterministic_breakdown: evaluation.deterministic_breakdown,
        llm_score: evaluation.llm_score,
        llm_breakdown: evaluation.llm_breakdown,
        llm_feedback: evaluation.llm_feedback,
        total_score: evaluation.total_score,
        reviewer_override_score: evaluation.reviewer_override_score,
        reviewer_notes: evaluation.reviewer_notes,
        recommendation_badge: evaluation.recommendation_badge,
        interview_requested_at: evaluation.interview_requested_at,
        reviewer_feedback: evaluation.reviewer_feedback,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data: (data as unknown as AssessmentEvaluation) ?? null, error: null };
  }

  // In-memory fallback: enforce UNIQUE(session_id) constraint (D2 requirement)
  for (const existing of inMemoryStore.evaluations.values()) {
    if (existing.session_id === evaluation.session_id) {
      return {
        data: null,
        error: new Error(`duplicate key value violates unique constraint "assessment_evaluations_session_id_key"`),
      };
    }
  }

  const id = evaluation.id || `eval-${Math.random().toString(36).substring(2, 9)}`;
  const created: AssessmentEvaluation = {
    ...evaluation,
    id,
    created_at: new Date().toISOString(),
  };
  inMemoryStore.evaluations.set(id, created);
  return { data: created, error: null };
}

export async function findEvaluationBySessionId(sessionId: string): Promise<AssessmentEvaluation | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_evaluations')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('[Supabase] Error finding evaluation by session_id:', error.message);
      return null;
    }
    return (data as unknown as AssessmentEvaluation) ?? null;
  }

  for (const evaluation of inMemoryStore.evaluations.values()) {
    if (evaluation.session_id === sessionId) return evaluation;
  }
  return null;
}

export async function requestInterview(sessionId: string, notes?: string): Promise<AssessmentEvaluation | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_evaluations')
      .update({
        interview_requested_at: new Date().toISOString(),
        reviewer_notes: notes || null,
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error requesting interview:', error.message);
      return null;
    }
    return (data as unknown as AssessmentEvaluation) ?? null;
  }

  for (const evaluation of inMemoryStore.evaluations.values()) {
    if (evaluation.session_id === sessionId) {
      evaluation.interview_requested_at = new Date().toISOString();
      if (notes) evaluation.reviewer_notes = notes;
      return evaluation;
    }
  }
  return null;
}
