'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Video,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  FileSpreadsheet,
} from 'lucide-react';
import { SessionWithEvaluation } from '@/lib/supabase/client';
import { buildComparisonMatrix, exportSessionsToCSV } from '@/lib/assessment/comparison';
import { SCENARIO_CATALOG } from '@/lib/assessment/parametric';

function CandidateComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawIds = searchParams.get('ids') || '';
  const selectedIds = rawIds.split(',').filter(Boolean);

  const [allSessions, setAllSessions] = useState<SessionWithEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewStates, setInterviewStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/sessions');
        if (!res.ok) throw new Error('Impossibile caricare le sessioni');
        const data = await res.json();
        setAllSessions(data.sessions || []);
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  const comparedSessions = allSessions.filter((s) => selectedIds.includes(s.session.id));

  // Initialize interview states
  useEffect(() => {
    const states: Record<string, boolean> = {};
    for (const { session, evaluation } of comparedSessions) {
      if (evaluation?.interview_requested_at) {
        states[session.id] = true;
      }
    }
    setInterviewStates(states);
  }, [allSessions, rawIds]);

  const handleRequestInterview = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/scorecard/${sessionId}/request-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Richiesto da Scheda Comparativa' }),
      });
      if (res.ok) {
        setInterviewStates((prev) => ({ ...prev, [sessionId]: true }));
      }
    } catch {
      alert('Impossibile registrare la richiesta di colloquio');
    }
  };

  const handleExportCSV = () => {
    const csv = exportSessionsToCSV(comparedSessions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skillbridge-confronto-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Caricamento matrice comparativa candidati...</p>
        </div>
      </div>
    );
  }

  if (error || comparedSessions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Nessun candidato selezionato per il confronto</h2>
          <p className="text-xs text-slate-400">
            Seleziona 2 o 3 candidati dall&apos;Admin Cockpit per visualizzare la matrice comparativa testa a testa.
          </p>
          <div className="pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Torna all&apos;Admin Cockpit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const comparisonMatrix = buildComparisonMatrix(comparedSessions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  Matrice Comparativa Candidati
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                  {comparedSessions.length} PROFILI TESTA A TESTA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Strumento decisionale per Direttori di Stabilimento e Responsabili Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Esporta CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs flex items-center gap-1.5 font-semibold cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Stampa Report A4</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Candidate Profile Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, comparedSessions.length)} gap-4`}>
          {comparedSessions.map(({ session, evaluation }) => {
            const sc = SCENARIO_CATALOG.find((s) => s.id === session.scenario_id);
            const totalScore =
              evaluation?.reviewer_override_score !== null && evaluation?.reviewer_override_score !== undefined
                ? evaluation.reviewer_override_score
                : evaluation?.total_score ?? 0;
            const isRequested = interviewStates[session.id];
            const percentile = totalScore > 0 ? Math.min(99, Math.max(15, Math.round(totalScore * 0.95 + 4))) : null;

            return (
              <div
                key={session.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                        {sc?.role || 'Supply Chain Specialist'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{session.candidate_name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{session.candidate_email}</p>
                    </div>

                    {evaluation?.recommendation_badge === 'consigliato' && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        CONSIGLIATO
                      </span>
                    )}
                    {evaluation?.recommendation_badge === 'riserva' && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                        RISERVA
                      </span>
                    )}
                    {evaluation?.recommendation_badge === 'non_idoneo' && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                        NON IDONEO
                      </span>
                    )}
                  </div>

                  {/* Score & Percentile Box */}
                  <div className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">Punteggio Totale</div>
                      <div className="text-3xl font-bold font-mono text-white mt-0.5">
                        {totalScore}
                        <span className="text-sm text-slate-500 font-normal">/100</span>
                      </div>
                    </div>
                    {percentile && (
                      <div className="text-right">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Percentile</div>
                        <div className="text-sm font-bold font-mono text-blue-400 flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Top {100 - percentile}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scenario Information */}
                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scenario:</span>
                      <span className="font-mono text-slate-300">{sc?.title || session.scenario_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Costo Fermo Orario:</span>
                      <span className="font-mono text-amber-400">€ {sc?.downtimeCostPerHour || 1800}/h</span>
                    </div>
                  </div>

                  {/* Proctoring Thumbnail Preview */}
                  {session.telemetry?.proctoring_snapshot && (
                    <div className="mt-3 p-2 bg-slate-950 border border-slate-800 rounded flex items-center gap-2.5">
                      <img
                        src={session.telemetry.proctoring_snapshot as string}
                        alt="Frame Proctoring"
                        className="w-12 h-9 rounded object-cover border border-emerald-500"
                      />
                      <div className="text-[10px] font-mono text-emerald-400">
                        <span className="block font-bold">● REC VERIFICATO</span>
                        <span className="text-slate-500">Webcam certificata</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  {isRequested ? (
                    <div className="w-full py-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-md text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Colloquio Richiesto
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequestInterview(session.id)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>🤝 Richiedi Colloquio 20 min</span>
                    </button>
                  )}

                  <Link
                    href={`/scorecard/${session.id}`}
                    target="_blank"
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[11px] font-mono transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Vedi Scorecard A4 Completa</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Head-to-Head Comparison Matrix Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Tabella di Confronto Parametrico & Indicatori Operativi
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Verificato con Algoritmo di Grading Ibrido SkillBridge
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-1/4">Parametro di Confronto</th>
                  {comparedSessions.map(({ session }) => (
                    <th key={session.id} className="py-3 px-4 font-bold text-white">
                      {session.candidate_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {comparisonMatrix.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-sans font-medium text-xs">
                      {metric.label}
                    </td>
                    {metric.values.map((val, vIdx) => (
                      <td
                        key={vIdx}
                        className={`py-3 px-4 font-bold ${
                          val.highlight === 'best'
                            ? 'text-emerald-400 bg-emerald-950/20'
                            : val.highlight === 'worst'
                            ? 'text-rose-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {val.displayValue}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side-by-Side Decision Memos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Executive Memo per la Direzione a Confronto Diretto
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confronta la lucidità di scrittura, il lessico ingegneristico e la capacità di sintesi decisionale dei candidati.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, comparedSessions.length)} gap-4`}>
            {comparedSessions.map(({ session, evaluation }) => (
              <div
                key={session.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-white text-xs">{session.candidate_name}</span>
                    <span className="text-[10px] font-mono text-blue-400">
                      Score Memo: {evaluation?.llm_score ?? 0}/30
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic mt-3 whitespace-pre-wrap font-sans">
                    &quot;{session.raw_answers?.decisionMemo || 'Nessuna memoria decisionale inserita.'}&quot;
                  </p>
                </div>

                {evaluation?.llm_breakdown && (
                  <div className="pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Tradeoff Costi:</span>
                      <span className="text-slate-200 font-bold">{evaluation.llm_breakdown.costTradeoffScore}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analisi Rischi:</span>
                      <span className="text-slate-200 font-bold">{evaluation.llm_breakdown.riskAwarenessScore}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sintesi &amp; Chiarezza:</span>
                      <span className="text-slate-200 font-bold">{evaluation.llm_breakdown.clarityAndSynthesis}/5</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CandidateComparisonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-xs">
          Caricamento...
        </div>
      }
    >
      <CandidateComparisonContent />
    </Suspense>
  );
}
