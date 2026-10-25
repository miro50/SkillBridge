/**
 * SkillBridge Seed & Database Verification Script (T1)
 *
 * Populates initial demonstration sessions and evaluates constraint integrity:
 * 1. Demo Pending Candidate: Marco Rossi (token: demo-candidate-1)
 * 2. Demo In-Progress Candidate: Giulia Bianchi (token: demo-candidate-2)
 * 3. Demo Submitted Candidate & Scorecard: Alessandro Ferrari (token: demo-candidate-3)
 * 4. D2 Constraint Verification: Tests that duplicate evaluations for the same session_id are rejected.
 */

import {
  getSupabaseClient,
  isSupabaseConfigured,
  inMemoryStore,
  createEvaluation,
  type AssessmentSession,
  type AssessmentEvaluation,
} from '../src/lib/supabase/client';

interface SeedResult {
  token: string;
  candidateName: string;
  status: string;
  sessionId: string;
  scorecardId?: string;
  runnerUrl: string;
  scorecardUrl?: string;
}

export async function runSeed(): Promise<{
  success: boolean;
  seeded: SeedResult[];
  constraintTestPassed: boolean;
}> {
  console.log('================================================================');
  console.log('🚀 SkillBridge Database & Seed Setup (T1)');
  console.log('================================================================');

  const supabase = getSupabaseClient();
  const isLive = isSupabaseConfigured() && supabase !== null;

  console.log(`📡 Database mode: ${isLive ? 'Supabase Live Connection' : 'In-Memory Dev Repository'}`);
  if (!isLive) {
    console.log('ℹ️  Note: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not detected.');
    console.log('    Operating in fallback dev mode. Provide keys in .env.local for live cloud sync.\n');
  }

  const baseOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const seededResults: SeedResult[] = [];

  // --------------------------------------------------------------------------
  // Candidate 1: Pending (Fresh Assessment)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Candidate 2: In-Progress (Resuming Session)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Candidate 3: Submitted (Completed with Scorecard)
  // --------------------------------------------------------------------------
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

  // Upsert into Supabase or In-Memory Store
  if (isLive && supabase) {
    const sessions = [session1, session2, session3];
    for (const s of sessions) {
      const { error } = await (supabase as any).from('assessment_sessions').upsert({
        id: s.id,
        token: s.token,
        candidate_name: s.candidate_name,
        candidate_email: s.candidate_email,
        scenario_id: s.scenario_id,
        status: s.status,
        started_at: s.started_at,
        submitted_at: s.submitted_at,
        telemetry: s.telemetry,
        raw_answers: s.raw_answers,
      });
      if (error) {
        console.error(`❌ Failed to upsert session ${s.token}:`, error.message);
      }
    }

    const { error: evalErr } = await (supabase as any).from('assessment_evaluations').upsert({
      id: evaluation3.id,
      session_id: evaluation3.session_id,
      deterministic_score: evaluation3.deterministic_score,
      deterministic_breakdown: evaluation3.deterministic_breakdown,
      llm_score: evaluation3.llm_score,
      llm_breakdown: evaluation3.llm_breakdown,
      llm_feedback: evaluation3.llm_feedback,
      total_score: evaluation3.total_score,
      reviewer_override_score: evaluation3.reviewer_override_score,
      reviewer_notes: evaluation3.reviewer_notes,
      recommendation_badge: evaluation3.recommendation_badge,
      interview_requested_at: evaluation3.interview_requested_at,
      reviewer_feedback: evaluation3.reviewer_feedback,
    });
    if (evalErr) {
      console.error(`❌ Failed to upsert evaluation:`, evalErr.message);
    }
  } else {
    inMemoryStore.sessions.set(session1.id, session1);
    inMemoryStore.sessions.set(session2.id, session2);
    inMemoryStore.sessions.set(session3.id, session3);
    inMemoryStore.evaluations.set(evaluation3.id, evaluation3);
  }

  seededResults.push(
    {
      token: session1.token,
      candidateName: session1.candidate_name,
      status: session1.status,
      sessionId: session1.id,
      runnerUrl: `${baseOrigin}/assessment/${session1.token}`,
    },
    {
      token: session2.token,
      candidateName: session2.candidate_name,
      status: session2.status,
      sessionId: session2.id,
      runnerUrl: `${baseOrigin}/assessment/${session2.token}`,
    },
    {
      token: session3.token,
      candidateName: session3.candidate_name,
      status: session3.status,
      sessionId: session3.id,
      scorecardId: session3.id,
      runnerUrl: `${baseOrigin}/assessment/${session3.token}`,
      scorecardUrl: `${baseOrigin}/scorecard/${session3.id}`,
    }
  );

  console.log('✅ Seed Sessions Loaded Successfully:');
  for (const item of seededResults) {
    console.log(`  - [${item.status.toUpperCase()}] ${item.candidateName} (token: ${item.token})`);
    console.log(`    Runner URL:    ${item.runnerUrl}`);
    if (item.scorecardUrl) {
      console.log(`    Scorecard URL: ${item.scorecardUrl}`);
    }
  }

  // --------------------------------------------------------------------------
  // D2 Verification: Test UNIQUE(session_id) on assessment_evaluations
  // --------------------------------------------------------------------------
  console.log('\n----------------------------------------------------------------');
  console.log('🔒 Verifying D2 Constraint: UNIQUE(session_id) on assessment_evaluations');
  console.log('----------------------------------------------------------------');

  const duplicateAttempt = {
    session_id: session3Id,
    deterministic_score: 50,
    deterministic_breakdown: {
      stockoutDayScore: 10,
      stockoutDayMax: 15,
      downtimeDaysScore: 5,
      downtimeDaysMax: 10,
      downtimeCostScore: 5,
      downtimeCostMax: 10,
      reorderQtyScore: 15,
      reorderQtyMax: 20,
      extraCostScore: 15,
      extraCostMax: 15,
    },
    llm_score: 20,
    llm_breakdown: {
      costTradeoffScore: 3,
      riskAwarenessScore: 3,
      clarityAndSynthesis: 4,
      normalizedScore: 20,
    },
    llm_feedback: 'Duplicate attempt payload',
    total_score: 70,
    reviewer_override_score: null,
    reviewer_notes: null,
    recommendation_badge: 'riserva' as const,
    interview_requested_at: null,
    reviewer_feedback: null,
  };

  const { error: constraintError } = await createEvaluation(duplicateAttempt);

  let constraintTestPassed = false;
  if (constraintError) {
    console.log(`✅ [PASS] Duplicate evaluation correctly rejected by UNIQUE constraint:`);
    console.log(`   Expected error: "${constraintError.message}"`);
    constraintTestPassed = true;
  } else {
    console.error('❌ [FAIL] Constraint test failed: duplicate evaluation was allowed!');
  }

  console.log('\n================================================================');
  console.log('🎉 Task T1 Verification Complete!');
  console.log('================================================================\n');

  return {
    success: true,
    seeded: seededResults,
    constraintTestPassed,
  };
}

// Allow direct CLI execution
if (process.argv[1]?.includes('seed')) {
  runSeed().catch((err) => {
    console.error('Seed script encountered error:', err);
    process.exit(1);
  });
}
