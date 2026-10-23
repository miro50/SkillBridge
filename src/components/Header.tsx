'use client';

import React from 'react';
import {
  Clock,
  Play,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AssessmentScenario } from '@/types/runner';

interface HeaderProps {
  scenario: AssessmentScenario;
  remainingSeconds: number;
  isTimerRunning: boolean;
  proctorEventsCount: number;
  autosaveStatus: 'saved' | 'saving';
  isRunningTests: boolean;
  onRunTests: () => void;
  onSubmit: () => void;
  onResetCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenario,
  remainingSeconds,
  proctorEventsCount,
  autosaveStatus,
  isRunningTests,
  onRunTests,
  onSubmit,
  onResetCode
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds <= 300; // < 5 mins
  const isCriticalTime = remainingSeconds <= 60; // < 1 min

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between select-none">
      {/* Brand & Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zinc-100 text-base tracking-tight">SkillBridge</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Proof-of-Skill
              </span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-1">
              {scenario.targetRole} • <span className="text-zinc-300 font-medium">{scenario.companyName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Proctor & Timer & Autosave Status */}
      <div className="flex items-center space-x-4">
        {/* Anti-cheat Proctor Badge */}
        <div
          title={
            proctorEventsCount === 0
              ? 'Ambiente di prova proctorizzato attivo: nessun cambio finestra rilevato'
              : `Attenzione: rilevati ${proctorEventsCount} cambi di tab/finestra`
          }
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors ${
            proctorEventsCount === 0
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
              : 'bg-amber-950/40 border-amber-800/50 text-amber-400 animate-pulse'
          }`}
        >
          {proctorEventsCount === 0 ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          <span className="font-mono text-[11px]">
            {proctorEventsCount === 0 ? 'Proctor: 100% Integro' : `Avvisi Proctor: ${proctorEventsCount}`}
          </span>
        </div>

        {/* Autosave Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-400">
          <div
            className={`h-2 w-2 rounded-full ${
              autosaveStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
            }`}
          />
          <span className="text-[11px] text-zinc-400">
            {autosaveStatus === 'saving' ? 'Salvataggio...' : 'Autosalvato'}
          </span>
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-all ${
            isCriticalTime
              ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse shadow-rose-950/50 shadow-md'
              : isLowTime
              ? 'bg-amber-950/40 border-amber-600/70 text-amber-300'
              : 'bg-zinc-900 border-zinc-700/80 text-zinc-200'
          }`}
        >
          <Clock className={`h-4 w-4 ${isCriticalTime ? 'text-rose-400' : isLowTime ? 'text-amber-400' : 'text-zinc-400'}`} />
          <span>{formatTime(remainingSeconds)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onResetCode}
          title="Ripristina codice iniziale"
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-md transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={onRunTests}
          disabled={isRunningTests}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {isRunningTests ? (
            <div className="h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current" />
          )}
          <span>Esegui Test</span>
          <kbd className="hidden lg:inline text-[10px] bg-emerald-900/80 px-1 py-0.5 rounded text-emerald-200">
            Ctrl+↵
          </kbd>
        </button>

        <button
          onClick={onSubmit}
          className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/25 transition-all active:scale-95 hover:shadow-indigo-500/40"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Consegna Prova</span>
        </button>
      </div>
    </header>
  );
};
