/**
 * SkillBridge Hybrid Semantic Grader with 4s Timeout & Fallback (T3)
 *
 * Evaluates candidate decision memos using Google Gemini (gemini-2.5-flash)
 * with strict 4.0s timeout and instant local regex/heuristic fallback.
 * Max score: 30 points.
 */

import { z } from 'zod';
import { SupplyChainScenarioConfig } from './parametric';
import { SemanticBreakdown } from '../supabase/client';

export interface SemanticEvaluationResult {
  score: number; // 0 - 30
  maxScore: 30;
  breakdown: SemanticBreakdown;
  feedback: string;
  source: 'gemini' | 'heuristic_fallback';
  durationMs: number;
}

export const SemanticGradingSchema = z.object({
  cost_tradeoff_score: z.number().min(1).max(5),
  risk_awareness_score: z.number().min(1).max(5),
  clarity_and_synthesis: z.number().min(1).max(5),
  summary: z.string(),
  strengths: z.array(z.string()).optional(),
  areas_for_improvement: z.array(z.string()).optional(),
});

export type SemanticGradingOutput = z.infer<typeof SemanticGradingSchema>;

export interface SemanticEvaluatorOptions {
  timeoutMs?: number;
  abortSignal?: AbortSignal;
  clientOverride?: any; // For testing/mocking Gemini SDK
}

/**
 * Local deterministic heuristic analyzer (<1ms execution).
 * Resilient fallback activated when Gemini is offline, timed out, rate limited,
 * or when GEMINI_API_KEY is not configured in process.env.
 */
