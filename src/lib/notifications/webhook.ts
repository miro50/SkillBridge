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

export type FounderAlertPayload = AssessmentCompletedPayload | InterviewRequestedPayload;

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
  const webhookUrl = options.webhookUrl ?? process.env.FOUNDER_WEBHOOK_URL;
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
