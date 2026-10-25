/**
 * SkillBridge Dynamic Supply Chain Deterministic Grader (T2)
 *
 * Evaluates candidate calculation inputs against parametric target values
 * derived from the session seed. Max score: 70 points.
 */

import { SupplyChainScenarioConfig } from './parametric';
import { DeterministicBreakdown } from '../supabase/client';

export interface CandidateSupplyChainAnswers {
  stockoutDay?: number | string | null;
  downtimeDays?: number | string | null;
  downtimeCost?: number | string | null;
  reorderQty?: number | string | null;
  extraCost?: number | string | null;
}

export interface DeterministicItemResult {
  candidate: number | null;
  expected: number;
  awarded: number;
  max: number;
  comment: string;
}

export interface DeterministicGradingResult {
  score: number; // 0 - 70
  maxScore: 70;
  breakdown: DeterministicBreakdown;
  itemized: {
    stockoutDay: DeterministicItemResult;
    downtimeDays: DeterministicItemResult;
    downtimeCost: DeterministicItemResult;
    reorderQty: DeterministicItemResult;
    extraCost: DeterministicItemResult;
  };
}

/**
 * Safely parses and coerces candidate numeric input.
 */
function parseNumeric(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : Number(String(val).replace(',', '.').trim());
  return Number.isFinite(num) ? num : null;
}

/**
 * Grades candidate answers against the parametric scenario targets.
 * Strict, pure function with 0 side-effects.
 */
