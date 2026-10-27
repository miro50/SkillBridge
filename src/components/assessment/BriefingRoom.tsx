'use client';

import React from 'react';
import {
  Factory,
  Clock,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AssessmentSession } from '@/lib/supabase/client';
import { PublicScenarioConfig } from '@/lib/assessment/parametric';

interface BriefingRoomProps {
  session: AssessmentSession;
  scenario: PublicScenarioConfig;
  onStart: () => void;
  isStarting: boolean;
}

export function BriefingRoom({
  session,
  scenario,
  onStart,
  isStarting,
}: BriefingRoomProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 md:p-8">
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-sm tracking-wider">
            SB
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              SkillBridge Assessment Cockpit
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Modulo: {scenario.role || 'Supply Chain & Operations Specialist'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 font-mono">
            SESSIONE: {session.token.slice(0, 14)}...
          </span>
        </div>
      </header>

      {/* Main Briefing Container */}
      <main className="max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-md shadow-sm p-6 md:p-8">
        {/* Incident Pre-Flight Banner */}
        <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <span className="font-semibold block uppercase tracking-wider text-xs text-amber-800 mb-1">
              Briefing Operativo Pre-Flight &bull; {scenario.title}
            </span>
            Questa simulazione riproduce un&apos;anomalia reale di stabilimento. Il timer da 25:00
            partirà <strong>esclusivamente</strong> dopo aver cliccato sul pulsante di conferma in basso.
          </div>
        </div>

        {/* Candidate & Scenario Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-500 block">Candidato Valutato</span>
            <p className="text-lg font-semibold text-slate-900">{session.candidate_name}</p>
            <p className="text-xs text-slate-600 font-mono">{session.candidate_email}</p>
          </div>
          <div className="space-y-1 md:text-right">
            <span className="text-xs font-mono uppercase text-slate-500 block">Scenario Industriale</span>
            <p className="text-lg font-semibold text-slate-900">{scenario.title}</p>
            <p className="text-xs text-slate-600 font-mono">
              Codice Componente: <span className="font-semibold">{scenario.partNumber}</span> | {scenario.productionLine}
            </p>
          </div>
        </div>

        {/* Operational Context & Mission */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Factory className="w-4 h-4 text-slate-700" />
            <span>Situazione di Stabilimento</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Il fornitore primario storico (<em>{scenario.primarySupplier.name}</em>) ha segnalato un&apos;improvvisa
            interruzione logistica. Il lead time ordinario di <strong>{scenario.primarySupplier.standardLeadTimeDays} giorni</strong> è
            slittato a <strong>{scenario.primarySupplier.disruptedLeadTimeDays} giorni</strong>.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            La <strong>{scenario.productionLine}</strong> opera a ritmo continuo su un turno da {scenario.shiftHoursPerDay} ore,
            con un tasso di consumo giornaliero di <strong>{scenario.dailyConsumption} unità</strong>.
            Ciascuna ora di fermo linea comporta un danno economico stimato in <strong>{scenario.downtimeCostPerHour.toLocaleString('it-IT')} €/ora</strong>.
          </p>
        </div>

        {/* Test Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tempo: 25 Minuti</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Tempo continuo sincronizzato server-side. Submit automatico al raggiungimento del limite massimo di tolleranza (26 min).
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Calcoli & Decisione</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Determina data di stockout, giorni di fermo linea, lotto fornitore celere e redigi la memo per il Plant Director.
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="flex items-center space-x-2 text-slate-900 font-medium text-sm mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Telemetria & Integrità</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Auto-save periodico ogni 15s. Registrazione passiva degli switch di finestra per attestazione di serietà del candidato.
            </p>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="mb-8 p-4 rounded-md bg-slate-100 border border-slate-200">
          <h3 className="text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
            Requisiti di Postazione
          </h3>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Schermo Desktop o Laptop (risoluzione minima consigliata: 1024px di larghezza).</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Calcolatrice o foglio di calcolo locale a supporto (facoltativo).</span>
            </li>
            <li className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span>Sessione univoca e monouso legata al tuo indirizzo email.</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-200">
          <button
            onClick={onStart}
            disabled={isStarting}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {isStarting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Inizializzazione Cockpit...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Accetta Incarico e Avvia Timer (25:00)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 py-4 font-mono">
        SkillBridge Industrial Assessment Protocol &copy; 2026. Powered by deterministic & AI grading engine.
      </footer>
    </div>
  );
}
