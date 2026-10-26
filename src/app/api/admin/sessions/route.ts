import { NextRequest, NextResponse } from 'next/server';
import { listAllSessions } from '@/lib/supabase/client';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true; // Open access in dev/local environment

  const headerKey = request.headers.get('x-admin-key');
  const urlKey = request.nextUrl.searchParams.get('key');
  return headerKey === adminSecret || urlKey === adminSecret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const sessions = await listAllSessions();
    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('[API admin/sessions] Error:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle sessioni' },
      { status: 500 }
    );
  }
}
