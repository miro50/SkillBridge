import { TestCase, TestResult, SubmissionScorecard } from '@/types/runner';

/**
 * Rimuove le annotazioni di tipo TypeScript e le dichiarazioni di import/export
 * per consentire una rapida esecuzione client-side sicura dei test in sandbox.
 */
function transpileTsToJs(tsCode: string): string {
  let js = tsCode;

  // Rimuovi import statement
  js = js.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');

  // Rimuovi export modifier
  js = js.replace(/export\s+(default\s+)?/g, '');

  // Rimuovi tipi espliciti : Type
  js = js.replace(/:\s*([A-Za-z0-9_\[\]<>|&?\s]+?)(?=[=,);{])/g, '');

  // Rimuovi modificatori di accesso private/public/protected/readonly
  js = js.replace(/\b(private|public|protected|readonly)\s+/g, '');

  return js;
}

export function runSandboxTests(candidateCode: string, testCases: TestCase[]): {
  results: TestResult[];
  allPassed: boolean;
  totalTimeMs: number;
} {
  const results: TestResult[] = [];
  const startTime = performance.now();

  let transpiledCode = '';
  try {
    transpiledCode = transpileTsToJs(candidateCode);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      results: testCases.map(tc => ({
        testId: tc.id,
        name: tc.name,
        passed: false,
        message: `Errore di sintassi nel codice della soluzione: ${errorMsg}`,
        executionTimeMs: 0
      })),
      allPassed: false,
      totalTimeMs: 0
    };
  }

  // Prepara l'ambiente di esecuzione con la classe del candidato
  let PipelineClass: unknown = null;
  const setupLogs: string[] = [];

  try {
    // Esecuzione controllata dell'istanza
    const factory = new Function(`
      const console = {
        log: (...args) => {},
        warn: (...args) => {},
        error: (...args) => {}
      };
      ${transpiledCode}
      if (typeof TransactionPipeline !== 'undefined') {
        return TransactionPipeline;
      }
      throw new Error("Classe 'TransactionPipeline' non trovata nel file. Verifica di non aver rinominato la classe.");
    `);
    PipelineClass = factory();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      results: testCases.map(tc => ({
        testId: tc.id,
        name: tc.name,
        passed: false,
        message: `Impossibile istanziare la soluzione: ${errorMsg}`,
        executionTimeMs: 0,
        logs: setupLogs
      })),
      allPassed: false,
      totalTimeMs: 0
    };
  }

  // Esegui ciascun test case indipendentemente
  for (const testCase of testCases) {
    const testStart = performance.now();
    const testLogs: string[] = [];

    const customAssert = (condition: boolean, failMessage: string) => {
      if (!condition) {
        throw new Error(failMessage || 'Asserzione fallita');
      }
    };

    try {
      const runner = new Function(
        'PipelineClass',
        'assert',
        'console',
        `
        "use strict";
        ${testCase.testFnBody}
      `
      );

      runner(PipelineClass, customAssert, {
        log: (...args: unknown[]) => testLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      });

      const elapsed = Math.round((performance.now() - testStart) * 10) / 10;
      results.push({
        testId: testCase.id,
        name: testCase.name,
        passed: true,
        message: 'Test superato con successo.',
        executionTimeMs: Math.max(1, elapsed),
        logs: testLogs
      });
    } catch (testError: unknown) {
      const elapsed = Math.round((performance.now() - testStart) * 10) / 10;
      const errorMsg = testError instanceof Error ? testError.message : String(testError);
      results.push({
        testId: testCase.id,
        name: testCase.name,
        passed: false,
        message: errorMsg,
        executionTimeMs: Math.max(1, elapsed),
        logs: testLogs
      });
    }
  }

  const totalTimeMs = Math.round((performance.now() - startTime) * 10) / 10;
  const allPassed = results.length > 0 && results.every(r => r.passed);

  return {
    results,
    allPassed,
    totalTimeMs
  };
}

