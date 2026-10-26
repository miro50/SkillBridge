import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  inMemoryStore,
  createCompanyLead,
  listAllLeads,
} from '../../supabase/client';
import { POST as createLeadRoute } from '../../../app/api/leads/route';
import { GET as getAdminLeadsRoute } from '../../../app/api/admin/leads/route';
import { formatWebhookBody, LeadCreatedPayload } from '../../notifications/webhook';
import { NextRequest } from 'next/server';

describe('B2B Company Leads & Marketing Inbound (Option 2)', () => {
  beforeEach(() => {
    inMemoryStore.clear();
  });

  it('1. createCompanyLead stores lead with UUID and sanitized email', async () => {
    const lead = await createCompanyLead({
      contact_name: ' Ing. Mario Rossi ',
      company_name: ' Meccanica Bresciana S.p.A. ',
      email: ' MARIO.ROSSI@MECCANICA.IT ',
      province: 'Brescia',
      role: 'Direttore di Stabilimento',
      role_needed: 'Pianificatore della Produzione',
      estimated_ral: 32000,
      notes: 'Urgenza commessa Q4',
    });

    expect(lead.id).toBeDefined();
    expect(lead.contact_name).toBe('Ing. Mario Rossi');
    expect(lead.company_name).toBe('Meccanica Bresciana S.p.A.');
    expect(lead.email).toBe('mario.rossi@meccanica.it');
    expect(lead.estimated_ral).toBe(32000);

    const list = await listAllLeads();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(lead.id);
  });

  it('2. POST /api/leads rejects requests with missing or invalid fields', async () => {
    const invalidBody = {
      contact_name: 'A', // too short
      company_name: '',
      email: 'invalid-email',
    };

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });

    const res = await createLeadRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('3. POST /api/leads creates lead and returns success 200 with leadId', async () => {
    const validBody = {
      contact_name: 'Dr. Marco Galli',
      company_name: 'Packaging Tech Bologna S.r.l.',
      email: 'm.galli@packtech.it',
      phone: '+39 335 9876543',
      province: 'Bologna',
      role: 'Operations Manager',
      role_needed: 'Supply Chain Specialist',
      estimated_ral: 30000,
      notes: 'Valutazione piloti con garanzia 90 giorni',
    };

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });

    const res = await createLeadRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.leadId).toBeDefined();

    const storedLeads = await listAllLeads();
    expect(storedLeads.length).toBe(1);
    expect(storedLeads[0].company_name).toBe('Packaging Tech Bologna S.r.l.');
  });

  it('4. GET /api/admin/leads returns list of inbound leads', async () => {
    await createCompanyLead({
      contact_name: 'Ing. Laura Verdi',
      company_name: 'Officine Meccaniche Modena',
      email: 'l.verdi@om-modena.it',
      province: 'Modena',
    });

    const req = new NextRequest('http://localhost:3000/api/admin/leads');
    const res = await getAdminLeadsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.leads).toBeDefined();
    expect(data.leads.length).toBe(1);
    expect(data.leads[0].company_name).toBe('Officine Meccaniche Modena');
  });

  it('5. formatWebhookBody formats lead_created payload into rich Discord embed', () => {
    const payload: LeadCreatedPayload = {
      event: 'lead_created',
      contact_name: 'Ing. Mario Rossi',
      company_name: 'Fonderie Meccaniche S.p.A.',
      email: 'm.rossi@fonderie.it',
      phone: '030 123456',
      province: 'Brescia',
      role: 'Plant Director',
      role_needed: 'Pianificatore Produzione',
      estimated_ral: 34000,
      notes: 'Contattare al mattino',
      timestamp: '2026-10-26T14:00:00Z',
    };

    const discordBody = formatWebhookBody(
      payload,
      'https://discord.com/api/webhooks/123/xyz'
    ) as any;

    expect(discordBody.content).toContain('Nuova Richiesta Candidati B2B');
    expect(discordBody.embeds).toBeDefined();
    expect(discordBody.embeds[0].title).toContain('Fonderie Meccaniche S.p.A.');
    expect(discordBody.embeds[0].color).toBe(0x2563eb);
    expect(discordBody.embeds[0].fields.length).toBe(5);
  });
});
