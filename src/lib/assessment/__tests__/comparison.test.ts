import { describe, it, expect } from 'vitest';
import { buildComparisonMatrix, exportSessionsToCSV } from '../comparison';
import { SessionWithEvaluation } from '@/lib/supabase/client';

describe('Product & Project: Candidate Comparison Engine', () => {
  const mockSessions: SessionWithEvaluation[] = [
    {
      session: {
        id: 'sess-001',
        token: 'token-001',
        candidate_name: 'Ing. Marco Bianchi',
        candidate_email: 'marco.bianchi@test.it',
        scenario_id: 'valvola-v104',
        status: 'submitted',
        started_at: '2026-10-28T10:00:00Z',
        submitted_at: '2026-10-28T10:20:00Z',
        created_at: '2026-10-28T09:50:00Z',
        raw_answers: {
          stockoutDay: 8,
          downtimeDays: 6,
          calculatedDowntimeCost: 43200,
          expeditedOrderQty: 600,
          decisionMemo: 'Priorità assoluta al contenimento del fermo linea...',
        },
        telemetry: {
          blur_count: 0,
          paste_count: 0,
          time_spent_seconds: 1200,
        },
      },
      evaluation: {
        id: 'eval-001',
        session_id: 'sess-001',
        deterministic_score: 70,
        llm_score: 28,
        total_score: 98,
        recommendation_badge: 'consigliato',
        deterministic_breakdown: {} as any,
        llm_breakdown: {} as any,
        llm_feedback: 'Ottima risposta',
        reviewer_override_score: null,
        reviewer_notes: null,
        reviewer_feedback: null,
        interview_requested_at: null,
        created_at: '2026-10-28T10:20:05Z',
      },
    },
    {
      session: {
        id: 'sess-002',
        token: 'token-002',
        candidate_name: 'Ing. Sara Rossi',
        candidate_email: 'sara.rossi@test.it',
        scenario_id: 'valvola-v104',
        status: 'submitted',
        started_at: '2026-10-28T11:00:00Z',
        submitted_at: '2026-10-28T11:24:00Z',
        created_at: '2026-10-28T10:50:00Z',
        raw_answers: {
          stockoutDay: 8,
          downtimeDays: 6,
          calculatedDowntimeCost: 43200,
          expeditedOrderQty: 800,
          decisionMemo: 'Approccio prudenziale con sovrascorta...',
        },
        telemetry: {
          blur_count: 2,
          paste_count: 1,
          time_spent_seconds: 1440,
        },
      },
      evaluation: {
        id: 'eval-002',
        session_id: 'sess-002',
        deterministic_score: 60,
        llm_score: 22,
        total_score: 82,
        recommendation_badge: 'consigliato',
        deterministic_breakdown: {} as any,
        llm_breakdown: {} as any,
        llm_feedback: 'Buona risposta',
        reviewer_override_score: null,
        reviewer_notes: null,
        reviewer_feedback: null,
        interview_requested_at: null,
        created_at: '2026-10-28T11:24:05Z',
      },
    },
  ];

  it('should build a structured comparison matrix across 9 key operational metrics', () => {
    const matrix = buildComparisonMatrix(mockSessions);
    expect(matrix.length).toBe(9);

    const scoreMetric = matrix.find((m) => m.label.includes('Punteggio Complessivo'));
    expect(scoreMetric).toBeDefined();
    expect(scoreMetric?.values[0].rawNumeric).toBe(98);
    expect(scoreMetric?.values[1].rawNumeric).toBe(82);
    expect(scoreMetric?.values[0].highlight).toBe('best');

    const blurMetric = matrix.find((m) => m.label.includes('Blur'));
    expect(blurMetric).toBeDefined();
    expect(blurMetric?.values[0].displayValue).toBe('0 (100% Permanente)');
    expect(blurMetric?.values[0].highlight).toBe('best');
  });

  it('should handle empty session list gracefully', () => {
    const emptyMatrix = buildComparisonMatrix([]);
    expect(emptyMatrix).toEqual([]);
  });

  it('should generate valid RFC-compliant CSV content for export', () => {
    const csv = exportSessionsToCSV(mockSessions);
    expect(csv).toContain('ID Sessione,Nome Candidato,Email');
    expect(csv).toContain('"Ing. Marco Bianchi"');
    expect(csv).toContain('"Ing. Sara Rossi"');
    expect(csv).toContain('98');
    expect(csv).toContain('82');

    const lines = csv.split('\r\n');
    expect(lines.length).toBe(3); // Header + 2 rows
  });
});
