import { describe, it, expect } from 'vitest';
import {
  generateScenarioFromToken,
  sanitizeScenarioForCandidate,
  SCENARIO_CATALOG,
  type SupplyChainScenarioConfig,
} from '../parametric';
import { evaluateDeterministic, type CandidateSupplyChainAnswers } from '../deterministic';

describe('Multi-Scenario Catalog & Parametric Generator', () => {
  it('should list all 3 standard industrial scenarios in SCENARIO_CATALOG', () => {
    expect(SCENARIO_CATALOG).toHaveLength(3);
    const ids = SCENARIO_CATALOG.map((s) => s.id);
    expect(ids).toContain('valvola-v104');
    expect(ids).toContain('packaging-p200');
    expect(ids).toContain('scheda-e501');

    for (const item of SCENARIO_CATALOG) {
      expect(item.title).toBeTruthy();
      expect(item.role).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.partNumber).toBeTruthy();
      expect(item.productionLine).toBeTruthy();
      expect(item.downtimeCostPerHour).toBeGreaterThan(0);
    }
  });

  it('should generate reproducible scenarios for packaging-p200 with appropriate domain parameters', () => {
    const token = 'token-packaging-tester-99';
    const s1 = generateScenarioFromToken(token, 'packaging-p200');
    const s2 = generateScenarioFromToken(token, 'packaging-p200');

    expect(s1).toEqual(s2);
    expect(s1.id).toBe('packaging-p200');
    expect(s1.expeditedSupplier.batchSize).toBe(250);
    expect(s1.downtimeCostPerHour).toBe(1500);
    expect([50, 60, 70]).toContain(s1.dailyConsumption);
    expect([7, 8, 9]).toContain(s1.expectedStockoutDay);
    expect(s1.expectedReorderQty % 250).toBe(0);

    // Perfect deterministic evaluation
    const answers: CandidateSupplyChainAnswers = {
      stockoutDay: s1.expectedStockoutDay,
      downtimeDays: s1.expectedDowntimeDays,
      downtimeCost: s1.expectedDowntimeCost,
      reorderQty: s1.expectedReorderQty,
      extraCost: s1.expectedExtraCost,
    };
    const evalResult = evaluateDeterministic(answers, s1);
    expect(evalResult.score).toBe(70);
  });

  it('should generate reproducible scenarios for scheda-e501 with automotive electronics domain parameters', () => {
    const token = 'token-electronics-buyer-42';
    const s1 = generateScenarioFromToken(token, 'scheda-e501');
    const s2 = generateScenarioFromToken(token, 'scheda-e501');

    expect(s1).toEqual(s2);
    expect(s1.id).toBe('scheda-e501');
    expect(s1.expeditedSupplier.batchSize).toBe(100);
    expect(s1.downtimeCostPerHour).toBe(1800);
    expect([20, 25, 30]).toContain(s1.dailyConsumption);
    expect([8, 9, 10]).toContain(s1.expectedStockoutDay);
    expect(s1.expectedReorderQty % 100).toBe(0);

    // Verify extra-cost logic for spot broker
    const expectedPremiumPerUnit = s1.expeditedSupplier.unitCost - s1.primarySupplier.unitCost;
    expect(s1.expectedExtraCost).toBe(expectedPremiumPerUnit * s1.expectedReorderQty);

    const answers: CandidateSupplyChainAnswers = {
      stockoutDay: s1.expectedStockoutDay,
      downtimeDays: s1.expectedDowntimeDays,
      downtimeCost: s1.expectedDowntimeCost,
      reorderQty: s1.expectedReorderQty,
      extraCost: s1.expectedExtraCost,
    };
    const evalResult = evaluateDeterministic(answers, s1);
    expect(evalResult.score).toBe(70);
  });

  it('should safely fallback to valvola-v104 when an unknown scenario ID is passed', () => {
    const fallbackScenario = generateScenarioFromToken('fallback-token', 'unknown-scenario-xyz');
    expect(fallbackScenario.id).toBe('valvola-v104');
    expect(fallbackScenario.expeditedSupplier.batchSize).toBe(200);
    expect(fallbackScenario.downtimeCostPerHour).toBe(1200);
  });
});

