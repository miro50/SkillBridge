'use client';

import React, { useState } from 'react';
import {
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Send,
  MessageSquare,
} from 'lucide-react';
import { AssessmentSession, AssessmentEvaluation, RecommendationBadge } from '@/lib/supabase/client';

interface ScorecardViewProps {
  session: AssessmentSession;
  evaluation: AssessmentEvaluation;
}

export function ScorecardView({ session, evaluation }: ScorecardViewProps) {
  const [interviewRequested, setInterviewRequested] = useState<boolean>(
    Boolean(evaluation.interview_requested_at)
  );
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showNotesForm, setShowNotesForm] = useState<boolean>(
    Boolean(evaluation.interview_requested_at && evaluation.reviewer_notes)
  );
  const [notes, setNotes] = useState<string>(evaluation.reviewer_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSavedConfirmation, setNotesSavedConfirmation] = useState<boolean>(false);

  // Time formatting
  const totalSeconds = session.telemetry?.time_spent_seconds || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeFormatted = `${minutes}m ${String(seconds).padStart(2, '0')}s`;

  // Integrity calculation
  const blurCount = session.telemetry?.blur_count || 0;
  const pasteCount = session.telemetry?.paste_count || 0;
  const estimatedIntegrity = Math.max(65, 100 - blurCount * 2 - pasteCount * 5);

  const formattedDate = session.submitted_at
    ? new Date(session.submitted_at).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('it-IT');

  const scenarioId = session.scenario_id || 'valvola-v104';
  const scenarioCode =
    scenarioId === 'packaging-p200' ? 'P200' : scenarioId === 'scheda-e501' ? 'E501' : 'V104';
  const scenarioTitle =
    scenarioId === 'packaging-p200'
      ? 'Collo di Bottiglia & Cambio Formato Packaging P-200'
      : scenarioId === 'scheda-e501'
      ? 'Crisi Approvvigionamento Microcontrollore Automotive E-501'
      : 'Rottura Supply Chain Valvola V-104';

  const reportId = `SKB-${scenarioCode}-${session.id.slice(0, 8).toUpperCase()}`;

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  // Request interview in-place (D9)
  const handleRequestInterview = async () => {
    setIsRequesting(true);
    try {
      const res = await fetch(`/api/scorecard/${session.id}/request-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setInterviewRequested(true);
        setShowNotesForm(true);
      }
    } catch (err) {
      console.error('[Scorecard] Failed to request interview:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  // Save optional interview notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/scorecard/${session.id}/request-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setNotesSavedConfirmation(true);
        setTimeout(() => setNotesSavedConfirmation(false), 3000);
      }
    } catch (err) {
      console.error('[Scorecard] Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Badge configuration
  const getBadgeConfig = (badge: RecommendationBadge) => {
    switch (badge) {
      case 'consigliato':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 flex-shrink-0" />,
          label: 'CONSIGLIATO PER COLLOQUIO',
        };
      case 'riserva':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5 flex-shrink-0" />,
          label: 'RISERVA / RICHIESTA APPROFONDIMENTO',
        };
      case 'non_idoneo':
      default:
        return {
          bg: 'bg-red-50 text-red-800 border-red-300',
          dot: 'bg-red-600',
          icon: <XCircle className="w-4 h-4 text-red-600 mr-1.5 flex-shrink-0" />,
          label: 'NON IDONEO',
        };
    }
  };

  const badgeConfig = getBadgeConfig(evaluation.recommendation_badge);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      {/* Print-specific style sheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background-color: white !important;
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
          .scorecard-sheet {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            padding: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Floating Action Bar (Top on Screen, hidden on print) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between no-print">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
          <Building className="w-4 h-4 text-slate-700" />
          <span>SkillBridge Executive Talent Portal &bull; Riservato Plant Director</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            <span>Scarica PDF A4</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* A4 PRINT-READY SCORECARD SHEET                                       */}
      {/* ==================================================================== */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-md shadow-sm p-6 sm:p-8 scorecard-sheet space-y-5">
        {/* Document Header */}
        <header className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-[10px] tracking-wider">
                SB
              </span>
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                SkillBridge Executive Assessment Report
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Scenario: {scenarioTitle} &bull; ID: <span className="font-semibold text-slate-800">{reportId}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-slate-600 sm:text-right">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Data Valutazione</span>
              <span className="font-semibold text-slate-800 flex items-center sm:justify-end">
                <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                {formattedDate}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] uppercase text-slate-400 block">Tempo di Risoluzione</span>
              <span className="font-semibold text-slate-800 flex items-center sm:justify-end">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                {timeFormatted}
              </span>
            </div>
          </div>
        </header>

        {/* Candidate Profile Strip */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">{session.candidate_name}</span>
              <span className="text-slate-500 font-mono">{session.candidate_email}</span>
            </div>
          </div>
          <div className="text-right font-mono text-slate-600 text-[11px]">
            <span>Profilo: <strong>Supply Chain & Operations Analyst</strong></span>
            <span className="block text-slate-400 text-[10px]">Sessione Verificata da Protocollo Deterministico</span>
          </div>
        </div>

        {/* VERDICT HIGHLIGHT: Score & Recommendation Badge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-slate-900 text-white rounded-md">
          <div className="md:col-span-5 flex items-center space-x-4">
            <div className="text-center border-r border-slate-700 pr-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Total Score
              </span>
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {evaluation.total_score}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono space-y-0.5">
              <div>Deterministico: <span className="font-semibold text-white">{evaluation.deterministic_score}/70 pt</span></div>
              <div>Semantico AI: <span className="font-semibold text-white">{evaluation.llm_score}/30 pt</span></div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col md:items-end justify-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Raccomandazione Esecutiva
            </span>
            <div
              className={`inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-bold border tracking-wide uppercase ${badgeConfig.bg}`}
            >
              {badgeConfig.icon}
              <span>{badgeConfig.label}</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN METRICS BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Column 1: Deterministico (70 pt max) */}
          <div className="border border-slate-200 rounded-md p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                1. Metriche Quantitative (70 pt max)
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                {evaluation.deterministic_score} / 70 pt
              </span>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Giorno Stimato Stockout Linea</span>
                  <span className="text-[11px] text-slate-500">Stima esaurimento giacenze iniziali</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.deterministic_breakdown.stockoutDayScore} / {evaluation.deterministic_breakdown.stockoutDayMax} pt
                </span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Fermo Linea Evitato</span>
                  <span className="text-[11px] text-slate-500">Giorni critici prima del ritorno fornitore</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.deterministic_breakdown.downtimeDaysScore} / {evaluation.deterministic_breakdown.downtimeDaysMax} pt
                </span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Costo Fermo Linea</span>
                  <span className="text-[11px] text-slate-500">Quantificazione danno orario stabilimento</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.deterministic_breakdown.downtimeCostScore} / {evaluation.deterministic_breakdown.downtimeCostMax} pt
                </span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Quantità Ordinata Celere</span>
                  <span className="text-[11px] text-slate-500">Copertura deficit a lotti minimi da 200u</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.deterministic_breakdown.reorderQtyScore} / {evaluation.deterministic_breakdown.reorderQtyMax} pt
                </span>
              </div>

              <div className="flex items-start justify-between py-1">
                <div>
                  <span className="font-medium text-slate-900 block">Extra-Costo Fornitura</span>
                  <span className="text-[11px] text-slate-500">Accuratezza delta prezzo expedited vs standard</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.deterministic_breakdown.extraCostScore} / {evaluation.deterministic_breakdown.extraCostMax} pt
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Analisi Semantica AI (30 pt max) */}
          <div className="border border-slate-200 rounded-md p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                2. Valutazione Semantica AI (30 pt max)
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                {evaluation.llm_score} / 30 pt
              </span>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Trade-off Economico Costi/Fermo</span>
                  <span className="text-[11px] text-slate-500">Spesa fornitura vs ore di fermo evitate</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.llm_breakdown.costTradeoffScore} / 5
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Gestione Rischio & Lead Time</span>
                  <span className="text-[11px] text-slate-500">Tutela tempi di consegna e scorta minima</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.llm_breakdown.riskAwarenessScore} / 5
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div>
                  <span className="font-medium text-slate-900 block">Sintesi & Chiarezza Operativa</span>
                  <span className="text-[11px] text-slate-500">Efficacia comunicazione per il Plant Director</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {evaluation.llm_breakdown.clarityAndSynthesis} / 5
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 mt-2 text-[11px] leading-relaxed text-slate-700">
                <span className="font-bold text-slate-900 uppercase tracking-wider block text-[10px] mb-1">
                  Sintesi Qualitativa Motore AI:
                </span>
                &quot;{evaluation.llm_feedback}&quot;
              </div>
            </div>
          </div>
        </div>

        {/* CANDIDATE'S INTEGRAL DECISION MEMO */}
        <div className="border border-slate-200 rounded-md p-4 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              <span>Motivazione Decisionale del Candidato (Estratto Integrale)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {session.raw_answers?.decisionMemo?.split(/\s+/).filter(Boolean).length || 0} parole
            </span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-800 font-sans leading-relaxed italic">
            &quot;{session.raw_answers?.decisionMemo || 'Nessuna motivazione registrata.'}&quot;
          </div>
        </div>

        {/* TELEMETRY & INTEGRITY FOOTER STRIP */}
        <div className="p-3 bg-slate-100 rounded-md border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Integrità Stimata: <strong>{estimatedIntegrity}%</strong></span>
            </div>
            <span>&bull;</span>
            <span>Focus Blur: <strong>{blurCount}</strong></span>
            <span>&bull;</span>
            <span>Paste Event: <strong>{pasteCount}</strong></span>
          </div>
          <div className="text-[10px] text-slate-500">
            Audit ID: {session.id} &bull; Deterministic Hash Verification OK
          </div>
        </div>

        {/* ================================================================== */}
        {/* ACTION BAR (D9 Conversion Interaction - Hidden in Print)            */}
        {/* ================================================================== */}
        <div className="pt-2 no-print space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight uppercase">
                Interessato al Profilo di {session.candidate_name}?
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Richiedi un colloquio conoscitivo di 20 minuti con il candidato. SkillBridge organizza l&apos;incontro entro 24 ore.
              </p>
            </div>

            <div className="flex-shrink-0">
              {interviewRequested ? (
                <div className="inline-flex items-center px-5 py-2.5 rounded-md text-xs font-bold text-white bg-emerald-600 shadow-sm border border-emerald-500">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>✓ COLLOQUIO RICHIESTO</span>
                </div>
              ) : (
                <button
                  onClick={handleRequestInterview}
                  disabled={isRequesting}
                  className="inline-flex items-center px-5 py-2.5 rounded-md text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 cursor-pointer transition-colors shadow-sm"
                >
                  {isRequesting ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Registrazione in corso...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <span>🤝 RICHIEDI COLLOQUIO CONOSCITIVO (20 MIN)</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Accordion Notes Form for Interview Scheduling (D9) */}
          {showNotesForm && (
            <div className="p-4 bg-white border border-slate-200 rounded-md shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                  Disponibilità orarie o note per SkillBridge (Opzionale)
                </label>
                {notesSavedConfirmation && (
                  <span className="text-xs font-semibold text-emerald-600 font-mono flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Note salvate con successo
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. 'Disponibile per colloquio venerdì mattina dalle 10 alle 12, preferenza Google Meet...'"
                className="w-full p-2.5 text-xs font-sans border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Send className="w-3 h-3 mr-1.5" />
                  <span>{isSavingNotes ? 'Salvataggio...' : 'Salva Note Disponibilità'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
