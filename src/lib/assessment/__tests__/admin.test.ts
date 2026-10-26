import { describe, it, expect, beforeEach } from 'vitest';
import {
  inMemoryStore,
  listAllSessions,
  createCandidateSession,
  updateEvaluationOverride,
  type AssessmentSession,
  type AssessmentEvaluation,
} from '../../supabase/client';
import { GET as getSessionsRoute } from '../../../app/api/admin/sessions/route';
import { POST as createInviteRoute } from '../../../app/api/admin/invite/route';
import { POST as updateOverrideRoute } from '../../../app/api/admin/override/route';
import { NextRequest } from 'next/server';

describe('Founder Admin Operations & Pipeline Management', () => {
  beforeEach(() => {
    inMemoryStore.clear();

    const s1: AssessmentSession = {
      id: 'admin-sess-1',
      token: 'admin-cand-1',
      candidate_name: 'Giulia Bianchi',
      candidate_email: 'giulia.b@polimi.it',
      scenario_id: 'valvola-v104',
      status: 'submitted',
      started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      submitted_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 1200 },
      raw_answers: { stockoutDay: 9, expeditedOrderQty: 200 },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    };

    const e1: AssessmentEvaluation = {
      id: 'admin-eval-1',
      session_id: 'admin-sess-1',
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
      llm_score: 22,
      llm_breakdown: {
        costTradeoffScore: 4,
        riskAwarenessScore: 4,
        clarityAndSynthesis: 4,
        normalizedScore: 22,
      },
      llm_feedback: 'Buona gestione analitica del punto di riordino.',
      total_score: 87,
      reviewer_override_score: null,
      reviewer_notes: null,
      recommendation_badge: 'consigliato',
      interview_requested_at: null,
      reviewer_feedback: null,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    };

    inMemoryStore.sessions.set(s1.id, s1);
    inMemoryStore.evaluations.set(e1.id, e1);
  });

  it('1. listAllSessions returns sessions paired with their evaluations in chronological order', async () => {
    const list = await listAllSessions();
    expect(list.length).toBe(1);
    expect(list[0].session.candidate_name).toBe('Giulia Bianchi');
    expect(list[0].evaluation?.total_score).toBe(87);
    expect(list[0].evaluation?.recommendation_badge).toBe('consigliato');
  });

  it('2. createCandidateSession generates new pending session with auto-token and sanitized fields', async () => {
    const session = await createCandidateSession({
      candidate_name: '  Marco Rossi  ',
      candidate_email: 'MARCO.ROSSI@STUDENTI.UNIBO.IT  ',
    });

    expect(session.id).toBeDefined();
    expect(session.candidate_name).toBe('Marco Rossi');
    expect(session.candidate_email).toBe('marco.rossi@studenti.unibo.it');
    expect(session.scenario_id).toBe('valvola-v104');
    expect(session.status).toBe('pending');
    expect(session.token).toMatch(/^cand-/);

    const list = await listAllSessions();
    expect(list.length).toBe(2);
  });

  it('3. createCandidateSession accepts a custom token when provided', async () => {
    const session = await createCandidateSession({
      candidate_name: 'Paolo Neri',
      candidate_email: 'p.neri@polito.it',
      customToken: 'fast-track-paolo-2026',
    });

    expect(session.token).toBe('fast-track-paolo-2026');
  });

  it('4. updateEvaluationOverride updates score and operational notes', async () => {
    const updated = await updateEvaluationOverride('admin-sess-1', 92, 'Colloquio 10 min eccellente');
    expect(updated).not.toBeNull();
    expect(updated?.reviewer_override_score).toBe(92);
    expect(updated?.reviewer_notes).toBe('Colloquio 10 min eccellente');
  });

  it('5. API GET /api/admin/sessions returns sessions list', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/sessions');
    const res = await getSessionsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.sessions).toBeDefined();
    expect(data.sessions.length).toBe(1);
    expect(data.sessions[0].session.token).toBe('admin-cand-1');
  });

  it('6. API POST /api/admin/invite generates URL and prewritten LinkedIn/WhatsApp invite', async () => {
    const body = {
      candidate_name: 'Luca Moretti',
      candidate_email: 'l.moretti@polimi.it',
      customToken: 'luca-m-vip',
    };

    const req = new NextRequest('http://localhost:3000/api/admin/invite', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await createInviteRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.invitationUrl).toContain('/assessment/luca-m-vip');
    expect(data.prewrittenMessage).toContain('Luca');
    expect(data.prewrittenMessage).toContain('Valvola V-104');
  });

  it('7. API POST /api/admin/override enforces 0-100 score bounds', async () => {
    const reqInvalid = new NextRequest('http://localhost:3000/api/admin/override', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'admin-sess-1', overrideScore: 110 }),
    });

    const resInvalid = await updateOverrideRoute(reqInvalid);
    expect(resInvalid.status).toBe(400);

    const reqValid = new NextRequest('http://localhost:3000/api/admin/override', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'admin-sess-1', overrideScore: 89, notes: 'Validato' }),
    });

    const resValid = await updateOverrideRoute(reqValid);
    expect(resValid.status).toBe(200);
    const data = await resValid.json();
    expect(data.evaluation.reviewer_override_score).toBe(89);
  });
});
