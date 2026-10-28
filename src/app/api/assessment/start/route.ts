import { NextRequest, NextResponse } from 'next/server';
import { startSession } from '@/lib/supabase/client';
import { enforceRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  // P2: Rate Limit Protection (Max 10 session starts / min per IP)
  const rateLimitBlock = enforceRateLimit(request, {
    maxRequests: 10,
    windowSeconds: 60,
    actionName: 'assessment-start',
  });
  if (rateLimitBlock) return rateLimitBlock;

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
