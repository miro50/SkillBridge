import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateEvaluationOverride } from '@/lib/supabase/client';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;

  const headerKey = request.headers.get('x-admin-key');
  return headerKey === adminSecret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sessionId, overrideScore, notes } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID mancante' }, { status: 400 });
    }

    if (overrideScore !== null && overrideScore !== undefined) {
      const num = Number(overrideScore);
      if (isNaN(num) || num < 0 || num > 100) {
        return NextResponse.json(
          { error: 'Il punteggio di override deve essere compreso tra 0 e 100' },
          { status: 400 }
        );
      }
    }

    const evaluation = await updateEvaluationOverride(
      sessionId,
      overrideScore !== undefined ? overrideScore : null,
      notes !== undefined ? notes : null
    );

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Valutazione non trovata per la sessione indicata' },
        { status: 404 }
      );
    }

    // P3: Invalidate Edge Cache immediately on reviewer override
    try {
      revalidatePath(`/scorecard/${sessionId}`);
      revalidatePath(`/api/scorecard/${sessionId}`);
    } catch {
      // Ignored in non-prerendered dynamic contexts
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('[API admin/override] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Errore durante l\'aggiornamento dell\'override' },
      { status: 500 }
    );
  }
}
