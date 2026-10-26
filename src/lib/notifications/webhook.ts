/**
 * SkillBridge Founder Alert Webhook Service (T6)
 *
 * Provides non-blocking, isolated dispatch of notifications to the founder
 * upon candidate test completion and Plant Director interview requests.
 */

export interface AssessmentCompletedPayload {
  event: 'assessment_completed';
  candidate_name: string;
  candidate_email: string;
  score: number;
  badge: 'consigliato' | 'riserva' | 'non_idoneo';
  deterministic_score: number;
  llm_score: number;
  scorecard_url: string;
  timestamp: string;
}

export interface InterviewRequestedPayload {
  event: 'interview_requested';
  candidate_name: string;
  candidate_email: string;
  scorecard_id: string;
  total_score: number;
  badge: 'consigliato' | 'riserva' | 'non_idoneo';
  notes: string | null;
  scorecard_url: string;
  timestamp: string;
}

export interface LeadCreatedPayload {
  event: 'lead_created';
  contact_name: string;
  company_name: string;
  email: string;
  phone?: string;
  province?: string;
  role?: string;
  role_needed?: string;
  estimated_ral?: number;
  notes?: string;
  timestamp: string;
}

export type FounderAlertPayload =
  | AssessmentCompletedPayload
  | InterviewRequestedPayload
  | LeadCreatedPayload;

export interface DispatchOptions {
  webhookUrl?: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

/**
 * Returns formatted Discord embed payload if the target URL is Discord,
 * otherwise returns standard JSON object.
 */
export function formatWebhookBody(payload: FounderAlertPayload, targetUrl: string): Record<string, unknown> {
  const isDiscord = targetUrl.includes('discord.com/api/webhooks');

  if (!isDiscord) {
    return payload as unknown as Record<string, unknown>;
  }

  // Discord Rich Embed formatting
  if (payload.event === 'assessment_completed') {
    const color =
      payload.badge === 'consigliato'
        ? 0x10b981 // Emerald
        : payload.badge === 'riserva'
        ? 0xf59e0b // Amber
        : 0xef4444; // Red

    return {
      content: `🎯 **Nuova Valutazione Completata** — SkillBridge`,
      embeds: [
        {
          title: `${payload.candidate_name} (${payload.score}/100)`,
          description: `Il candidato ha completato lo scenario *Valvola V-104*.\n**Raccomandazione:** \`${payload.badge.toUpperCase()}\``,
          color,
          fields: [
            {
              name: 'Deterministico (70 pt)',
              value: `${payload.deterministic_score} pt`,
              inline: true,
            },
            {
              name: 'Semantico AI (30 pt)',
              value: `${payload.llm_score} pt`,
              inline: true,
            },
            {
              name: 'Scorecard Esecutiva',
              value: `[Visualizza Report](${payload.scorecard_url})`,
              inline: false,
            },
          ],
          footer: { text: `SkillBridge Alert System • ${payload.timestamp}` },
        },
      ],
    };
  }

  if (payload.event === 'lead_created') {
    return {
      content: `🏭 **Nuova Richiesta Candidati B2B (Programma Pilota 11%)!**`,
      embeds: [
        {
          title: `${payload.company_name} — Richiesta Profili Pre-Testati`,
          description: `Un Direttore di Stabilimento o Responsabile HR ha richiesto candidati con garanzia 90 giorni.`,
          color: 0x2563eb, // Industrial Blue
          fields: [
            {
              name: 'Contatto & Ruolo',
              value: `${payload.contact_name} (${payload.role || 'Non specificato'})`,
              inline: true,
            },
            {
              name: 'Azienda & Provincia',
              value: `${payload.company_name} (${payload.province || 'N.D.'})`,
              inline: true,
            },
            {
              name: 'Email & Telefono',
              value: `${payload.email} • ${payload.phone || 'N.D.'}`,
              inline: false,
            },
            {
              name: 'Profilo Ricercato & RAL',
              value: `${payload.role_needed || 'Supply Chain / Operations'} • RAL ~${payload.estimated_ral ? payload.estimated_ral.toLocaleString('it-IT') + ' €' : 'N.D.'}`,
              inline: false,
            },
            {
              name: 'Note Aziendali',
              value: payload.notes || 'Nessuna nota specificata',
              inline: false,
            },
          ],
          footer: { text: `SkillBridge Inbound B2B • ${payload.timestamp}` },
        },
      ],
    };
  }

  // payload.event === 'interview_requested'
  return {
    content: `🤝 **Richiesta Colloquio dal Plant Director!**`,
    embeds: [
      {
        title: `Colloquio per: ${payload.candidate_name}`,
        description: `Un Plant Director ha richiesto un colloquio conoscitivo di 20 minuti per questo candidato.`,
        color: 0x2563eb, // Blue
        fields: [
          {
            name: 'Punteggio Candidato',
            value: `${payload.total_score}/100 (${payload.badge})`,
            inline: true,
          },
          {
            name: 'Note Orarie Plant Director',
            value: payload.notes || 'Nessuna preferenza oraria specificata',
            inline: false,
          },
          {
            name: 'Scorecard',
            value: `[Apri Scorecard](${payload.scorecard_url})`,
            inline: false,
          },
        ],
        footer: { text: `SkillBridge Conversion Engine • ${payload.timestamp}` },
      },
    ],
  };
}

/**
 * Non-blocking founder notification dispatcher.
 * Guaranteed to never throw or block the caller. Returns true on delivery, false on failure or skipped.
 */
export async function dispatchFounderAlert(
  payload: FounderAlertPayload,
  options: DispatchOptions = {}
): Promise<boolean> {
  const webhookUrl =
    options.webhookUrl ??
    process.env.FOUNDER_ALERT_WEBHOOK_URL ??
    process.env.FOUNDER_WEBHOOK_URL;
  const timeoutMs = options.timeoutMs ?? 2500;
  const fetchImpl = options.fetchFn ?? fetch;

  if (!webhookUrl) {
    // Webhook not configured; safe silent return without network call
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formattedBody = formatWebhookBody(payload, webhookUrl);

    const res = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedBody),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[FounderWebhook] Webhook endpoint responded with status ${res.status}`);
      return false;
    }

    return true;
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`[FounderWebhook] Non-blocking dispatch failed (isolated catch):`, err?.message || err);
    return false;
  }
}
