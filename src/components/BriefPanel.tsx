'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckSquare,
  Award,
  Building2,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { AssessmentScenario } from '@/types/runner';

interface BriefPanelProps {
  scenario: AssessmentScenario;
  passedTestsCount: number;
  totalTestsCount: number;
}

export const BriefPanel: React.FC<BriefPanelProps> = ({
  scenario,
  passedTestsCount,
  totalTestsCount
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'criteria' | 'company'>('brief');

  const completionPct = totalTestsCount > 0 ? Math.round((passedTestsCount / totalTestsCount) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-r border-zinc-800/80 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-2 pt-2 text-xs">
        <button
          onClick={() => setActiveTab('brief')}
          className={`flex items-center space-x-1.5 px-3 py-2 font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'brief'
              ? 'bg-zinc-950 text-indigo-400 border-indigo-500'
              : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Specifiche Prova</span>
        </button>

        <button
          onClick={() => setActiveTab('criteria')}
          className={`flex items-center space-x-1.5 px-3 py-2 font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'criteria'
              ? 'bg-zinc-950 text-indigo-400 border-indigo-500'
              : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Criteri & Rubric</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
            {passedTestsCount}/{totalTestsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center space-x-1.5 px-3 py-2 font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'company'
              ? 'bg-zinc-950 text-indigo-400 border-indigo-500'
              : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Azienda Partner</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="bg-zinc-900/40 px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Target className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-zinc-400">Progresso Verifica:</span>
          <span className="font-semibold text-zinc-200">{completionPct}%</span>
        </div>
        <div className="w-32 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 text-sm text-zinc-300 space-y-5 custom-scrollbar">
        {activeTab === 'brief' && (
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                <span>{scenario.difficulty} Level</span> • <span>{scenario.durationMinutes} min</span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 leading-snug">
                {scenario.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {scenario.summary}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {scenario.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Formatted Markdown Brief */}
            <div className="space-y-3 pt-2 text-xs leading-relaxed text-zinc-300 border-t border-zinc-800/80">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
                  <Zap className="h-4 w-4" />
                  <span>Obiettivo Tecnico</span>
                </div>
                <p className="text-zinc-400">
                  Implementa la classe <code className="text-indigo-300 font-mono">TransactionPipeline</code> in <code className="text-indigo-300 font-mono">solution.ts</code> per superare tutti i controlli di integrità finanziaria e validazione idempotente.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                  1. Precisione Monetaria (Arrotondamento)
                </h4>
                <p className="text-zinc-400">
                  Usa precisione a 2 cifre decimali standard. Non permettere errori di accumulo da floating point (es. <code>100 * 0.025 + 0.30</code>). I test verificano l&apos;esatta corrispondenza su fee e IVA.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                  2. Immutabilità Funzionale
                </h4>
                <p className="text-zinc-400">
                  Gli array e gli oggetti di transazione passati in input sono congelati (<code>Object.freeze</code>) nei test. Qualsiasi mutazione diretta provocherà un fallimento immediato.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                  3. Idempotenza Basata su TTL
                </h4>
                <p className="text-zinc-400">
                  Due transazioni con lo stesso <code>idempotencyKey</code> ricevute entro la finestra TTL (60s) devono essere deduplicate. Quella successiva al TTL deve essere processata.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-zinc-100 text-sm">Criteri di Accettazione</h3>
              <p className="text-xs text-zinc-400">Tutti i requisiti sono validati in tempo reale durante l&apos;esecuzione dei test.</p>
            </div>

            <div className="space-y-2">
              {scenario.acceptanceCriteria.map((criterion, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs"
                >
                  <ChevronRight className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{criterion}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <h3 className="font-semibold text-zinc-100 text-sm mb-2">Rubric di Valutazione (100 Punti)</h3>
              <div className="space-y-2.5">
                {scenario.evaluationRubric.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">{item.category}</span>
                      <span className="font-mono text-indigo-400 font-semibold">{item.weightPercentage}%</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 text-sm">{scenario.companyName}</h4>
                  <span className="text-[11px] text-indigo-400">{scenario.companyTier}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                FinNova Pay è la scaleup di pagamenti digitali B2B in più rapida ascesa in Europa meridionale, con oltre 150M€ di transazioni elaborate mensilmente.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                <Award className="h-4 w-4" />
                <span>Garanzia SkillBridge &quot;Fast-Track Interview&quot;</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Raggiungendo un punteggio &ge; 85/100, <strong>salti completamente</strong> il classico screening conoscitivo HR e il colloquio telefonico. Riceverai un invito diretto all&apos;intervista tecnica finale con l&apos;Engineering Lead entro 48 ore lavorative.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800 flex items-center space-x-2 text-[11px] text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-zinc-500 flex-shrink-0" />
              <span>Nessun CV richiesto. Solo Proof-of-Skill oggettiva e certificata.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
