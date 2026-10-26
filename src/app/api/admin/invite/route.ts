import { NextRequest, NextResponse } from 'next/server';
import { createCandidateSession } from '@/lib/supabase/client';

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
    const { candidate_name, candidate_email, scenario_id, customToken } = body;

    if (!candidate_name || typeof candidate_name !== 'string' || candidate_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome del candidato non valido o mancante (minimo 2 caratteri)' },
        { status: 400 }
      );
    }

    if (!candidate_email || typeof candidate_email !== 'string' || !candidate_email.includes('@')) {
      return NextResponse.json(
        { error: 'Email del candidato non valida' },
        { status: 400 }
      );
    }

    const session = await createCandidateSession({
      candidate_name,
      candidate_email,
      scenario_id: scenario_id || 'valvola-v104',
      customToken: customToken ? customToken.trim() : undefined,
    });

    const host = request.headers.get('host') || 'localhost:3000';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const invitationUrl = `${proto}://${host}/assessment/${encodeURIComponent(session.token)}`;

    const prewrittenMessage = `Ciao ${session.candidate_name.split(' ')[0]},\n\nTi invito a completare la simulazione pratica tecnica di SkillBridge per il ruolo Supply Chain & Operations (Scenario Valvola V-104).\n\n⏱ Durata: 25 minuti\n🔗 Link personale: ${invitationUrl}\n\nIl test misura il ragionamento su ROP e continuità operativa di linea. Buona prova!`;

    return NextResponse.json({
      success: true,
      session,
      invitationUrl,
      prewrittenMessage,
    });
  } catch (error: any) {
    console.error('[API admin/invite] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Errore durante la creazione del token di invito' },
      { status: 500 }
    );
  }
}