export function evaluateHeuristicFallback(
  memo: string,
  config: SupplyChainScenarioConfig
): SemanticEvaluationResult {
  const startTime = Date.now();
  const trimmed = (memo || '').trim();

  // Empty / whitespace memo -> strict 0/30
  if (!trimmed) {
    return {
      score: 0,
      maxScore: 30,
      breakdown: {
        costTradeoffScore: 0,
        riskAwarenessScore: 0,
        clarityAndSynthesis: 0,
        normalizedScore: 0,
        details: { note: 'Motivazione non fornita dal candidato.' },
      },
      feedback: 'Nessuna motivazione decisionale fornita dal candidato.',
      source: 'heuristic_fallback',
      durationMs: Date.now() - startTime,
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = trimmed.toLowerCase();

  // 1. Clarity & Synthesis (1-5 pt): Ideal: 80 - 220 words
  let clarityScore = 1;
  if (wordCount >= 90 && wordCount <= 220) {
    clarityScore = 5;
  } else if (wordCount >= 60 && wordCount < 90) {
    clarityScore = 4;
  } else if (wordCount > 220 && wordCount <= 300) {
    clarityScore = 4;
  } else if (wordCount >= 30 && wordCount < 60) {
    clarityScore = 3;
  } else if (wordCount > 300) {
    clarityScore = 3;
  } else if (wordCount >= 15) {
    clarityScore = 2;
  } else {
    clarityScore = 1;
  }

  // 2. Cost Trade-Off Score (1-5 pt)
  // Searches for downtime cost, extra-cost numbers, and trade-off terminology
  let costScore = 2;
  const expectedDowntimeStr = String(config.expectedDowntimeCost);
  const expectedExtraStr = String(config.expectedExtraCost);

  const mentionsDowntimeNumber =
    lower.includes(expectedDowntimeStr) ||
    lower.includes(config.expectedDowntimeCost.toLocaleString('it-IT')) ||
    /48[\.\s]?000|57[\.\s]?600|fermo.*cost/i.test(lower);

  const mentionsExtraCostNumber =
    lower.includes(expectedExtraStr) ||
    lower.includes(config.expectedExtraCost.toLocaleString('it-IT')) ||
    /7[\.\s]?000|14[\.\s]?000|extra.*cost/i.test(lower);

  const mentionsTradeoffConcepts = /trade-off|conviene|confronto|investimento|spesa|risparmio|evitare/i.test(lower);

  if (mentionsDowntimeNumber && mentionsExtraCostNumber) {
    costScore = 5;
  } else if (mentionsDowntimeNumber || mentionsExtraCostNumber) {
    costScore = mentionsTradeoffConcepts ? 4 : 3;
  } else if (mentionsTradeoffConcepts) {
    costScore = 3;
  }

  // 3. Risk Awareness Score (1-5 pt)
  // Respect of lead time (3 vs 14 days), safety stock (80 units), line continuity
  let riskScore = 2;
  const mentionsLeadTime = /3\s*giorn|3\s*gg|lead\s*time|tempi|14\s*giorn|14\s*gg/i.test(lower);
  const mentionsSafetyStock = /scorta.*sicurezza|80\s*unita|buffer|scorta\s*minima/i.test(lower);
  const mentionsContinuity = /continuit|fermo\s*linea|blocco|interruzione|garantire/i.test(lower);

  if (mentionsLeadTime && (mentionsSafetyStock || mentionsContinuity)) {
    riskScore = mentionsSafetyStock ? 5 : 4;
  } else if (mentionsLeadTime || mentionsContinuity) {
    riskScore = 3;
  }

  // Normalization: round(((cost + risk + clarity) / 15) * 30)
  const rawSum = costScore + riskScore + clarityScore;
  const normalizedScore = Math.min(30, Math.max(0, Math.round((rawSum / 15) * 30)));

  let feedback = '';
  if (normalizedScore >= 24) {
    feedback = `Analisi solida ed efficace (${wordCount} parole). Ha valutato accuratamente il trade-off economico tra extra-costo fornitura ed ore di fermo, tutelando la continuità della linea.`;
  } else if (normalizedScore >= 18) {
    feedback = `Decisione pragmatica (${wordCount} parole). Chiara comprensione dell'impatto sul fermo produttivo; si raccomanda maggiore esplicitazione numerica dei lead time fornitore.`;
  } else {
    feedback = `Argomentazione sintetica (${wordCount} parole). Rilevate alcune lacune nell'analisi quantitativa del trade-off costi/fermo o nei vincoli di lead time.`;
  }

  return {
    score: normalizedScore,
    maxScore: 30,
    breakdown: {
      costTradeoffScore: costScore,
      riskAwarenessScore: riskScore,
      clarityAndSynthesis: clarityScore,
      normalizedScore,
      details: {
        wordCount,
        mentionsDowntimeNumber,
        mentionsExtraCostNumber,
        mentionsLeadTime,
        mentionsSafetyStock,
      },
    },
    feedback,
    source: 'heuristic_fallback',
    durationMs: Date.now() - startTime,
  };
}

/**
 * Builds the structured system evaluation prompt for Gemini.
 */
function buildGeminiPrompt(memo: string, config: SupplyChainScenarioConfig): string {
  return `Sei un Senior Plant Director e Direttore Operations industriale.
Valuta la seguente motivazione decisionale scritta da un candidato Supply Chain Specialist per l'anomalia "Valvola V-104 su Linea Montaggio 2".

PARAMETRI DI SCENARIO DETERMINISTICI (Verità operativa):
- Stock iniziale: ${config.initialStock} unità
- Consumo giornaliero: ${config.dailyConsumption} unità/giorno
- Fornitore primario in rottura: Lead time esteso a ${config.primarySupplier.disruptedLeadTimeDays} giorni (Costo standard: € ${config.primarySupplier.unitCost}/u)
- Fornitore celere (AirSupply): Lead time ${config.expeditedSupplier.leadTimeDays} giorni, Costo: € ${config.expeditedSupplier.unitCost}/u (Lotto: ${config.expeditedSupplier.batchSize} u)
- Giorno stockout stimato: Giorno ${config.expectedStockoutDay}
- Giorni di fermo linea se non si ordina celere: ${config.expectedDowntimeDays} giorni (${config.expectedDowntimeHours} ore)
- Costo totale del fermo linea evitato: € ${config.expectedDowntimeCost.toLocaleString('it-IT')}
- Fabbisogno effettivo: ${config.expectedDowntimeDays * config.dailyConsumption} unità -> Riordino raccomandato: ${config.expectedReorderQty} unità
- Extra-costo complessivo fornitura celere: € ${config.expectedExtraCost.toLocaleString('it-IT')}

TESTO DELLA MOTIVAZIONE DEL CANDIDATO:
"""
${memo}
"""

CRITERI DI VALUTAZIONE (Assegna punteggio intero da 1 a 5 per ogni criterio):
1. cost_tradeoff_score (1-5): Analisi del trade-off economico tra extra-costo (€ ${config.expectedExtraCost}) ed ore di fermo evitate (€ ${config.expectedDowntimeCost}).
2. risk_awareness_score (1-5): Consapevolezza dei vincoli operativi (lead time 3 gg vs 14 gg, scorta di sicurezza minima ${config.safetyStock} u).
3. clarity_and_synthesis (1-5): Chiarezza espositiva, professionalità e capacità di sintesi per il Plant Director (lunghezza ideale 100-200 parole).

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido conforme a questa struttura:
{
  "cost_tradeoff_score": 1-5,
  "risk_awareness_score": 1-5,
  "clarity_and_synthesis": 1-5,
  "summary": "Breve sintesi in 2-3 frasi in italiano della decisione del candidato",
  "strengths": ["Punto di forza 1", "Punto di forza 2"],
  "areas_for_improvement": ["Area di miglioramento"]
}`;
}

/**
 * Executes semantic grading with Gemini Flash.
 * Guaranteed 4.0s timeout (AbortSignal) with automatic heuristic fallback.
 */
export async function evaluateSemantic(
  memo: string,
  config: SupplyChainScenarioConfig,
  options: SemanticEvaluatorOptions = {}
): Promise<SemanticEvaluationResult> {
  const startTime = Date.now();
  const trimmed = (memo || '').trim();

  // If candidate wrote nothing, skip LLM call instantly
  if (!trimmed) {
    return evaluateHeuristicFallback(memo, config);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const timeoutMs = options.timeoutMs ?? 4000;

  // If no API key and no mock override, fall back instantly without network latency
  if (!apiKey && !options.clientOverride) {
    return evaluateHeuristicFallback(memo, config);
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`GEMINI_TIMEOUT_EXCEEDED: Exceeded ${timeoutMs}ms limit`));
    }, timeoutMs);

    if (options.abortSignal) {
      options.abortSignal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('GEMINI_ABORTED: Request aborted by caller signal'));
      });
    }
  });

  try {
    const llmCall = async (): Promise<SemanticEvaluationResult> => {
      let rawJsonText = '';

      if (options.clientOverride) {
        // Mock client injected for unit test verification
        rawJsonText = await options.clientOverride.generateContent({
          model: 'gemini-2.5-flash',
          contents: buildGeminiPrompt(trimmed, config),
        });
      } else {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: apiKey! });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: buildGeminiPrompt(trimmed, config),
          config: {
            responseMimeType: 'application/json',
          },
        });
        rawJsonText = response.text || '';
      }

      // Parse and validate via Zod schema
      const jsonStart = rawJsonText.indexOf('{');
      const jsonEnd = rawJsonText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('LLM did not return a valid JSON object');
      }
      const cleanJson = rawJsonText.substring(jsonStart, jsonEnd + 1);
      const parsed = SemanticGradingSchema.parse(JSON.parse(cleanJson));

      const rawSum = parsed.cost_tradeoff_score + parsed.risk_awareness_score + parsed.clarity_and_synthesis;
      const normalizedScore = Math.min(30, Math.max(0, Math.round((rawSum / 15) * 30)));

      return {
        score: normalizedScore,
        maxScore: 30,
        breakdown: {
          costTradeoffScore: parsed.cost_tradeoff_score,
          riskAwarenessScore: parsed.risk_awareness_score,
          clarityAndSynthesis: parsed.clarity_and_synthesis,
          normalizedScore,
          details: {
            strengths: parsed.strengths || [],
            areasForImprovement: parsed.areas_for_improvement || [],
          },
        },
        feedback: parsed.summary,
        source: 'gemini',
        durationMs: Date.now() - startTime,
      };
    };

    // Race Gemini against strict 4.0s timeout
    const result = await Promise.race([llmCall(), timeoutPromise]);
    return result;
  } catch (err: any) {
    console.warn(`[SemanticGrader] Switching to heuristic fallback due to: ${err?.message || err}`);
    const fallback = evaluateHeuristicFallback(memo, config);
    fallback.durationMs = Date.now() - startTime;
    return fallback;
  }
}

/**
 * Allows founder to override/calibrate the semantic score before sharing with the Plant Director.
 */
export function applyFounderOverride(
  original: SemanticEvaluationResult,
  overrideScore: number,
  notes?: string
): SemanticEvaluationResult {
  const boundedScore = Math.min(30, Math.max(0, Math.round(overrideScore)));
  return {
    ...original,
    score: boundedScore,
    breakdown: {
      ...original.breakdown,
      normalizedScore: boundedScore,
      details: {
        ...original.breakdown.details,
        founderOverridden: true,
        previousScore: original.score,
        founderNotes: notes || null,
      },
    },
    feedback: notes ? `${original.feedback} (Nota revisore: ${notes})` : original.feedback,
  };
}
