import { SessionWithEvaluation, AssessmentSession, AssessmentEvaluation } from '@/lib/supabase/client';
import { SCENARIO_CATALOG } from './parametric';

export interface CandidateComparisonMetric {
  label: string;
  category: 'score' | 'operational' | 'integrity';
  values: Array<{
    candidateId: string;
    candidateName: string;
    displayValue: string | number;
    rawNumeric?: number;
    highlight?: 'best' | 'worst' | 'neutral';
  }>;
}

export interface CandidateComparisonData {
  sessions: SessionWithEvaluation[];
  metrics: CandidateComparisonMetric[];
}

/**
 * Prepares side-by-side comparison metrics for a list of candidate sessions.
 */
export function buildComparisonMatrix(sessions: SessionWithEvaluation[]): CandidateComparisonMetric[] {
  if (sessions.length === 0) return [];

  const metrics: CandidateComparisonMetric[] = [];

  // 1. Total Score
  const totalScores = sessions.map(({ session, evaluation }) => {
    const score =
      evaluation?.reviewer_override_score !== null && evaluation?.reviewer_override_score !== undefined
        ? evaluation.reviewer_override_score
        : evaluation?.total_score ?? 0;
    return { candidateId: session.id, candidateName: session.candidate_name, score };
  });
  const maxScore = Math.max(...totalScores.map((t) => t.score));

  metrics.push({
    label: 'Punteggio Complessivo (su 100)',
    category: 'score',
    values: totalScores.map((t) => ({
      candidateId: t.candidateId,
      candidateName: t.candidateName,
      displayValue: `${t.score} / 100`,
      rawNumeric: t.score,
      highlight: t.score === maxScore && t.score > 0 ? 'best' : 'neutral',
    })),
  });

  // 2. Deterministic Score (out of 70)
  metrics.push({
    label: 'Punteggio Calcoli Tecnici (su 70)',
    category: 'score',
    values: sessions.map(({ session, evaluation }) => ({
      candidateId: session.id,
      candidateName: session.candidate_name,
      displayValue: `${evaluation?.deterministic_score ?? 0} / 70`,
      rawNumeric: evaluation?.deterministic_score ?? 0,
    })),
  });

  // 3. Semantic / Memo Score (out of 30)
  metrics.push({
    label: 'Valutazione Memoria Decisionale (su 30)',
    category: 'score',
    values: sessions.map(({ session, evaluation }) => ({
      candidateId: session.id,
      candidateName: session.candidate_name,
      displayValue: `${evaluation?.llm_score ?? 0} / 30`,
      rawNumeric: evaluation?.llm_score ?? 0,
    })),
  });

  // 4. Time Spent
  const times = sessions.map(({ session }) => ({
    candidateId: session.id,
    candidateName: session.candidate_name,
    seconds: session.telemetry?.time_spent_seconds ?? 0,
  }));
  const validTimes = times.filter((t) => t.seconds > 0);
  const minTime = validTimes.length > 0 ? Math.min(...validTimes.map((t) => t.seconds)) : 0;

  metrics.push({
    label: 'Tempo Impiegato (max 25 min)',
    category: 'operational',
    values: times.map((t) => ({
      candidateId: t.candidateId,
      candidateName: t.candidateName,
      displayValue: `${Math.floor(t.seconds / 60)}m ${String(t.seconds % 60).padStart(2, '0')}s`,
      rawNumeric: t.seconds,
      highlight: t.seconds === minTime && t.seconds > 0 ? 'best' : 'neutral',
    })),
  });

  // 5. Stockout Day Calculated
  metrics.push({
    label: 'Giorno di Stockout Previsto',
    category: 'operational',
    values: sessions.map(({ session }) => ({
      candidateId: session.id,
      candidateName: session.candidate_name,
      displayValue: session.raw_answers?.stockoutDay !== undefined ? `Giorno ${session.raw_answers.stockoutDay}` : 'N/D',
    })),
  });

  // 6. Downtime Cost Calculated
  metrics.push({
    label: 'Costo Fermo Linea Calcolato',
    category: 'operational',
    values: sessions.map(({ session }) => {
      const val = session.raw_answers?.calculatedDowntimeCost;
      return {
        candidateId: session.id,
        candidateName: session.candidate_name,
        displayValue: val !== undefined ? `€ ${Number(val).toLocaleString('it-IT')}` : 'N/D',
      };
    }),
  });

  // 7. Reorder Quantity Ordered
  metrics.push({
    label: 'Quantità di Riordino Ordinata',
    category: 'operational',
    values: sessions.map(({ session }) => ({
      candidateId: session.id,
      candidateName: session.candidate_name,
      displayValue: session.raw_answers?.expeditedOrderQty !== undefined ? `${session.raw_answers.expeditedOrderQty} pz` : 'N/D',
    })),
  });

  // 8. Proctoring & Focus Defocus Count
  metrics.push({
    label: 'Eventi Focus / Blur Finestra',
    category: 'integrity',
    values: sessions.map(({ session }) => {
      const blurs = session.telemetry?.blur_count ?? 0;
      return {
        candidateId: session.id,
        candidateName: session.candidate_name,
        displayValue: blurs === 0 ? '0 (100% Permanente)' : `${blurs} uscite`,
        highlight: blurs === 0 ? 'best' : blurs > 3 ? 'worst' : 'neutral',
      };
    }),
  });

  // 9. Anti-Cheat Paste Attempts Blocked
  metrics.push({
    label: 'Tentativi Incolla Bloccati',
    category: 'integrity',
    values: sessions.map(({ session }) => {
      const pastes = session.telemetry?.paste_count ?? 0;
      return {
        candidateId: session.id,
        candidateName: session.candidate_name,
        displayValue: `${pastes} intercettati`,
        highlight: pastes === 0 ? 'best' : 'neutral',
      };
    }),
  });

  return metrics;
}

/**
 * Generates formatted CSV content from candidate sessions for export.
 */
export function exportSessionsToCSV(sessions: SessionWithEvaluation[]): string {
  const headers = [
    'ID Sessione',
    'Nome Candidato',
    'Email',
    'Scenario',
    'Stato',
    'Punteggio Totale',
    'Punteggio Deterministico',
    'Punteggio Semantico',
    'Raccomandazione',
    'Tempo (secondi)',
    'Uscite Finestra (Blur)',
    'Incolla Bloccati',
    'Data Creazione',
  ];

  const rows = sessions.map(({ session, evaluation }) => {
    const sc = SCENARIO_CATALOG.find((s) => s.id === session.scenario_id);
    const totalScore =
      evaluation?.reviewer_override_score !== null && evaluation?.reviewer_override_score !== undefined
        ? evaluation.reviewer_override_score
        : evaluation?.total_score ?? '';

    return [
      `"${session.id}"`,
      `"${session.candidate_name.replace(/"/g, '""')}"`,
      `"${session.candidate_email.replace(/"/g, '""')}"`,
      `"${sc?.title ? sc.title.replace(/"/g, '""') : session.scenario_id}"`,
      `"${session.status}"`,
      totalScore,
      evaluation?.deterministic_score ?? '',
      evaluation?.llm_score ?? '',
      `"${evaluation?.recommendation_badge ?? 'in_valutazione'}"`,
      session.telemetry?.time_spent_seconds ?? 0,
      session.telemetry?.blur_count ?? 0,
      session.telemetry?.paste_count ?? 0,
      `"${session.created_at}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}
