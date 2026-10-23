'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fintechScenario } from '@/data/mockScenario';
import { AssessmentScenario, FileItem, TestResult, SubmissionScorecard } from '@/types/runner';
import { runSandboxTests, generateScorecard } from '@/lib/evaluator';
import { Header } from './Header';
import { BriefPanel } from './BriefPanel';
import { EditorPanel } from './EditorPanel';
import { TestRunnerPanel } from './TestRunnerPanel';
import { ScorecardModal } from './ScorecardModal';

export const CandidateTestRunner: React.FC = () => {
  const [scenario] = useState<AssessmentScenario>(fintechScenario);
  const [files, setFiles] = useState<FileItem[]>(fintechScenario.files);
  const [activeFileId, setActiveFileId] = useState<string>('solution');

  // Countdown Timer (20 mins default)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(scenario.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Autosave status
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');

  // Proctor Anti-Cheat Monitoring
  const [proctorEventsCount, setProctorEventsCount] = useState<number>(0);

  // Test Runner State
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(0);

  // Submission & Scorecard Modal
  const [scorecard, setScorecard] = useState<SubmissionScorecard | null>(null);

  // Load draft from localStorage on mount if available
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(`skillbridge_${scenario.id}_solution`);
      if (savedCode) {
        setFiles(prev =>
          prev.map(f => (f.id === 'solution' ? { ...f, content: savedCode } : f))
        );
      }
    } catch {
      // ignore storage errors
    }
  }, [scenario.id]);

  // Autosave with debounce
  const handleCodeChange = (fileId: string, newContent: string) => {
    setFiles(prev => prev.map(f => (f.id === fileId ? { ...f, content: newContent } : f)));
    if (fileId === 'solution') {
      setAutosaveStatus('saving');
    }
  };

  useEffect(() => {
    const solutionFile = files.find(f => f.id === 'solution');
    if (!solutionFile) return;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(`skillbridge_${scenario.id}_solution`, solutionFile.content);
        setAutosaveStatus('saved');
      } catch {
        // ignore storage errors
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [files, scenario.id]);

  // Live Timer Countdown
  useEffect(() => {
    if (!isTimerRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // Auto submit on time expiration
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSeconds]);

  // Window Focus / Blur Proctor Monitor (Anti-Cheat Feature)
  useEffect(() => {
    const handleBlur = () => {
      setProctorEventsCount(prev => prev + 1);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Run tests in client-side sandbox
  const handleRunTests = useCallback(() => {
    setIsRunningTests(true);

    const solutionFile = files.find(f => f.id === 'solution');
    const candidateCode = solutionFile ? solutionFile.content : '';

    // Piccola latenza per simulare l'esecuzione sandbox ed aggiornare la UI
    setTimeout(() => {
      const evaluation = runSandboxTests(candidateCode, scenario.testCases);
      setTestResults(evaluation.results);
      setTotalTimeMs(evaluation.totalTimeMs);
      setIsRunningTests(false);
    }, 300);
  }, [files, scenario.testCases]);

  // Reset to initial code template
  const handleResetCode = () => {
    if (confirm('Vuoi davvero ripristinare il codice iniziale della soluzione?')) {
      const original = fintechScenario.files.find(f => f.id === 'solution')?.content || '';
      setFiles(prev =>
        prev.map(f => (f.id === 'solution' ? { ...f, content: original } : f))
      );
      localStorage.removeItem(`skillbridge_${scenario.id}_solution`);
      setTestResults([]);
    }
  };

  // Submit assessment and generate Proof-of-Skill scorecard
  const handleSubmit = () => {
    const passedCount = testResults.filter(r => r.passed).length;
    if (testResults.length === 0) {
      if (!confirm('Non hai ancora eseguito i test. Sei sicuro di voler consegnare la prova?')) {
        return;
      }
    } else if (passedCount < scenario.testCases.length) {
      if (!confirm(`Attenzione: solo ${passedCount}/${scenario.testCases.length} test sono superati. Vuoi procedere comunque con la sottomissione?`)) {
        return;
      }
    }

    const timeSpent = scenario.durationMinutes * 60 - remainingSeconds;
    const generated = generateScorecard(
      'Candidato Leonardo',
      scenario.title,
      timeSpent,
      testResults,
      scenario.testCases,
      proctorEventsCount
    );

    setScorecard(generated);
  };

  const passedTestsCount = testResults.filter(r => r.passed).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        scenario={scenario}
        remainingSeconds={remainingSeconds}
        isTimerRunning={isTimerRunning}
        proctorEventsCount={proctorEventsCount}
        autosaveStatus={autosaveStatus}
        isRunningTests={isRunningTests}
        onRunTests={handleRunTests}
        onSubmit={handleSubmit}
        onResetCode={handleResetCode}
      />

      {/* Main Workspace: Split-screen (Left: Brief & Rubric, Right: Editor & Test Runner) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Brief, Acceptance Criteria, Rubric */}
        <div className="w-[420px] xl:w-[480px] h-full flex-shrink-0">
          <BriefPanel
            scenario={scenario}
            passedTestsCount={passedTestsCount}
            totalTestsCount={scenario.testCases.length}
          />
        </div>

        {/* Right Panel: Code Editor (top) + Test Runner Drawer (bottom) */}
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <EditorPanel
              files={files}
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
              onCodeChange={handleCodeChange}
              onRunTests={handleRunTests}
            />
          </div>

          {/* Test Runner & Console Panel */}
          <TestRunnerPanel
            results={testResults}
            isRunning={isRunningTests}
            totalTimeMs={totalTimeMs}
            onRunTests={handleRunTests}
          />
        </div>
      </div>

      {/* Scorecard Modal upon submission */}
      <ScorecardModal scorecard={scorecard} onClose={() => setScorecard(null)} />
    </div>
  );
};
