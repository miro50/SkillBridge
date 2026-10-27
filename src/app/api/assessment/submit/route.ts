import { NextRequest, NextResponse } from 'next/server';
import {
  findSessionByToken,
  submitSession,
  createEvaluation,
  type RecommendationBadge,
} from '@/lib/supabase/client';
import { generateScenarioFromToken } from '@/lib/assessment/parametric';
import { evaluateDeterministic } from '@/lib/assessment/deterministic';
import { evaluateSemantic } from '@/lib/assessment/gemini-evaluator';
import { dispatchFounderAlert } from '@/lib/notifications/webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, rawAnswers, telemetry } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token obbligatorio' }, { status: 400 });
    }

    const session = await findSessionByToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 });
    }

    if (session.status === 'submitted') {
      return NextResponse.json({
        success: true,
        sessionId: session.id,
        alreadySubmitted: true,
        redirectUrl: `/scorecard/${session.id}`,
      });
    }

    const scenarioConfig = generateScenarioFromToken(token, session.scenario_id);

    // 1. Grade 70% Deterministic
    const deterministicResult = evaluateDeterministic(rawAnswers || {}, scenarioConfig);

    // 2. Grade 30% Semantic (Gemini with 4s timeout & heuristic fallback)
    const memoText = rawAnswers?.decisionMemo || '';
    const semanticResult = await evaluateSemantic(memoText, scenarioConfig);

    // 3. Compute Total Score & Recommendation Badge
    const totalScore = Math.min(100, Math.max(0, deterministicResult.score + semanticResult.score));
    let badge: RecommendationBadge = 'non_idoneo';
    if (totalScore >= 75) {
      badge = 'consigliato';
    } else if (totalScore >= 60) {
      badge = 'riserva';
    }

    // 4. Update Session to 'submitted'
    const updatedSession = await submitSession(
      token,
      rawAnswers || {},
      telemetry || { blur_count: 0, paste_count: 0, time_spent_seconds: 0 }
    );

    const sessionId = updatedSession?.id || session.id;

    // 5. Insert Evaluation Record (idempotent / unique on session_id)
    const { error: evalError } = await createEvaluation({
      session_id: sessionId,
      deterministic_score: deterministicResult.score,
      deterministic_breakdown: deterministicResult.breakdown,
      llm_score: semanticResult.score,
      llm_breakdown: semanticResult.breakdown,
      llm_feedback: semanticResult.feedback,
      total_score: totalScore,
      reviewer_override_score: null,
      reviewer_notes: null,
      recommendation_badge: badge,
      interview_requested_at: null,
      reviewer_feedback: null,
    });

    if (evalError) {
      console.warn('[Submit] Evaluation creation warning:', evalError.message);
    }

    // 6. Non-blocking Founder Webhook Alert (T6)
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    dispatchFounderAlert({
      event: 'assessment_completed',
      candidate_name: session.candidate_name,
      candidate_email: session.candidate_email,
      score: totalScore,
      badge,
      deterministic_score: deterministicResult.score,
      llm_score: semanticResult.score,
      scorecard_url: `${origin}/scorecard/${sessionId}`,
      timestamp: new Date().toISOString(),
    }).catch((webhookErr) => {
      console.warn('[Submit] Webhook dispatch handled cleanly:', webhookErr);
    });

    return NextResponse.json({
      success: true,
      sessionId,
      totalScore,
      badge,
      redirectUrl: `/scorecard/${sessionId}`,
    });
  } catch (err: any) {
    console.error('[API assessment/submit] Error:', err);
    return NextResponse.json(
      { error: 'Errore interno durante la sottomissione' },
      { status: 500 }
    );
  }
}
