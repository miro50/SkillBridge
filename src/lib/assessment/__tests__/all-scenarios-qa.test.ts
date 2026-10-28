import { describe, it, expect } from 'vitest';
import {
  generateScenarioFromToken,
  sanitizeScenarioForCandidate,
  SCENARIO_CATALOG,
  type SupplyChainScenarioConfig,
} from '../parametric';
import { evaluateDeterministic, type CandidateSupplyChainAnswers } from '../deterministic';

describe('Engineering & QA: Comprehensive 20-Scenario Verification Suite', () => {
  it('should ensure all 20 industrial scenarios exist in the catalog with complete metadata', () => {
    expect(SCENARIO_CATALOG).toHaveLength(20);

    const validCategories = ['supply_chain', 'production_planning', 'procurement', 'lean_process'];

    for (const item of SCENARIO_CATALOG) {
      expect(item.id).toBeDefined();
      expect(item.id.trim().length).toBeGreaterThan(0);
      expect(item.title).toBeDefined();
      expect(item.role).toBeDefined();
      expect(validCategories).toContain(item.category);
      expect(item.partNumber).toBeDefined();
      expect(item.productionLine).toBeDefined();
      expect(item.summary).toBeDefined();
      expect(item.difficulty).toMatch(/^(Intermedio|Avanzato)$/);
      expect(item.downtimeCostPerHour).toBeGreaterThan(0);
    }
  });

  it('should verify that all 20 scenarios generate mathematically sound parameters across randomized candidate seeds', () => {
    const candidateSeeds = [
      'candidate-alpha-001',
      'candidate-beta-777',
      'candidate-gamma-999',
      'candidate-delta-4242',
      'candidate-omega-8888',
    ];

    for (const scenarioMeta of SCENARIO_CATALOG) {
      for (const seed of candidateSeeds) {
        const scenario = generateScenarioFromToken(seed, scenarioMeta.id);

        // Sanity checks on calculated ground truth
        expect(Number.isFinite(scenario.expectedStockoutDay)).toBe(true);
        expect(Number.isFinite(scenario.expectedDowntimeDays)).toBe(true);
        expect(Number.isFinite(scenario.expectedDowntimeCost)).toBe(true);
        expect(Number.isFinite(scenario.expectedReorderQty)).toBe(true);
        expect(Number.isFinite(scenario.expectedExtraCost)).toBe(true);

        expect(scenario.expectedStockoutDay).toBeGreaterThan(0);
        expect(scenario.expectedDowntimeDays).toBeGreaterThanOrEqual(0);
        expect(scenario.expectedDowntimeCost).toBeGreaterThanOrEqual(0);
        expect(scenario.expectedReorderQty).toBeGreaterThanOrEqual(0);
        expect(scenario.expectedExtraCost).toBeGreaterThanOrEqual(0);

        // Order batch size alignment: reorder qty must be a multiple of batch size
        expect(scenario.expectedReorderQty % scenario.expeditedSupplier.batchSize).toBe(0);

        // Test deterministic evaluation on perfect ground truth
        const perfectAnswers: CandidateSupplyChainAnswers = {
          stockoutDay: scenario.expectedStockoutDay,
          downtimeDays: scenario.expectedDowntimeDays,
          downtimeCost: scenario.expectedDowntimeCost,
          reorderQty: scenario.expectedReorderQty,
          extraCost: scenario.expectedExtraCost,
        };

        const result = evaluateDeterministic(perfectAnswers, scenario);
        expect(result.score).toBe(70);
        expect(result.maxScore).toBe(70);
        expect(result.breakdown.stockoutDayScore).toBe(15);
        expect(result.breakdown.downtimeDaysScore).toBe(10);
        expect(result.breakdown.downtimeCostScore).toBe(10);
        expect(result.breakdown.reorderQtyScore).toBe(20);
        expect(result.breakdown.extraCostScore).toBe(15);
      }
    }
  });

  it('should guarantee that sanitizeScenarioForCandidate strictly strips ground-truth answers for all 20 scenarios', () => {
    for (const scenarioMeta of SCENARIO_CATALOG) {
      const fullScenario = generateScenarioFromToken('token-security-audit-2026', scenarioMeta.id);
      const sanitized = sanitizeScenarioForCandidate(fullScenario);

      // Verify that candidate NEVER receives the ground truth answers in the payload
      expect((sanitized as any).expectedStockoutDay).toBeUndefined();
      expect((sanitized as any).expectedDowntimeDays).toBeUndefined();
      expect((sanitized as any).expectedDowntimeCost).toBeUndefined();
      expect((sanitized as any).expectedReorderQty).toBeUndefined();
      expect((sanitized as any).expectedExtraCost).toBeUndefined();

      // Verify essential business parameters remain available for the candidate
      expect(sanitized.id).toBe(fullScenario.id);
      expect(sanitized.title).toBe(fullScenario.title);
      expect(sanitized.initialStock).toBe(fullScenario.initialStock);
      expect(sanitized.dailyConsumption).toBe(fullScenario.dailyConsumption);
      expect(sanitized.downtimeCostPerHour).toBe(fullScenario.downtimeCostPerHour);
      expect(sanitized.shiftHoursPerDay).toBe(fullScenario.shiftHoursPerDay);
      expect(sanitized.primarySupplier).toEqual(fullScenario.primarySupplier);
      expect(sanitized.expeditedSupplier).toEqual(fullScenario.expeditedSupplier);
    }
  });

  it('should verify deterministic grading penalties for exact vs partial boundary deviations (5% tolerance curves)', () => {
    const scenario = generateScenarioFromToken('tolerance-seed-123', 'valvola-v104');

    // Scenario answers with exact calculations -> 70/70
    const perfectAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: scenario.expectedStockoutDay,
      downtimeDays: scenario.expectedDowntimeDays,
      downtimeCost: scenario.expectedDowntimeCost,
      reorderQty: scenario.expectedReorderQty,
      extraCost: scenario.expectedExtraCost,
    };
    expect(evaluateDeterministic(perfectAnswers, scenario).score).toBe(70);

    // Scenario answers with minor numerical deviation within 5% tolerance -> 60/70 (partial credit)
    const withinToleranceAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: scenario.expectedStockoutDay,
      downtimeDays: scenario.expectedDowntimeDays,
      downtimeCost: Math.round(scenario.expectedDowntimeCost * 1.04), // +4%
      reorderQty: scenario.expectedReorderQty,
      extraCost: Math.round(scenario.expectedExtraCost * 0.96), // -4%
    };
    const toleranceResult = evaluateDeterministic(withinToleranceAnswers, scenario);
    expect(toleranceResult.score).toBe(60);
    expect(toleranceResult.breakdown.downtimeCostScore).toBe(5); // partial
    expect(toleranceResult.breakdown.extraCostScore).toBe(10); // partial

    // Scenario answers with gross divergence (>50% error or missing values)
    const badAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: scenario.expectedStockoutDay + 10,
      downtimeDays: scenario.expectedDowntimeDays + 15,
      downtimeCost: scenario.expectedDowntimeCost * 3,
      reorderQty: scenario.expectedReorderQty * 4,
      extraCost: scenario.expectedExtraCost * 5,
    };
    const badResult = evaluateDeterministic(badAnswers, scenario);
    expect(badResult.score).toBeLessThanOrEqual(20);
  });
});
