import { NextRequest, NextResponse } from 'next/server';
import { createCompanyLead } from '@/lib/supabase/client';
import { dispatchFounderAlert, LeadCreatedPayload } from '@/lib/notifications/webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contact_name,
      company_name,
      email,
      phone,
      province,
      role,
      role_needed,
      estimated_ral,
      notes,
    } = body;

    if (!contact_name || typeof contact_name !== 'string' || contact_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome e cognome del referente obbligatori (minimo 2 caratteri)' },
        { status: 400 }
      );
    }

    if (!company_name || typeof company_name !== 'string' || company_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Ragione sociale / Nome azienda obbligatorio' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Indirizzo email aziendale non valido' },
        { status: 400 }
      );
    }

    const lead = await createCompanyLead({
      contact_name,
      company_name,
      email,
      phone: phone || undefined,
      province: province || undefined,
      role: role || undefined,
      role_needed: role_needed || undefined,
      estimated_ral: estimated_ral ? Number(estimated_ral) : undefined,
      notes: notes || undefined,
    });

    // Non-blocking dispatch to Founder Alert Webhook
    const alertPayload: LeadCreatedPayload = {
      event: 'lead_created',
      contact_name: lead.contact_name,
      company_name: lead.company_name,
      email: lead.email,
      phone: lead.phone,
      province: lead.province,
      role: lead.role,
      role_needed: lead.role_needed,
      estimated_ral: lead.estimated_ral,
      notes: lead.notes,
      timestamp: new Date().toISOString(),
    };

    dispatchFounderAlert(alertPayload).catch((err) => {
      console.warn('[API leads] Non-blocking alert catch:', err?.message || err);
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Richiesta ricevuta con successo. Il nostro team tecnico ti contatterà entro 4 ore.',
    });
  } catch (error: any) {
    console.error('[API leads] Error creating lead:', error);
    return NextResponse.json(
      { error: error.message || 'Errore interno durante il salvataggio della richiesta' },
      { status: 500 }
    );
  }
}
