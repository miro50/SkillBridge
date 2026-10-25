import { describe, it, expect, vi } from 'vitest';
import {
  dispatchFounderAlert,
  formatWebhookBody,
  type AssessmentCompletedPayload,
  type InterviewRequestedPayload,
} from '../webhook';

describe('Founder Alert Webhook Service (T6)', () => {
  const completedPayload: AssessmentCompletedPayload = {
    event: 'assessment_completed',
    candidate_name: 'Marco Rossi',
    candidate_email: 'marco.rossi@polimi.it',
    score: 88,
    badge: 'consigliato',
    deterministic_score: 65,
    llm_score: 23,
    scorecard_url: 'http://localhost:3000/scorecard/uuid-1234',
    timestamp: '2026-10-25T19:00:00Z',
  };

  const interviewPayload: InterviewRequestedPayload = {
    event: 'interview_requested',
    candidate_name: 'Marco Rossi',
    candidate_email: 'marco.rossi@polimi.it',
    scorecard_id: 'uuid-1234',
    total_score: 88,
    badge: 'consigliato',
    notes: 'Disponibile giovedì ore 10:00',
    scorecard_url: 'http://localhost:3000/scorecard/uuid-1234',
    timestamp: '2026-10-25T19:05:00Z',
  };

  it('formats raw payload for generic webhooks', () => {
    const formatted = formatWebhookBody(completedPayload, 'https://example.com/api/webhook');
    expect(formatted).toEqual(completedPayload);
  });

  it('formats rich Discord embed when targeting a Discord webhook URL', () => {
    const formatted = formatWebhookBody(
      completedPayload,
      'https://discord.com/api/webhooks/12345/abcdef'
    );
    expect(formatted.content).toContain('Nuova Valutazione Completata');
    expect((formatted.embeds as any[])[0].title).toContain('Marco Rossi (88/100)');
    expect((formatted.embeds as any[])[0].color).toBe(0x10b981); // Emerald for 'consigliato'
  });

  it('formats interview request embed with notes for Discord', () => {
    const formatted = formatWebhookBody(
      interviewPayload,
      'https://discord.com/api/webhooks/12345/abcdef'
    );
    expect(formatted.content).toContain('Richiesta Colloquio');
    expect((formatted.embeds as any[])[0].title).toContain('Marco Rossi');
    expect((formatted.embeds as any[])[0].fields[1].value).toBe('Disponibile giovedì ore 10:00');
  });

  it('safely skips dispatch in <1ms without network call when webhook URL is missing', async () => {
    const mockFetch = vi.fn();
    const result = await dispatchFounderAlert(completedPayload, {
      webhookUrl: '',
      fetchFn: mockFetch as any,
    });

    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('successfully delivers webhook when endpoint returns HTTP 200', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await dispatchFounderAlert(completedPayload, {
      webhookUrl: 'https://webhook.example.com/alert',
      fetchFn: mockFetch as any,
    });

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://webhook.example.com/alert',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('never throws even when webhook network call fails or throws error', async () => {
    const mockLaggingFetch = vi.fn().mockRejectedValue(new Error('DNS resolution failed or network offline'));

    const result = await dispatchFounderAlert(completedPayload, {
      webhookUrl: 'https://broken.webhook.endpoint/fail',
      fetchFn: mockLaggingFetch as any,
    });

    expect(result).toBe(false);
  });

  it('never blocks or throws when webhook endpoint times out', async () => {
    const mockHangingFetch = vi.fn().mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 200);
        })
    );

    const result = await dispatchFounderAlert(completedPayload, {
      webhookUrl: 'https://hanging.webhook.endpoint',
      timeoutMs: 50,
      fetchFn: mockHangingFetch as any,
    });

    expect(result).toBe(false);
  });
});