export function evaluateDeterministic(
  answers: CandidateSupplyChainAnswers,
  config: SupplyChainScenarioConfig
): DeterministicGradingResult {
  const cStockout = parseNumeric(answers.stockoutDay);
  const cDowntimeDays = parseNumeric(answers.downtimeDays);
  const cDowntimeCost = parseNumeric(answers.downtimeCost);
  const cReorderQty = parseNumeric(answers.reorderQty);
  const cExtraCost = parseNumeric(answers.extraCost);

  // --------------------------------------------------------------------------
  // 1. Stockout Day: 15 pt max
  // Exact -> 15 pt; tolerance +/- 0.5 days -> 10 pt; else 0 pt
  // --------------------------------------------------------------------------
  let stockoutScore = 0;
  let stockoutComment = 'Calcolo giorno stockout errato o mancante.';
  if (cStockout !== null) {
    const diff = Math.abs(cStockout - config.expectedStockoutDay);
    if (diff === 0) {
      stockoutScore = 15;
      stockoutComment = `Esatto: Giorno ${config.expectedStockoutDay} (${config.initialStock} / ${config.dailyConsumption} gg).`;
    } else if (diff <= 0.5) {
      stockoutScore = 10;
      stockoutComment = `Quasi esatto (tolleranza ±0.5 gg): ${cStockout} vs atteso ${config.expectedStockoutDay}.`;
    } else {
      stockoutComment = `Errato: inserito ${cStockout}, atteso Giorno ${config.expectedStockoutDay}.`;
    }
  }

  // --------------------------------------------------------------------------
  // 2. Downtime Days: 10 pt max
  // Exact -> 10 pt; tolerance +/- 0.5 days -> 5 pt; else 0 pt
  // --------------------------------------------------------------------------
  let downtimeDaysScore = 0;
  let downtimeDaysComment = 'Calcolo giorni di fermo linea errato o mancante.';
  if (cDowntimeDays !== null) {
    const diff = Math.abs(cDowntimeDays - config.expectedDowntimeDays);
    if (diff === 0) {
      downtimeDaysScore = 10;
      downtimeDaysComment = `Esatto: ${config.expectedDowntimeDays} giorni di fermo evitati (14 - ${config.expectedStockoutDay}).`;
    } else if (diff <= 0.5) {
      downtimeDaysScore = 5;
      downtimeDaysComment = `Tolleranza parziale (±0.5 gg): ${cDowntimeDays} vs atteso ${config.expectedDowntimeDays} gg.`;
    } else {
      downtimeDaysComment = `Errato: inserito ${cDowntimeDays} gg, atteso ${config.expectedDowntimeDays} gg.`;
    }
  }

  // --------------------------------------------------------------------------
  // 3. Downtime Cost: 10 pt max
  // Exact -> 10 pt; tolerance +/- 5% -> 5 pt; else 0 pt
  // --------------------------------------------------------------------------
  let downtimeCostScore = 0;
  let downtimeCostComment = 'Calcolo costo fermo linea mancante o errato.';
  if (cDowntimeCost !== null && config.expectedDowntimeCost > 0) {
    const diff = Math.abs(cDowntimeCost - config.expectedDowntimeCost);
    const pctDiff = diff / config.expectedDowntimeCost;
    if (diff === 0) {
      downtimeCostScore = 10;
      downtimeCostComment = `Esatto: € ${config.expectedDowntimeCost.toLocaleString('it-IT')} (${config.expectedDowntimeHours}h x € ${config.downtimeCostPerHour}/h).`;
    } else if (pctDiff <= 0.05) {
      downtimeCostScore = 5;
      downtimeCostComment = `Accettabile (entro 5%): € ${cDowntimeCost.toLocaleString('it-IT')} vs atteso € ${config.expectedDowntimeCost.toLocaleString('it-IT')}.`;
    } else {
      downtimeCostComment = `Errato: inserito € ${cDowntimeCost.toLocaleString('it-IT')}, atteso € ${config.expectedDowntimeCost.toLocaleString('it-IT')}.`;
    }
  }

  // --------------------------------------------------------------------------
  // 4. Reorder Quantity (Expedited Supplier): 20 pt max
  // Exactly expectedReorderQty (covers deficit with lot size 200) -> 20 pt
  // Under-ordering (deficit remains unaddressed) -> 0 pt
  // Overstocking (> expectedReorderQty) -> 10 pt
  // --------------------------------------------------------------------------
  let reorderQtyScore = 0;
  let reorderQtyComment = 'Quantità di riordino mancante o errata.';
  if (cReorderQty !== null && cReorderQty > 0) {
    if (cReorderQty === config.expectedReorderQty) {
      reorderQtyScore = 20;
      reorderQtyComment = `Ottimale: ${config.expectedReorderQty} unità ordinate in lotti da ${config.expeditedSupplier.batchSize}. Deficit coperto al 100%.`;
    } else if (cReorderQty < config.expectedReorderQty) {
      reorderQtyScore = 0;
      reorderQtyComment = `Sotto-ordinazione grave: ${cReorderQty} unità non coprono il fabbisogno di ${config.expectedDowntimeDays * config.dailyConsumption} unità, lasciando la linea ferma.`;
    } else {
      // Overstocking
      reorderQtyScore = 10;
      reorderQtyComment = `Overstocking ingiustificato: ${cReorderQty} unità ordinate (superiori ai ${config.expectedReorderQty} minimi richiesti), immobilizzo capitale eccessivo.`;
    }
  }

  // --------------------------------------------------------------------------
  // 5. Extra Cost: 15 pt max
  // Exact -> 15 pt; tolerance +/- 5% -> 10 pt; else 0 pt
  // --------------------------------------------------------------------------
  let extraCostScore = 0;
  let extraCostComment = 'Calcolo extra-costo fornitura celere errato o mancante.';
  if (cExtraCost !== null) {
    const diff = Math.abs(cExtraCost - config.expectedExtraCost);
    const pctDiff = config.expectedExtraCost > 0 ? diff / config.expectedExtraCost : (diff === 0 ? 0 : 1);
    if (diff === 0) {
      extraCostScore = 15;
      extraCostComment = `Esatto: € ${config.expectedExtraCost.toLocaleString('it-IT')} (+€ ${config.expeditedSupplier.unitCost - config.primarySupplier.unitCost}/u x ${config.expectedReorderQty} unità).`;
    } else if (pctDiff <= 0.05) {
      extraCostScore = 10;
      extraCostComment = `Approssimazione accettabile (entro 5%): € ${cExtraCost.toLocaleString('it-IT')} vs atteso € ${config.expectedExtraCost.toLocaleString('it-IT')}.`;
    } else {
      extraCostComment = `Errato: inserito € ${cExtraCost.toLocaleString('it-IT')}, atteso € ${config.expectedExtraCost.toLocaleString('it-IT')}.`;
    }
  }

  const totalScore = stockoutScore + downtimeDaysScore + downtimeCostScore + reorderQtyScore + extraCostScore;

  const itemized = {
    stockoutDay: {
      candidate: cStockout,
      expected: config.expectedStockoutDay,
      awarded: stockoutScore,
      max: 15,
      comment: stockoutComment,
    },
    downtimeDays: {
      candidate: cDowntimeDays,
      expected: config.expectedDowntimeDays,
      awarded: downtimeDaysScore,
      max: 10,
      comment: downtimeDaysComment,
    },
    downtimeCost: {
      candidate: cDowntimeCost,
      expected: config.expectedDowntimeCost,
      awarded: downtimeCostScore,
      max: 10,
      comment: downtimeCostComment,
    },
    reorderQty: {
      candidate: cReorderQty,
      expected: config.expectedReorderQty,
      awarded: reorderQtyScore,
      max: 20,
      comment: reorderQtyComment,
    },
    extraCost: {
      candidate: cExtraCost,
      expected: config.expectedExtraCost,
      awarded: extraCostScore,
      max: 15,
      comment: extraCostComment,
    },
  };

  const breakdown: DeterministicBreakdown = {
    stockoutDayScore: stockoutScore,
    stockoutDayMax: 15,
    downtimeDaysScore: downtimeDaysScore,
    downtimeDaysMax: 10,
    downtimeCostScore: downtimeCostScore,
    downtimeCostMax: 10,
    reorderQtyScore: reorderQtyScore,
    reorderQtyMax: 20,
    extraCostScore: extraCostScore,
    extraCostMax: 15,
    details: itemized,
  };

  return {
    score: totalScore,
    maxScore: 70,
    breakdown,
    itemized,
  };
}