describe('Parametric Scenario Engine', () => {
  it('should generate identical scenarios deterministically for identical tokens', () => {
    const token = 'candidate-session-alpha-123';
    const scenario1 = generateScenarioFromToken(token);
    const scenario2 = generateScenarioFromToken(token);

    expect(scenario1).toEqual(scenario2);
    expect(scenario1.dailyConsumption).toBeGreaterThanOrEqual(35);
    expect(scenario1.dailyConsumption).toBeLessThanOrEqual(45);
    expect([8, 9, 10]).toContain(scenario1.expectedStockoutDay);
  });

  it('should produce positive 32-bit hashes for all token types', () => {
    const tokens = ['', 'a', 'token-with-special-chars!@#$%^&*()', '1234567890', 'uuid-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'];
    for (const t of tokens) {
      const scenario = generateScenarioFromToken(t);
      expect(scenario.dailyConsumption).toBeGreaterThanOrEqual(35);
      expect(scenario.initialStock).toBeGreaterThan(0);
      expect(scenario.expectedStockoutDay).toBeGreaterThanOrEqual(8);
      expect(scenario.expectedStockoutDay).toBeLessThanOrEqual(10);
    }
  });

  it('should strip confidential expected targets when sanitizing for candidate', () => {
    const scenario = generateScenarioFromToken('demo-token');
    const sanitized = sanitizeScenarioForCandidate(scenario);

    expect((sanitized as any).expectedStockoutDay).toBeUndefined();
    expect((sanitized as any).expectedDowntimeDays).toBeUndefined();
    expect((sanitized as any).expectedDowntimeHours).toBeUndefined();
    expect((sanitized as any).expectedDowntimeCost).toBeUndefined();
    expect((sanitized as any).expectedReorderQty).toBeUndefined();
    expect((sanitized as any).expectedExtraCost).toBeUndefined();

    expect(sanitized.id).toBe('valvola-v104');
    expect(sanitized.initialStock).toBe(scenario.initialStock);
    expect(sanitized.dailyConsumption).toBe(scenario.dailyConsumption);
  });
});

