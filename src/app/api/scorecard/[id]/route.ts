import { NextRequest, NextResponse } from 'next/server';
import { findSessionById, findEvaluationBySessionId } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ID sessione non specificato' }, { status: 400 });
    }

    const session = await findSessionById(id);
    if (!session) {
      return NextResponse.json(
        { error: 'Sessione di assessment non trovata' },
        { status: 404 }
      );
    }

    const evaluation = await findEvaluationBySessionId(id);
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Valutazione non ancora generata o in elaborazione' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session,
      evaluation,
    });
  } catch (err: any) {
    console.error('[API scorecard/[id]] Error:', err);
    return NextResponse.json(
      { error: 'Errore interno nel caricamento della scorecard' },
      { status: 500 }
    );
  }
}
