import { NextRequest, NextResponse } from 'next/server';
import { findSessionById, requestInterview } from '@/lib/supabase/client';
import { dispatchFounderAlert } from '@/lib/notifications/webhook';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ID sessione mancante' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const notes = body?.notes;

    const evaluation = await requestInterview(id, notes);
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Impossibile registrare la richiesta di colloquio per questa sessione' },
        { status: 404 }
      );
    }

    // Fetch session details for webhook enrichment
    const session = await findSessionById(id);

    // Non-blocking Founder Webhook Alert
    if (session) {
      const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      dispatchFounderAlert({
        event: 'interview_requested',
        candidate_name: session.candidate_name,
        candidate_email: session.candidate_email,
        scorecard_id: id,
        total_score: evaluation.total_score,
        badge: evaluation.recommendation_badge,
        notes: notes || null,
        scorecard_url: `${origin}/scorecard/${id}`,
        timestamp: new Date().toISOString(),
      }).catch((webhookErr) => {
        console.warn('[Interview] Webhook dispatch handled cleanly:', webhookErr);
      });
    }

    return NextResponse.json({
      success: true,
      interview_requested_at: evaluation.interview_requested_at,
      reviewer_notes: evaluation.reviewer_notes,
    });
  } catch (err: any) {
    console.error('[API scorecard/[id]/request-interview] Error:', err);
    return NextResponse.json(
      { error: 'Errore interno nella richiesta del colloquio' },
      { status: 500 }
    );
  }
}
