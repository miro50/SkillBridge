'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  Clock,
  Save,
  Send,
  Building2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Info,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import { AssessmentSession, CandidateRawAnswers, SessionTelemetry } from '@/lib/supabase/client';
import { PublicScenarioConfig } from '@/lib/assessment/parametric';

interface RunnerCockpitProps {
  session: AssessmentSession;
  scenario: PublicScenarioConfig;
  initialRemainingSeconds: number;
  onSubmit: (answers: CandidateRawAnswers, telemetry: SessionTelemetry) => Promise<void>;
  onSaveDraft: (answers: CandidateRawAnswers, telemetry: SessionTelemetry) => Promise<void>;
  isSubmitting: boolean;
}

export function RunnerCockpit({
  session,
  scenario,
  initialRemainingSeconds,
  onSubmit,
  onSaveDraft,
  isSubmitting,
}: RunnerCockpitProps) {
  // Inputs state
  const [stockoutDay, setStockoutDay] = useState<string>(
    session.raw_answers?.stockoutDay !== undefined ? String(session.raw_answers.stockoutDay) : ''
  );
  const [downtimeDays, setDowntimeDays] = useState<string>(
    session.raw_answers?.downtimeDays !== undefined ? String(session.raw_answers.downtimeDays) : ''
  );
  const [reorderQty, setReorderQty] = useState<string>(
    session.raw_answers?.expeditedOrderQty !== undefined ? String(session.raw_answers.expeditedOrderQty) : ''
  );
  const [decisionMemo, setDecisionMemo] = useState<string>(
    session.raw_answers?.decisionMemo || ''
  );

  // Telemetry state
  const [blurCount, setBlurCount] = useState<number>(session.telemetry?.blur_count || 0);
  const [pasteCount, setPasteCount] = useState<number>(session.telemetry?.paste_count || 0);

  // Timer state (seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialRemainingSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    session.telemetry?.time_spent_seconds || Math.max(0, 25 * 60 - initialRemainingSeconds)
  );

  // Auto-save sync status pill
  const [saveStatus, setSaveStatus] = useState<'synced' | 'saving' | 'dirty'>('synced');
  const [lastSavedTime, setLastSavedTime] = useState<Date>(new Date());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Desktop Gate detection (<1024px)
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  // References
  const answersRef = useRef<CandidateRawAnswers>({});
  const telemetryRef = useRef<SessionTelemetry>({
    blur_count: blurCount,
    paste_count: pasteCount,
    time_spent_seconds: elapsedSeconds,
  });

  // Keep ref synchronized with state for interval closures
  useEffect(() => {
    answersRef.current = {
      stockoutDay: stockoutDay ? Number(stockoutDay) : undefined,
      downtimeDays: downtimeDays ? Number(downtimeDays) : undefined,
      expeditedOrderQty: reorderQty ? Number(reorderQty) : undefined,
      decisionMemo,
    };
  }, [stockoutDay, downtimeDays, reorderQty, decisionMemo]);

  useEffect(() => {
    telemetryRef.current = {
      blur_count: blurCount,
      paste_count: pasteCount,
      time_spent_seconds: elapsedSeconds,
    };
  }, [blurCount, pasteCount, elapsedSeconds]);

  // Window size listener for Desktop Gate (D8)
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Passive Telemetry Listeners (Blur count & Time spent)
  useEffect(() => {
    const handleBlur = () => {
      setBlurCount((prev) => prev + 1);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // 1-Second Timer Tick
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  // Periodic Auto-Save every 15 seconds (LocalStorage + Server API)
  const performSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // LocalStorage recovery snapshot
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `skillbridge_draft_${session.token}`,
          JSON.stringify({
            answers: answersRef.current,
            telemetry: telemetryRef.current,
            timestamp: Date.now(),
          })
        );
      }
      await onSaveDraft(answersRef.current, telemetryRef.current);
      setLastSavedTime(new Date());
      setSaveStatus('synced');
    } catch (err) {
      console.warn('[AutoSave] Draft sync error:', err);
      setSaveStatus('dirty');
    }
  }, [session.token, onSaveDraft]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      performSave();
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, [performSave]);

  const handleAutoSubmit = useCallback(() => {
    if (isSubmitting) return;
    onSubmit(answersRef.current, telemetryRef.current);
  }, [isSubmitting, onSubmit]);

  const handleManualSubmit = () => {
    setIsSubmitModalOpen(false);
    onSubmit(answersRef.current, telemetryRef.current);
  };

  // Word count calculation
  const wordCount = useMemo(() => {
    if (!decisionMemo.trim()) return 0;
    return decisionMemo.trim().split(/\s+/).filter(Boolean).length;
  }, [decisionMemo]);

  // Live Calculation Preview (D7)
  const livePreview = useMemo(() => {
    const qty = Number(reorderQty) || 0;
    const sOutDay = Number(stockoutDay) || 0;
    const dDays = Number(downtimeDays) || 0;

    const unitExtraCost = scenario.expeditedSupplier.unitCost - scenario.primarySupplier.unitCost;
    const calculatedExtraCost = qty * unitExtraCost;
    const calculatedDowntimeCost = dDays * scenario.shiftHoursPerDay * scenario.downtimeCostPerHour;

    const daysCoveredByExpedited = scenario.dailyConsumption > 0
      ? Math.floor(qty / scenario.dailyConsumption)
      : 0;

    return {
      qty,
      daysCoveredByExpedited,
      calculatedExtraCost,
      calculatedDowntimeCost,
    };
  }, [reorderQty, stockoutDay, downtimeDays, scenario]);

  // Timer formatting
  const formatTimer = (totalSec: number) => {
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isTimerCritical = remainingSeconds < 2 * 60; // < 2 min -> red pulse
  const isTimerWarning = remainingSeconds < 5 * 60 && !isTimerCritical; // < 5 min -> amber

  // Desktop Gate Overlay (D8)
  if (isMobileScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center mb-6 text-amber-400">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-3">
          Postazione Desktop Richiesta
        </h2>
        <p className="max-w-md text-sm text-slate-300 leading-relaxed mb-6">
          Per garantire la corretta visualizzazione delle tabelle di stabilimento, l&apos;analisi delle
          griglie dati e la precisione nei calcoli di Supply Chain, questo assessment richiede un computer
          desktop o laptop (risoluzione $\ge 1024$px).
        </p>
        <div className="p-3 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 max-w-sm mb-6">
          Il tuo token di sessione è al sicuro: riapri il link dal tuo computer per continuare.
        </div>
        <p className="text-xs text-slate-500 font-mono">
          SkillBridge Candidate Platform &bull; Protocollo di valutazione certificato
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* TOP BAR: Slate-900 Header                                            */}
      {/* ==================================================================== */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="w-7 h-7 bg-white text-slate-900 rounded flex items-center justify-center font-bold text-xs tracking-wider">
            SB
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider block text-slate-200">
              {scenario.title}
            </span>
            <span className="text-[11px] font-mono text-slate-400 block">
              Linea: {scenario.productionLine} &bull; Componente: {scenario.partNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-200 block">
              {session.candidate_name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              {session.candidate_email}
            </span>
          </div>

          {/* Synchronized 25m Timer */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-mono text-sm font-semibold tracking-wider transition-all duration-300 ${
              isTimerCritical
                ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                : isTimerWarning
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-100 border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>⏱ {formatTimer(remainingSeconds)}</span>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* DUAL-PANE COCKPIT BODY (D3): 45% Left / 55% Right                      */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT PANE (45% width, independent scroll): Context & Tables        */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-[45%] h-full overflow-y-auto border-r border-slate-200 bg-white p-6 space-y-6">
          {/* Incident Alert Banner */}
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Notifica Anomalia: Rottura Fornitura Primaria
                </h3>
                <p className="text-xs text-red-900 mt-1 leading-relaxed">
                  Il fornitore storico <strong>{scenario.primarySupplier.name}</strong> ha subito un guasto alla linea di trafilatura.
                  La consegna ordinaria è bloccata: il lead time standard di {scenario.primarySupplier.standardLeadTimeDays} giorni
                  è esteso forzatamente a <strong>{scenario.primarySupplier.disruptedLeadTimeDays} giorni</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Plant & Production Line Data */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Parametri di Linea & Magazzino</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Giacenza a Magazzino</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.initialStock.toLocaleString('it-IT')} unità
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Consumo Medio Giornaliero</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.dailyConsumption} unità/giorno
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Scorta di Sicurezza Minima</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {scenario.safetyStock} unità
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 block mb-1">Costo Orario Fermo Linea</span>
                <span className="text-base font-bold font-mono text-red-700 tabular-nums">
                  € {scenario.downtimeCostPerHour.toLocaleString('it-IT')} / ora ({scenario.shiftHoursPerDay}h/turno)
                </span>
              </div>
            </div>
          </div>

          {/* Suppliers Comparison Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-2">
              <Info className="w-3.5 h-3.5" />
              <span>Confronto Fornitori Disponibili</span>
            </h4>
            <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Fornitore</th>
                    <th className="p-2.5">Lead Time</th>
                    <th className="p-2.5">Costo Unitario</th>
                    <th className="p-2.5">Lotto Minimo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white">
                    <td className="p-2.5 font-medium text-slate-900">
                      {scenario.primarySupplier.name}
                      <span className="block text-[10px] text-red-600 font-mono">
                        (Rottura in corso: {scenario.primarySupplier.disruptedLeadTimeDays} gg)
                      </span>
                    </td>
                    <td className="p-2.5 font-mono tabular-nums text-slate-700">
                      {scenario.primarySupplier.standardLeadTimeDays} gg (ordinario)
                    </td>
                    <td className="p-2.5 font-mono tabular-nums text-slate-700">
                      € {scenario.primarySupplier.unitCost} / u
                    </td>
                    <td className="p-2.5 font-mono text-slate-500">Nessuno</td>
                  </tr>
                  <tr className="bg-blue-50/60">
                    <td className="p-2.5 font-medium text-blue-950">
                      {scenario.expeditedSupplier.name}
                      <span className="block text-[10px] text-blue-700 font-mono">
                        (Canale Espresso Convenzionato)
                      </span>
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      {scenario.expeditedSupplier.leadTimeDays} giorni
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      € {scenario.expeditedSupplier.unitCost} / u
                    </td>
                    <td className="p-2.5 font-mono tabular-nums font-semibold text-blue-900">
                      {scenario.expeditedSupplier.batchSize} unità
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Instructions Log */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-800 block text-[11px]">
              Obiettivo Decisionale Richiesto
            </span>
            <p>
              1. Calcola l&apos;esatto giorno in cui lo stabilimento esaurirà le scorte senza nuovi arrivi.
            </p>
            <p>
              2. Quantifica i giorni di fermo linea che si verificheranno prima del ripristino del fornitore primario (giorno 14).
            </p>
            <p>
              3. Determina se e quanti lotti ordinare dal fornitore celere AirSupply per evitare il fermo linea.
            </p>
            <p>
              4. Giustifica la tua scelta economica e operativa nel memo per il Plant Director.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT PANE (55% width, independent scroll): Decision Cockpit       */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-[55%] h-full overflow-y-auto bg-slate-50 p-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Piano di Risoluzione & Input Decisionali
              </h2>
              <p className="text-xs text-slate-500">
                Compila i campi numerici con la tua stima operativa. Il sistema valuterà precisione e sostenibilità.
              </p>
            </div>

            {/* Numeric Inputs Grid */}
            <div className="space-y-4">
              {/* Field 1: Stockout Day */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  1. Giorno Stimato Esaurimento Scorte (Stockout Linea)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={stockoutDay}
                    onChange={(e) => {
                      setStockoutDay(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder="Es. 9"
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    giorno
                  </span>
                </div>
              </div>

              {/* Field 2: Downtime Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  2. Giorni di Fermo Linea Senza Fornitore Celere (Prima del gg 14)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={downtimeDays}
                    onChange={(e) => {
                      setDowntimeDays(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder="Es. 5"
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    giorni
                  </span>
                </div>
              </div>

              {/* Field 3: Reorder Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  3. Quantità da Ordinare a Fornitore Celere (Lotto minimo: {scenario.expeditedSupplier.batchSize} u)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={scenario.expeditedSupplier.batchSize}
                    value={reorderQty}
                    onChange={(e) => {
                      setReorderQty(e.target.value);
                      setSaveStatus('dirty');
                    }}
                    placeholder={`Es. ${scenario.expeditedSupplier.batchSize}`}
                    className="w-full h-10 px-3 font-mono text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                    unità
                  </span>
                </div>
              </div>
            </div>

            {/* Live Calculation Preview (D7) */}
            <div className="p-4 rounded-md bg-blue-50/80 border border-blue-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block mb-2 flex items-center space-x-1">
                <span>⚡ Live Calculation Preview</span>
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-blue-700 block">Extra-costo Fornitura:</span>
                  <span className="font-mono font-bold text-blue-950 tabular-nums">
                    + € {livePreview.calculatedExtraCost.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-blue-600 block">
                    (+€ {scenario.expeditedSupplier.unitCost - scenario.primarySupplier.unitCost}/u x {livePreview.qty} u)
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 block">Costo Fermo Linea Stabilitivo:</span>
                  <span className="font-mono font-bold text-red-700 tabular-nums">
                    € {livePreview.calculatedDowntimeCost.toLocaleString('it-IT')}
                  </span>
                  <span className="text-[10px] text-blue-600 block">
                    (se la linea resta scoperta per i gg indicati)
                  </span>
                </div>
              </div>
            </div>

            {/* Field 4: Decision Memo Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  4. Motivazione Decisionale per il Plant Director
                </label>
                <span
                  className={`text-xs font-mono font-semibold ${
                    wordCount >= 80 ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {wordCount} parole {wordCount < 80 ? '(Consigliate: 100-200)' : '✓'}
                </span>
              </div>
              <textarea
                rows={6}
                value={decisionMemo}
                onChange={(e) => {
                  setDecisionMemo(e.target.value);
                  setSaveStatus('dirty');
                }}
                onPaste={() => setPasteCount((prev) => prev + 1)}
                placeholder="Spiega sinteticamente il trade-off economico tra extra-costo di fornitura celere e costo di fermo linea. Specifica come intendi gestire i lead time fornitore e la tutela della scorta di sicurezza minima..."
                className="w-full p-3 font-sans text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 leading-relaxed"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ==================================================================== */}
      {/* STICKY BOTTOM ACTION BAR                                             */}
      {/* ==================================================================== */}
      <footer className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
        {/* Ambient Auto-Save Status Pill */}
        <div className="flex items-center space-x-2 text-xs">
          {saveStatus === 'saving' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-2" />
              Sincronizzazione bozza in corso...
            </span>
          ) : saveStatus === 'dirty' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
              Modifiche non salvate (auto-save attivo)
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Bozza sincronizzata ({lastSavedTime.toLocaleTimeString('it-IT')})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={performSave}
            disabled={isSubmitting || saveStatus === 'saving'}
            className="inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 focus:outline-none cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Salva Bozza</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            disabled={isSubmitting}
            className="inline-flex items-center px-5 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Invio e Correzione in Corso...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>INVIA VALUTAZIONE DEFINITIVA</span>
              </span>
            )}
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Confermi l&apos;Invio Definitivo?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Una volta inviata la prova, la tua sessione verrà chiusa e il motore di grading calcolerà
              il punteggio deterministico e la valutazione semantica della memo per il Plant Director.
            </p>
            {wordCount < 80 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Attenzione: la motivazione contiene solo <strong>{wordCount} parole</strong> (soglia minima raccomandata: 80 parole).
                </span>
              </div>
            )}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Annulla e Continua a Lavorare
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800"
              >
                Conferma Invio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