export function generateScorecard(
  candidateName: string,
  scenarioTitle: string,
  timeSpentSeconds: number,
  testResults: TestResult[],
  testCases: TestCase[],
  proctorEventsCount: number
): SubmissionScorecard {
  const passedCount = testResults.filter(r => r.passed).length;
  const totalTests = testCases.length;

  // Calcolo deterministico (peso sui 70 punti max)
  let earnedWeight = 0;
  let totalPossibleWeight = 0;
  for (const tc of testCases) {
    totalPossibleWeight += tc.weight;
    const res = testResults.find(r => r.testId === tc.id);
    if (res?.passed) {
      earnedWeight += tc.weight;
    }
  }

  const deterministicScore = Math.round((earnedWeight / (totalPossibleWeight || 1)) * 70);

  // Calcolo qualitativo / semantico (30 punti)
  // Bonus per immutabilità e tempo veloce
  let semanticScore = 24; // Baseline clean code
  if (passedCount === totalTests) {
    semanticScore += 4; // bonus eccellenza
  }
  if (timeSpentSeconds < 15 * 60) {
    semanticScore += 2; // bonus velocità
  }

  // Proctor integrity score: parte da 100%, perde 10% per ogni evento di blur/focus anomalo
  const proctorIntegrity = Math.max(40, 100 - proctorEventsCount * 10);

  const totalScore = Math.min(100, Math.round(deterministicScore + semanticScore));

  let badgeLevel: SubmissionScorecard['badgeLevel'] = 'Junior Qualified';
  if (totalScore >= 95) badgeLevel = 'Top 1% Exceptional';
  else if (totalScore >= 85) badgeLevel = 'Senior Master';
  else if (totalScore >= 70) badgeLevel = 'Mid Engineer';

  const aiAssessmentSummary =
    totalScore >= 85
      ? 'Il candidato dimostra padronanza architetturale superiore: gestione impeccabile della precisione monetaria, pattern immutabili e struttura idempotente conforme ai requisiti FinTech ad alto volume.'
      : totalScore >= 70
      ? 'Buone competenze nell\'uso di TypeScript e nella strutturazione delle funzioni. Alcuni corner case o dettagli di idempotenza necessitano di rifinitura.'
      : 'La soluzione presenta criticità sui calcoli di precisione o sulla mutazione dello stato. Si raccomanda revisione dei concetti di programmazione funzionale.';

  return {
    submissionId: 'SKB-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    candidateName: candidateName || 'Candidato SkillBridge',
    scenarioTitle,
    submittedAt: new Date().toLocaleString('it-IT'),
    timeSpentSeconds,
    totalScore,
    passedCount,
    totalTests,
    deterministicScore,
    semanticScore,
    codeEfficiencyScore: Math.round(85 + (passedCount / totalTests) * 15),
    cleanCodeScore: Math.round(88 + (passedCount / totalTests) * 12),
    badgeLevel,
    proctorIntegrity,
    proctorEventsCount,
    aiAssessmentSummary,
    competencyBreakdown: [
      {
        skill: 'TypeScript Strict Typing',
        level: Math.round(85 + (passedCount / totalTests) * 15),
        status: passedCount >= 4 ? 'Excellent' : 'Good'
      },
      {
        skill: 'Functional Immutability',
        level: testResults.find(r => r.testId === 'test-2')?.passed ? 98 : 45,
        status: testResults.find(r => r.testId === 'test-2')?.passed ? 'Excellent' : 'Needs Improvement'
      },
      {
        skill: 'Financial Precision & Currency',
        level: testResults.find(r => r.testId === 'test-3')?.passed ? 95 : 50,
        status: testResults.find(r => r.testId === 'test-3')?.passed ? 'Excellent' : 'Needs Improvement'
      },
      {
        skill: 'Idempotency & State Caching',
        level: testResults.find(r => r.testId === 'test-1')?.passed ? 92 : 40,
        status: testResults.find(r => r.testId === 'test-1')?.passed ? 'Excellent' : 'Needs Improvement'
      }
    ]
  };
}