describe('Dynamic Supply Chain Grader — 45-unit consumption & 400-unit reorder seeds', () => {
  // Find a token that yields 45 units/day and 6 downtime days (stockout at day 8)
  // Deficit = 6 * 45 = 270 units. Batch size = 200 => Math.ceil(270/200)*200 = 400 units!
  function findSeedWith45ConsumptionAnd400Order(): { token: string; config: SupplyChainScenarioConfig } {
    for (let i = 0; i < 5000; i++) {
      const token = `seed-search-test-${i}`;
      const config = generateScenarioFromToken(token);
      if (
        config.dailyConsumption === 45 &&
        config.expectedStockoutDay === 8 &&
        config.expectedReorderQty === 400
      ) {
        return { token, config };
      }
    }
    throw new Error('Seed not found within range');
  }

  it('confirms 70/70 perfect score on 45-unit consumption deficit seeds with 400-unit orders', () => {
    const { token, config } = findSeedWith45ConsumptionAnd400Order();

    expect(config.dailyConsumption).toBe(45);
    expect(config.expectedStockoutDay).toBe(8);
    expect(config.expectedDowntimeDays).toBe(6); // 14 - 8
    expect(config.expectedDowntimeHours).toBe(48); // 6 * 8h
    expect(config.expectedDowntimeCost).toBe(57600); // 48 * 1200
    expect(config.expectedReorderQty).toBe(400); // Math.ceil(270/200)*200

    const perfectAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: config.expectedStockoutDay,
      downtimeDays: config.expectedDowntimeDays,
      downtimeCost: config.expectedDowntimeCost,
      reorderQty: config.expectedReorderQty,
      extraCost: config.expectedExtraCost,
    };

    const result = evaluateDeterministic(perfectAnswers, config);

    expect(result.score).toBe(70);
    expect(result.maxScore).toBe(70);
    expect(result.breakdown.stockoutDayScore).toBe(15);
    expect(result.breakdown.downtimeDaysScore).toBe(10);
    expect(result.breakdown.downtimeCostScore).toBe(10);
    expect(result.breakdown.reorderQtyScore).toBe(20);
    expect(result.breakdown.extraCostScore).toBe(15);
  });

  it('awards 0 pt on under-ordering when deficit remains and line suffers stockout', () => {
    const { config } = findSeedWith45ConsumptionAnd400Order();

    const underOrderedAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: config.expectedStockoutDay,
      downtimeDays: config.expectedDowntimeDays,
      downtimeCost: config.expectedDowntimeCost,
      reorderQty: 200, // Deficit is 270 units, ordering only 200 leaves 70 units missing!
      extraCost: config.expectedExtraCost,
    };

    const result = evaluateDeterministic(underOrderedAnswers, config);

    expect(result.breakdown.reorderQtyScore).toBe(0);
    expect(result.itemized.reorderQty.comment).toContain('Sotto-ordinazione grave');
    expect(result.score).toBe(50); // 70 - 20
  });

  it('penalizes unjustified overstocking with 10/20 pt', () => {
    const { config } = findSeedWith45ConsumptionAnd400Order();

    const overstockedAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: config.expectedStockoutDay,
      downtimeDays: config.expectedDowntimeDays,
      downtimeCost: config.expectedDowntimeCost,
      reorderQty: 600, // 600 > 400 needed
      extraCost: config.expectedExtraCost,
    };

    const result = evaluateDeterministic(overstockedAnswers, config);

    expect(result.breakdown.reorderQtyScore).toBe(10);
    expect(result.itemized.reorderQty.comment).toContain('Overstocking ingiustificato');
    expect(result.score).toBe(60); // 70 - 10
  });

  it('handles partial tolerances correctly for calculations', () => {
    const { config } = findSeedWith45ConsumptionAnd400Order();

    const partialAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: 8.5, // 0.5 day tolerance -> 10/15
      downtimeDays: 5.5, // 0.5 day tolerance -> 5/10
      downtimeCost: config.expectedDowntimeCost * 1.03, // within 5% -> 5/10
      reorderQty: config.expectedReorderQty, // 20/20
      extraCost: config.expectedExtraCost * 0.97, // within 5% -> 10/15
    };

    const result = evaluateDeterministic(partialAnswers, config);

    expect(result.breakdown.stockoutDayScore).toBe(10);
    expect(result.breakdown.downtimeDaysScore).toBe(5);
    expect(result.breakdown.downtimeCostScore).toBe(5);
    expect(result.breakdown.reorderQtyScore).toBe(20);
    expect(result.breakdown.extraCostScore).toBe(10);
    expect(result.score).toBe(50);
  });

  it('safely handles empty, null, and non-numeric candidate inputs without throwing exceptions', () => {
    const scenario = generateScenarioFromToken('demo-null-test');

    const emptyAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: null,
      downtimeDays: undefined,
      downtimeCost: '',
      reorderQty: 'not-a-number',
      extraCost: null,
    };

    const result = evaluateDeterministic(emptyAnswers, scenario);

    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(70);
    expect(result.breakdown.stockoutDayScore).toBe(0);
    expect(result.breakdown.downtimeDaysScore).toBe(0);
    expect(result.breakdown.downtimeCostScore).toBe(0);
    expect(result.breakdown.reorderQtyScore).toBe(0);
    expect(result.breakdown.extraCostScore).toBe(0);
  });

  it('correctly parses string inputs with commas as decimal points', () => {
    const { config } = findSeedWith45ConsumptionAnd400Order();

    const stringAnswers: CandidateSupplyChainAnswers = {
      stockoutDay: '8,0',
      downtimeDays: '6',
      downtimeCost: '57600',
      reorderQty: '400',
      extraCost: String(config.expectedExtraCost),
    };

    const result = evaluateDeterministic(stringAnswers, config);
    expect(result.score).toBe(70);
  });
});
