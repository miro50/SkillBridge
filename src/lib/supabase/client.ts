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
  leads = new Map<string, CompanyLead>();

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
      scenario_id: 'packaging-p200',
      status: 'in_progress',
      started_at: tenMinutesAgo,
      submitted_at: null,
      telemetry: { blur_count: 1, paste_count: 0, time_spent_seconds: 600 },
      raw_answers: {
        stockoutDay: 8,
        downtimeDays: 7,
        expeditedOrderQty: 250,
        decisionMemo: 'Analisi iniziale completata. Si valuta lotto di emergenza astucci su blisteratrice...',
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

    const session4Id = '44444444-4444-4444-8444-444444444444';
    const session4: AssessmentSession = {
      id: session4Id,
      token: 'demo-candidate-4',
      candidate_name: 'Luca Moretti',
      candidate_email: 'luca.moretti@polimi.it',
      scenario_id: 'scheda-e501',
      status: 'pending',
      started_at: null,
      submitted_at: null,
      telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
      raw_answers: null,
      created_at: new Date().toISOString(),
    };

    const session5Id = '55555555-5555-4555-8555-555555555555';
    const session5: AssessmentSession = {
      id: session5Id,
      token: 'demo-candidate-5',
      candidate_name: 'Matteo Rinaldi',
      candidate_email: 'm.rinaldi@polimi.it',
      scenario_id: 'process-m300',
      status: 'pending',
      started_at: null,
      submitted_at: null,
      telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
      raw_answers: null,
      created_at: new Date().toISOString(),
    };

    this.sessions.set(session1Id, session1);
    this.sessions.set(session2Id, session2);
    this.sessions.set(session3Id, session3);
    this.sessions.set(session4Id, session4);
    this.sessions.set(session5Id, session5);
    this.evaluations.set(evaluation3Id, evaluation3);
  }

  clear() {
    this.sessions.clear();
    this.evaluations.clear();
    this.leads.clear();
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

export interface SessionWithEvaluation {
  session: AssessmentSession;
  evaluation: AssessmentEvaluation | null;
}

export async function listAllSessions(): Promise<SessionWithEvaluation[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*, assessment_evaluations(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Error listing sessions:', error.message);
      return [];
    }

    return (data || []).map((row: any) => {
      const evaluation = Array.isArray(row.assessment_evaluations)
        ? row.assessment_evaluations[0] || null
        : row.assessment_evaluations || null;

      const session: AssessmentSession = {
        id: row.id,
        token: row.token,
        candidate_name: row.candidate_name,
        candidate_email: row.candidate_email,
        scenario_id: row.scenario_id,
        status: row.status,
        started_at: row.started_at,
        submitted_at: row.submitted_at,
        telemetry: row.telemetry,
        raw_answers: row.raw_answers,
        created_at: row.created_at,
      };

      return { session, evaluation };
    });
  }

  // In-memory fallback
  const results: SessionWithEvaluation[] = [];
  for (const session of inMemoryStore.sessions.values()) {
    let evaluation: AssessmentEvaluation | null = null;
    for (const ev of inMemoryStore.evaluations.values()) {
      if (ev.session_id === session.id) {
        evaluation = ev;
        break;
      }
    }
    results.push({ session, evaluation });
  }

  results.sort(
    (a, b) => new Date(b.session.created_at).getTime() - new Date(a.session.created_at).getTime()
  );

  return results;
}

export async function createCandidateSession(params: {
  candidate_name: string;
  candidate_email: string;
  scenario_id?: string;
  customToken?: string;
}): Promise<AssessmentSession> {
  const token =
    params.customToken?.trim() ||
    `cand-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const scenario_id = params.scenario_id || 'valvola-v104';

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert({
        token,
        candidate_name: params.candidate_name.trim(),
        candidate_email: params.candidate_email.trim().toLowerCase(),
        scenario_id,
        status: 'pending',
        telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
        raw_answers: null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error creating session:', error.message);
      throw new Error(`Failed to create candidate session: ${error.message}`);
    }

    return data as unknown as AssessmentSession;
  }

  // In-memory store
  const id = crypto.randomUUID();
  const session: AssessmentSession = {
    id,
    token,
    candidate_name: params.candidate_name.trim(),
    candidate_email: params.candidate_email.trim().toLowerCase(),
    scenario_id,
    status: 'pending',
    started_at: null,
    submitted_at: null,
    telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
    raw_answers: null,
    created_at: new Date().toISOString(),
  };

  inMemoryStore.sessions.set(id, session);
  return session;
}

export async function updateEvaluationOverride(
  sessionId: string,
  overrideScore: number | null,
  notes: string | null
): Promise<AssessmentEvaluation | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_evaluations')
      .update({
        reviewer_override_score: overrideScore,
        reviewer_notes: notes || null,
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error updating override:', error.message);
      return null;
    }

    return (data as unknown as AssessmentEvaluation) ?? null;
  }

  for (const evaluation of inMemoryStore.evaluations.values()) {
    if (evaluation.session_id === sessionId) {
      evaluation.reviewer_override_score = overrideScore;
      if (notes !== null) evaluation.reviewer_notes = notes;
      return evaluation;
    }
  }

  return null;
}

export interface CompanyLead {
  id: string;
  contact_name: string;
  company_name: string;
  email: string;
  phone?: string;
  province?: string;
  role?: string;
  role_needed?: string;
  estimated_ral?: number;
  notes?: string;
  created_at: string;
}

export async function createCompanyLead(
  lead: Omit<CompanyLead, 'id' | 'created_at'>
): Promise<CompanyLead> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('company_leads')
      .insert({
        contact_name: lead.contact_name.trim(),
        company_name: lead.company_name.trim(),
        email: lead.email.trim().toLowerCase(),
        phone: lead.phone?.trim() || null,
        province: lead.province?.trim() || null,
        role: lead.role?.trim() || null,
        role_needed: lead.role_needed?.trim() || null,
        estimated_ral: lead.estimated_ral || null,
        notes: lead.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error creating lead:', error.message);
      throw new Error(`Failed to create lead: ${error.message}`);
    }

    return data as unknown as CompanyLead;
  }

  const id = crypto.randomUUID();
  const createdLead: CompanyLead = {
    id,
    contact_name: lead.contact_name.trim(),
    company_name: lead.company_name.trim(),
    email: lead.email.trim().toLowerCase(),
    phone: lead.phone?.trim() || undefined,
    province: lead.province?.trim() || undefined,
    role: lead.role?.trim() || undefined,
    role_needed: lead.role_needed?.trim() || undefined,
    estimated_ral: lead.estimated_ral || undefined,
    notes: lead.notes?.trim() || undefined,
    created_at: new Date().toISOString(),
  };

  inMemoryStore.leads.set(id, createdLead);
  return createdLead;
}

export async function listAllLeads(): Promise<CompanyLead[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('company_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Error listing leads:', error.message);
      return [];
    }

    return (data || []) as unknown as CompanyLead[];
  }

  const list = Array.from(inMemoryStore.leads.values());
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return list;
}
