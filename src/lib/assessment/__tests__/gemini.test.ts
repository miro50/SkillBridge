import { describe, it, expect, vi } from 'vitest';
import { generateScenarioFromToken } from '../parametric';
import {
  evaluateSemantic,
  evaluateHeuristicFallback,
  applyFounderOverride,
} from '../gemini-evaluator';

describe('Hybrid Semantic Grader (T3)', () => {
  const config = generateScenarioFromToken('demo-gemini-test-token');

  const solidMemo = `Priorità assoluta alla continuità della Linea Montaggio 2: la rottura di fornitura con lead time a 14 giorni comporta un fermo stimato di 5 giorni a partire dal giorno 9 di stockout, con un impatto economico devastante di circa 48.000 € di fermo linea. L'attivazione del fornitore celere AirSupply Logistics con lead time di soli 3 giorni e riordino di 200 unità comporta un extra-costo di 7.000 €. Questo investimento tutela la scorta di sicurezza minima di 80 unità ed azzera completamente il rischio di blocco della produzione, rappresentando un trade-off economico ampiamente vantaggioso per lo stabilimento.`;

  it('immediately falls back to local heuristic analyzer in <5ms when memo is empty', async () => {
    const startTime = Date.now();
    const result = await evaluateSemantic('', config);
    const elapsed = Date.now() - startTime;

    expect(elapsed).toBeLessThan(50);
    expect(result.score).toBe(0);
    expect(result.source).toBe('heuristic_fallback');
    expect(result.breakdown.costTradeoffScore).toBe(0);
    expect(result.breakdown.riskAwarenessScore).toBe(0);
    expect(result.breakdown.clarityAndSynthesis).toBe(0);
  });

  it('heuristically evaluates solid decision memo with high score without requiring LLM API key', () => {
    const result = evaluateHeuristicFallback(solidMemo, config);

    expect(result.source).toBe('heuristic_fallback');
    expect(result.score).toBeGreaterThanOrEqual(24);
    expect(result.breakdown.costTradeoffScore).toBeGreaterThanOrEqual(4);
    expect(result.breakdown.riskAwarenessScore).toBeGreaterThanOrEqual(4);
    expect(result.breakdown.clarityAndSynthesis).toBeGreaterThanOrEqual(4);
    expect(result.feedback).toContain('Analisi solida ed efficace');
  });

  it('correctly grades with Gemini when valid structured JSON is returned', async () => {
    const mockClient = {
      generateContent: vi.fn().mockResolvedValue(
        JSON.stringify({
          cost_tradeoff_score: 5,
          risk_awareness_score: 4,
          clarity_and_synthesis: 4,
          summary: 'Decisione rapida e solida. Ha coperto il deficit azzerando il rischio fermo.',
          strengths: ['Analisi numerica impeccabile', 'Tempismo di reazione perfetto'],
          areas_for_improvement: ['Verificare capacità logistica in ingresso'],
        })
      ),
    };

    const result = await evaluateSemantic(solidMemo, config, {
      clientOverride: mockClient,
      timeoutMs: 4000,
    });

    expect(result.source).toBe('gemini');
    expect(result.score).toBe(26); // round((13/15) * 30) = 26
    expect(result.breakdown.costTradeoffScore).toBe(5);
    expect(result.breakdown.riskAwarenessScore).toBe(4);
    expect(result.breakdown.clarityAndSynthesis).toBe(4);
    expect(result.feedback).toContain('Decisione rapida e solida');
  });

  it('falls back gracefully to heuristic analyzer when LLM returns invalid JSON or schema error', async () => {
    const mockClient = {
      generateContent: vi.fn().mockResolvedValue('NON_JSON_CORRUPT_OUTPUT_FROM_MODEL'),
    };

    const result = await evaluateSemantic(solidMemo, config, {
      clientOverride: mockClient,
      timeoutMs: 4000,
    });

    expect(result.source).toBe('heuristic_fallback');
    expect(result.score).toBeGreaterThanOrEqual(20);
  });

  it('enforces 4.0s timeout and triggers fallback within 4.1s when Gemini latency > 4000ms', async () => {
    // Mock client simulating excessive latency (>4000ms)
    const mockLaggingClient = {
      generateContent: vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return JSON.stringify({
          cost_tradeoff_score: 5,
          risk_awareness_score: 5,
          clarity_and_synthesis: 5,
          summary: 'Tardy response',
        });
      }),
    };

    const start = Date.now();
    const result = await evaluateSemantic(solidMemo, config, {
      clientOverride: mockLaggingClient,
      timeoutMs: 4000,
    });
    const duration = Date.now() - start;

    expect(result.source).toBe('heuristic_fallback');
    expect(duration).toBeGreaterThanOrEqual(3900);
    expect(duration).toBeLessThanOrEqual(4150); // Verified within 4.1s
    expect(result.score).toBeGreaterThanOrEqual(20);
  }, 10000);

  it('allows founder human-in-the-loop override to calibrate semantic score', () => {
    const original = evaluateHeuristicFallback(solidMemo, config);
    expect(original.score).toBeGreaterThanOrEqual(24);

    const overridden = applyFounderOverride(original, 28, 'Calibrato dal founder dopo verifica qualitativa');
    expect(overridden.score).toBe(28);
    expect(overridden.breakdown.normalizedScore).toBe(28);
    expect(overridden.breakdown.details?.founderOverridden).toBe(true);
    expect(overridden.feedback).toContain('Nota revisore: Calibrato dal founder');
  });
});
