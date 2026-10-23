'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Terminal,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Play,
  RotateCw
} from 'lucide-react';
import { TestResult } from '@/types/runner';

interface TestRunnerPanelProps {
  results: TestResult[];
  isRunning: boolean;
  totalTimeMs: number;
  onRunTests: () => void;
}

export const TestRunnerPanel: React.FC<TestRunnerPanelProps> = ({
  results,
  isRunning,
  totalTimeMs,
  onRunTests
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'console'>('tests');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  const hasRun = results.length > 0;

  // Aggregate logs from all tests
  const allLogs = results.flatMap(r => (r.logs || []).map(log => `[${r.name}] ${log}`));

  return (
    <div
      className={`border-t border-zinc-800 bg-zinc-950 transition-all duration-200 flex flex-col ${
        isCollapsed ? 'h-10' : 'h-64'
      }`}
    >
      {/* Panel Header */}
      <div className="h-10 px-4 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between select-none">
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => {
              setActiveTab('tests');
              setIsCollapsed(false);
            }}
            className={`flex items-center space-x-1.5 py-1 px-2.5 rounded font-medium transition-colors ${
              activeTab === 'tests' && !isCollapsed
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Test Suite</span>
            {hasRun && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                  failedCount === 0
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                }`}
              >
                {passedCount}/{results.length} PASS
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('console');
              setIsCollapsed(false);
            }}
            className={`flex items-center space-x-1.5 py-1 px-2.5 rounded font-medium transition-colors ${
              activeTab === 'console' && !isCollapsed
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="h-3 w-3" />
            <span>Console Output</span>
            {allLogs.length > 0 && (
              <span className="text-[10px] px-1 bg-zinc-800 text-zinc-400 rounded-full">
                {allLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Info & Toggle */}
        <div className="flex items-center space-x-3 text-xs text-zinc-400">
          {hasRun && (
            <div className="flex items-center space-x-1 text-[11px] font-mono text-zinc-400">
              <Clock className="h-3 w-3" />
              <span>{totalTimeMs}ms</span>
            </div>
          )}

          <button
            onClick={onRunTests}
            disabled={isRunning}
            title="Esegui nuovamente i test"
            className="p-1 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Panel Content (Visible if not collapsed) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs custom-scrollbar">
          {activeTab === 'tests' && (
            <div className="space-y-2">
              {!hasRun && !isRunning && (
                <div className="h-full flex flex-col items-center justify-center py-8 text-zinc-500 space-y-2">
                  <Play className="h-6 w-6 stroke-1 text-zinc-600" />
                  <p className="text-xs">Nessun test eseguito finora.</p>
                  <p className="text-[11px] text-zinc-600">
                    Clicca su &quot;Esegui Test&quot; o premi <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">Ctrl+Enter</kbd> per validare la soluzione.
                  </p>
                </div>
              )}

              {isRunning && (
                <div className="flex items-center justify-center py-10 space-x-2 text-zinc-400">
                  <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Esecuzione in sandbox isolata in corso...</span>
                </div>
              )}

              {hasRun && !isRunning && (
                <div className="space-y-2">
                  {results.map(r => (
                    <div
                      key={r.testId}
                      className={`p-2.5 rounded-lg border transition-all ${
                        r.passed
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                      }`}
                    >
                      <div
                        onClick={() =>
                          setExpandedTestId(expandedTestId === r.testId ? null : r.testId)
                        }
                        className="flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-2.5">
                          {r.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                          )}
                          <span className="font-semibold text-xs text-zinc-200">{r.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {r.executionTimeMs}ms
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              r.passed
                                ? 'bg-emerald-900/50 text-emerald-300'
                                : 'bg-rose-900/50 text-rose-300'
                            }`}
                          >
                            {r.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      </div>

                      {/* Expanded detail on error */}
                      {(!r.passed || expandedTestId === r.testId) && (
                        <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono space-y-1">
                          <div className="text-zinc-300 flex items-start space-x-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>{r.message}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'console' && (
            <div className="h-full bg-black/60 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-y-auto space-y-1">
              {allLogs.length === 0 ? (
                <span className="text-zinc-600 italic">Nessun output registrato nei log.</span>
              ) : (
                allLogs.map((line, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-zinc-600 select-none mr-2">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
