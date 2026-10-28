import { NextRequest, NextResponse } from 'next/server';
import { saveDraft } from '@/lib/supabase/client';
import { enforceRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  // P2: Rate Limit Protection (Max 30 save heartbeats / min per IP)
  const rateLimitBlock = enforceRateLimit(request, {
    maxRequests: 30,
    windowSeconds: 60,
    actionName: 'assessment-save',
  });
  if (rateLimitBlock) return rateLimitBlock;

  try {
    const body = await request.json();
    const { token, rawAnswers, telemetry } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token obbligatorio' }, { status: 400 });
    }

    const session = await saveDraft(
      token,
      rawAnswers || {},
      telemetry || { blur_count: 0, paste_count: 0, time_spent_seconds: 0 }
    );

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non attiva o non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API assessment/save] Error:', err);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio della bozza' },
      { status: 500 }
    );
  }
}
