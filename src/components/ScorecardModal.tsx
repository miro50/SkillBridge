'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Share2,
  Download,
  CalendarCheck,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { SubmissionScorecard } from '@/types/runner';

interface ScorecardModalProps {
  scorecard: SubmissionScorecard | null;
  onClose: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({ scorecard, onClose }) => {
  useEffect(() => {
    if (scorecard) {
      // Trigger festive celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [scorecard]);

  if (!scorecard) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-950 p-6 border-b border-indigo-900/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Proof-of-Skill Validata
            </span>
            <span className="text-xs font-mono text-zinc-400">{scorecard.submissionId}</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Certificato di Competenza Tecnica
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {scorecard.scenarioTitle} • Rilasciato per {scorecard.candidateName}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-zinc-200 text-sm">
          {/* Main Score Hero Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">
                Punteggio Globale
              </span>
              <div className="text-4xl font-black text-indigo-400 mt-1 font-mono">
                {scorecard.totalScore}
                <span className="text-lg text-zinc-500 font-normal">/100</span>
              </div>
              <span className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {scorecard.badgeLevel}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Unit Tests Superati</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {scorecard.passedCount} / {scorecard.totalTests}
              </div>
              <div className="text-xs text-zinc-400">
                Punteggio deterministico: <strong className="text-zinc-200">{scorecard.deterministicScore}</strong>/70
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Integrità & Tempo</span>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {scorecard.proctorIntegrity}%
              </div>
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Tempo impiegato: {formatDuration(scorecard.timeSpentSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Competency Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-100 text-sm">Analisi Dettagliata delle Competenze</h3>
            <div className="space-y-2.5">
              {scorecard.competencyBreakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-medium text-zinc-200">{item.skill}</span>
                    <span className="font-mono text-indigo-300 font-semibold">{item.level}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Semantic Evaluation */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Valutazione Semantica AI (Rubric & Clean Code)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              &quot;{scorecard.aiAssessmentSummary}&quot;
            </p>
          </div>

          {/* Partner Direct Invitation Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-800/50 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <CalendarCheck className="h-5 w-5" />
              <span>Invito Diretto al Colloquio Tecnico</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Grazie al punteggio conseguito, il tuo profilo è stato automaticamente inserito nella short-list di <strong>FinNova Pay</strong>. Hai diritto all&apos;intervista tecnica finale saltando la prima fase conoscitiva.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span>Certificato verificabile crittograficamente su SkillBridge Ledger</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Certificato salvato! ID di verifica: ${scorecard.submissionId}`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Scarica Badge</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-600/20"
            >
              <span>Continua</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
