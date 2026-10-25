import { describe, it, expect, beforeEach } from 'vitest';
import {
  inMemoryStore,
  type AssessmentSession,
  type AssessmentEvaluation,
} from '../../supabase/client';
import { GET as getScorecardRoute } from '../../../app/api/scorecard/[id]/route';
import { POST as requestInterviewRoute } from '../../../app/api/scorecard/[id]/request-interview/route';
import { NextRequest } from 'next/server';

describe('Executive Scorecard & Interview Action Integration (T5)', () => {
  const sessionId = 'scorecard-test-uuid-99';

  const mockSession: AssessmentSession = {
    id: sessionId,
    token: 'token-alessandro-ferrari',
    candidate_name: 'Alessandro Ferrari',
    candidate_email: 'a.ferrari@polito.it',
    scenario_id: 'valvola-v104',
    status: 'submitted',
    started_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString(),
    telemetry: { blur_count: 1, paste_count: 0, time_spent_seconds: 1334 },
    raw_answers: {
      stockoutDay: 9,
      downtimeDays: 5,
      expeditedOrderQty: 200,
      decisionMemo: 'Decisione orientata alla massima continuità operativa della linea...',
    },
    created_at: new Date().toISOString(),
  };

  const mockEvaluation: AssessmentEvaluation = {
    id: 'eval-uuid-99',
    session_id: sessionId,
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
    },
    llm_score: 23,
    llm_breakdown: {
      costTradeoffScore: 5,
      riskAwarenessScore: 4,
      clarityAndSynthesis: 4,
      normalizedScore: 23,
    },
    llm_feedback: 'Decisione solida ed efficace.',
    total_score: 88,
    reviewer_override_score: null,
    reviewer_notes: null,
    recommendation_badge: 'consigliato',
    interview_requested_at: null,
    reviewer_feedback: null,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    inMemoryStore.clear();
    inMemoryStore.sessions.set(sessionId, mockSession);
    inMemoryStore.evaluations.set(mockEvaluation.id, mockEvaluation);
  });

  it('1. GET /api/scorecard/[id] returns full scorecard data for valid session', async () => {
    const req = new NextRequest(`http://localhost:3000/api/scorecard/${sessionId}`);
    const res = await getScorecardRoute(req, { params: Promise.resolve({ id: sessionId }) });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.session.id).toBe(sessionId);
    expect(data.session.candidate_name).toBe('Alessandro Ferrari');
    expect(data.evaluation.total_score).toBe(88);
    expect(data.evaluation.recommendation_badge).toBe('consigliato');
    expect(data.evaluation.deterministic_score).toBe(65);
    expect(data.evaluation.llm_score).toBe(23);
  });

  it('2. GET /api/scorecard/[id] returns 404 for non-existent session ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/scorecard/non-existent-uuid');
    const res = await getScorecardRoute(req, { params: Promise.resolve({ id: 'non-existent-uuid' }) });

    expect(res.status).toBe(404);
  });

  it('3. POST /api/scorecard/[id]/request-interview updates timestamp and notes in-place', async () => {
    const interviewNotes = 'Disponibile giovedì ore 10:00 per colloquio conoscitivo';
    const req = new NextRequest(`http://localhost:3000/api/scorecard/${sessionId}/request-interview`, {
      method: 'POST',
      body: JSON.stringify({ notes: interviewNotes }),
    });

    const res = await requestInterviewRoute(req, { params: Promise.resolve({ id: sessionId }) });
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.interview_requested_at).toBeDefined();
    expect(data.reviewer_notes).toBe(interviewNotes);

    // Verify stored evaluation reflects the update
    const updatedEval = inMemoryStore.evaluations.get(mockEvaluation.id);
    expect(updatedEval?.interview_requested_at).toBeDefined();
    expect(updatedEval?.reviewer_notes).toBe(interviewNotes);
  });

  it('4. POST /api/scorecard/[id]/request-interview succeeds without optional notes', async () => {
    const req = new NextRequest(`http://localhost:3000/api/scorecard/${sessionId}/request-interview`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await requestInterviewRoute(req, { params: Promise.resolve({ id: sessionId }) });
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.interview_requested_at).toBeDefined();
  });
});
