import { NextRequest, NextResponse } from 'next/server';
import { startSession } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: 'Token obbligatorio' }, { status: 400 });
    }

    const { session, alreadyStarted } = await startSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 });
    }

    return NextResponse.json({
      session,
      alreadyStarted,
      startedAt: session.started_at,
    });
  } catch (err: any) {
    console.error('[API assessment/start] Error:', err);
    return NextResponse.json(
      { error: 'Impossibile avviare la sessione' },
      { status: 500 }
    );
  }
}
