import { describe, it, expect, beforeEach } from 'vitest';
import {
  inMemoryStore,
  type AssessmentSession,
} from '../../supabase/client';
import { GET as getSessionRoute } from '../../../app/api/assessment/[token]/route';
import { POST as startRoute } from '../../../app/api/assessment/start/route';
import { POST as saveRoute } from '../../../app/api/assessment/save/route';
import { POST as submitRoute } from '../../../app/api/assessment/submit/route';
import { NextRequest } from 'next/server';

describe('Candidate Runner End-to-End API Integration (T4)', () => {
  const testToken = 'integration-test-candidate-token-42';
  const sessionId = 'test-session-uuid-42';

  beforeEach(() => {
    inMemoryStore.clear();

    const initialSession: AssessmentSession = {
      id: sessionId,
      token: testToken,
      candidate_name: 'Giulia Bianchi',
      candidate_email: 'giulia.bianchi@unibo.it',
      scenario_id: 'valvola-v104',
      status: 'pending',
      started_at: null,
      submitted_at: null,
      telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 0 },
      raw_answers: null,
      created_at: new Date().toISOString(),
    };

    inMemoryStore.sessions.set(sessionId, initialSession);
  });

  it('1. GET /api/assessment/[token] returns pending session and sanitized scenario without answers', async () => {
    const req = new NextRequest(`http://localhost:3000/api/assessment/${testToken}`);
    const res = await getSessionRoute(req, { params: Promise.resolve({ token: testToken }) });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.session.token).toBe(testToken);
    expect(data.session.status).toBe('pending');
    expect(data.remainingSeconds).toBe(1500); // 25:00

    // Ensure confidential expected answers are stripped
    expect(data.scenario.expectedStockoutDay).toBeUndefined();
    expect(data.scenario.expectedDowntimeCost).toBeUndefined();
    expect(data.scenario.expectedReorderQty).toBeUndefined();
    expect(data.scenario.dailyConsumption).toBeGreaterThan(0);
    expect(data.scenario.initialStock).toBeGreaterThan(0);
  });

  it('2. POST /api/assessment/start initiates session and records started_at', async () => {
    const req = new NextRequest('http://localhost:3000/api/assessment/start', {
      method: 'POST',
      body: JSON.stringify({ token: testToken }),
    });

    const res = await startRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.session.status).toBe('in_progress');
    expect(data.alreadyStarted).toBe(false);
    expect(data.session.started_at).toBeDefined();

    // Verify in DB / store
    const stored = inMemoryStore.sessions.get(sessionId);
    expect(stored?.status).toBe('in_progress');
    expect(stored?.started_at).toBeDefined();
  });

  it('3. POST /api/assessment/save records draft inputs and telemetry', async () => {
    // First start the session
    const startReq = new NextRequest('http://localhost:3000/api/assessment/start', {
      method: 'POST',
      body: JSON.stringify({ token: testToken }),
    });
    await startRoute(startReq);

    // Save draft
    const saveReq = new NextRequest('http://localhost:3000/api/assessment/save', {
      method: 'POST',
      body: JSON.stringify({
        token: testToken,
        rawAnswers: {
          stockoutDay: 9,
          downtimeDays: 5,
          expeditedOrderQty: 200,
          decisionMemo: 'Bozza salvata a 12 minuti dal termine...',
        },
        telemetry: {
          blur_count: 2,
          paste_count: 1,
          time_spent_seconds: 720,
        },
      }),
    });

    const res = await saveRoute(saveReq);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const stored = inMemoryStore.sessions.get(sessionId);
    expect(stored?.raw_answers?.stockoutDay).toBe(9);
    expect(stored?.telemetry.blur_count).toBe(2);
    expect(stored?.telemetry.paste_count).toBe(1);
  });

  it('4. POST /api/assessment/submit executes full grading, records evaluation, and redirects to scorecard', async () => {
    // Start session
    const startReq = new NextRequest('http://localhost:3000/api/assessment/start', {
      method: 'POST',
      body: JSON.stringify({ token: testToken }),
    });
    await startRoute(startReq);

    // Submit payload
    const submitReq = new NextRequest('http://localhost:3000/api/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({
        token: testToken,
        rawAnswers: {
          stockoutDay: 9,
          downtimeDays: 5,
          downtimeCost: 48000,
          reorderQty: 200,
          extraCost: 7000,
          decisionMemo:
            'Priorità alla continuità della Linea 2: ordiniamo 200 unità con AirSupply a 85 €/u per coprire il deficit di 5 giorni di fermo evitando 48.000 € di danno economico con soli 7.000 € di extra-costo.',
        },
        telemetry: {
          blur_count: 1,
          paste_count: 0,
          time_spent_seconds: 1350,
        },
      }),
    });

    const res = await submitRoute(submitReq);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.sessionId).toBe(sessionId);
    expect(data.totalScore).toBeGreaterThanOrEqual(60);
    expect(['consigliato', 'riserva']).toContain(data.badge);
    expect(data.redirectUrl).toBe(`/scorecard/${sessionId}`);

    // Verify session state updated
    const sessionInDb = inMemoryStore.sessions.get(sessionId);
    expect(sessionInDb?.status).toBe('submitted');
    expect(sessionInDb?.submitted_at).toBeDefined();

    // Verify evaluation record created
    let evaluationInDb = null;
    for (const ev of inMemoryStore.evaluations.values()) {
      if (ev.session_id === sessionId) {
        evaluationInDb = ev;
        break;
      }
    }
    expect(evaluationInDb).toBeDefined();
    expect(evaluationInDb?.total_score).toBe(data.totalScore);
    expect(evaluationInDb?.deterministic_score).toBeGreaterThan(0);
    expect(evaluationInDb?.llm_score).toBeGreaterThan(0);
  });

  it('5. Handles idempotent re-submission without creating duplicate evaluations', async () => {
    // Mark as submitted
    const session = inMemoryStore.sessions.get(sessionId)!;
    session.status = 'submitted';
    session.submitted_at = new Date().toISOString();

    const submitReq = new NextRequest('http://localhost:3000/api/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({
        token: testToken,
        rawAnswers: {},
        telemetry: { blur_count: 0, paste_count: 0, time_spent_seconds: 100 },
      }),
    });

    const res = await submitRoute(submitReq);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.alreadySubmitted).toBe(true);
    expect(data.redirectUrl).toBe(`/scorecard/${sessionId}`);
  });
});
