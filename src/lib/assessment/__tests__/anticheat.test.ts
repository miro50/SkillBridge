import { describe, it, expect, beforeEach } from 'vitest';
import {
  inMemoryStore,
  saveDraft,
  submitSession,
  type AssessmentSession,
  type SessionTelemetry,
} from '../../supabase/client';

describe('Anti-Cheat Telemetry & Proctoring Integrity (T7)', () => {
  const token = 'test-token-anticheat-99';
  const sessionId = 'session-uuid-anticheat-99';

  beforeEach(() => {
    inMemoryStore.clear();

    const initialSession: AssessmentSession = {
      id: sessionId,
      token,
      candidate_name: 'Alessandro Volta',
      candidate_email: 'a.volta@unipv.it',
      scenario_id: 'valvola-v104',
      status: 'in_progress',
      started_at: new Date().toISOString(),
      submitted_at: null,
      telemetry: {
        blur_count: 0,
        paste_count: 0,
        time_spent_seconds: 120,
        copy_count: 0,
        cut_count: 0,
        screenshot_count: 0,
        devtools_count: 0,
        webcam_verified: true,
        proctoring_active: true,
        proctoring_snapshots_count: 4,
      },
      raw_answers: null,
      created_at: new Date().toISOString(),
    };

    inMemoryStore.sessions.set(sessionId, initialSession);
  });

  it('1. saveDraft correctly updates anti-cheat telemetry metrics in database/store', async () => {
    const updatedTelemetry: SessionTelemetry = {
      blur_count: 1,
      paste_count: 2,
      copy_count: 3,
      cut_count: 0,
      screenshot_count: 1,
      devtools_count: 1,
      webcam_verified: true,
      proctoring_active: true,
      proctoring_snapshots_count: 8,
      time_spent_seconds: 360,
    };

    const saved = await saveDraft(
      token,
      { stockoutDay: 9, downtimeDays: 5, expeditedOrderQty: 200 },
      updatedTelemetry
    );

    expect(saved).not.toBeNull();
    expect(saved?.telemetry.blur_count).toBe(1);
    expect(saved?.telemetry.paste_count).toBe(2);
    expect(saved?.telemetry.copy_count).toBe(3);
    expect(saved?.telemetry.screenshot_count).toBe(1);
    expect(saved?.telemetry.devtools_count).toBe(1);
    expect(saved?.telemetry.webcam_verified).toBe(true);
    expect(saved?.telemetry.proctoring_snapshots_count).toBe(8);
  });

  it('2. submitSession locks session and preserves all proctoring telemetry', async () => {
    const finalTelemetry: SessionTelemetry = {
      blur_count: 0,
      paste_count: 0,
      copy_count: 0,
      cut_count: 0,
      screenshot_count: 0,
      devtools_count: 0,
      webcam_verified: true,
      proctoring_active: true,
      proctoring_snapshots_count: 25,
      time_spent_seconds: 1450,
    };

    const submitted = await submitSession(
      token,
      {
        stockoutDay: 9,
        downtimeDays: 5,
        expeditedOrderQty: 200,
        decisionMemo: 'Memo esplicativa completa con analisi trade-off costi fermo...',
      },
      finalTelemetry
    );

    expect(submitted?.status).toBe('submitted');
    expect(submitted?.submitted_at).toBeDefined();
    expect(submitted?.telemetry.copy_count).toBe(0);
    expect(submitted?.telemetry.screenshot_count).toBe(0);
    expect(submitted?.telemetry.webcam_verified).toBe(true);
    expect(submitted?.telemetry.proctoring_snapshots_count).toBe(25);
  });

  it('3. Computes 100% integrity score when zero cheat infractions occur', () => {
    const telemetry: SessionTelemetry = {
      blur_count: 0,
      paste_count: 0,
      copy_count: 0,
      screenshot_count: 0,
      devtools_count: 0,
      time_spent_seconds: 900,
      webcam_verified: true,
    };

    const penalty =
      (telemetry.blur_count || 0) * 3 +
      (telemetry.paste_count || 0) * 5 +
      ((telemetry.copy_count as number) || 0) * 5 +
      ((telemetry.screenshot_count as number) || 0) * 10 +
      ((telemetry.devtools_count as number) || 0) * 10;

    const integrity = Math.max(35, Math.min(100, 100 - penalty));
    expect(integrity).toBe(100);
  });

  it('4. Applies graduated penalties for blur, paste, copy, screenshot and devtools violations', () => {
    const telemetry: SessionTelemetry = {
      blur_count: 2, // 2 * 3 = 6
      paste_count: 1, // 1 * 5 = 5
      copy_count: 2, // 2 * 5 = 10
      screenshot_count: 1, // 1 * 10 = 10
      devtools_count: 1, // 1 * 10 = 10
      time_spent_seconds: 1100,
      webcam_verified: true,
    };

    const penalty =
      (telemetry.blur_count || 0) * 3 +
      (telemetry.paste_count || 0) * 5 +
      ((telemetry.copy_count as number) || 0) * 5 +
      ((telemetry.screenshot_count as number) || 0) * 10 +
      ((telemetry.devtools_count as number) || 0) * 10;

    // Total penalty: 6 + 5 + 10 + 10 + 10 = 41
    const integrity = Math.max(35, Math.min(100, 100 - penalty));
    expect(penalty).toBe(41);
    expect(integrity).toBe(59);
  });
});
