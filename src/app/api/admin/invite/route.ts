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

    const scenarioDescriptions: Record<string, { role: string; name: string; focus: string }> = {
      'valvola-v104': {
        role: 'Supply Chain & Operations Specialist',
        name: 'Valvola V-104',
        focus: 'ragionamento su ROP e continuità operativa di linea',
      },
      'packaging-p200': {
        role: 'Production Planner & MRP Specialist',
        name: 'Packaging P-200',
        focus: 'gestione dei colli di bottiglia e schedulazione commesse MRP',
      },
      'scheda-e501': {
        role: 'Buyer Tecnico & Procurement Specialist',
        name: 'Scheda E-501',
        focus: 'valutazione del mercato spot e gestione dei rischi di approvvigionamento',
      },
    };

    const scMeta = scenarioDescriptions[session.scenario_id] || scenarioDescriptions['valvola-v104'];

    const prewrittenMessage = `Ciao ${session.candidate_name.split(' ')[0]},\n\nTi invito a completare la simulazione pratica tecnica di SkillBridge per il ruolo ${scMeta.role} (Scenario ${scMeta.name}).\n\n⏱ Durata: 25 minuti\n🔗 Link personale: ${invitationUrl}\n\nIl test misura il tuo ${scMeta.focus}. Buona prova!`;

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
