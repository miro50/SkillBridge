import { NextRequest, NextResponse } from 'next/server';
import { findSessionByToken } from '@/lib/supabase/client';
import { generateScenarioFromToken, sanitizeScenarioForCandidate } from '@/lib/assessment/parametric';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const token = resolvedParams.token;

    if (!token) {
      return NextResponse.json({ error: 'Token non specificato' }, { status: 400 });
    }

    const session = await findSessionByToken(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione di assessment non trovata o link scaduto' },
        { status: 404 }
      );
    }

    const scenarioConfig = generateScenarioFromToken(token, session.scenario_id);
    const sanitizedScenario = sanitizeScenarioForCandidate(scenarioConfig);

    let remainingSeconds = 25 * 60; // 25:00 default

    if (session.status === 'in_progress' && session.started_at) {
      const startTime = new Date(session.started_at).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      remainingSeconds = Math.max(0, 25 * 60 - elapsedSeconds);
    } else if (session.status === 'submitted') {
      remainingSeconds = 0;
    }

    return NextResponse.json({
      session,
      scenario: sanitizedScenario,
      remainingSeconds,
    });
  } catch (err: any) {
    console.error('[API assessment/[token]] Error:', err);
    return NextResponse.json(
      { error: 'Errore interno nel caricamento della sessione' },
      { status: 500 }
    );
  }
}
