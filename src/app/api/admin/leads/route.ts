import { NextRequest, NextResponse } from 'next/server';
import { listAllLeads } from '@/lib/supabase/client';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;

  const headerKey = request.headers.get('x-admin-key');
  const urlKey = request.nextUrl.searchParams.get('key');
  return headerKey === adminSecret || urlKey === adminSecret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const leads = await listAllLeads();
    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('[API admin/leads] Error:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei lead aziendali' },
      { status: 500 }
    );
  }
}
