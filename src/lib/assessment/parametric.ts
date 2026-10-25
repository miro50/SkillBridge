/**
 * SkillBridge Parametric Scenario Engine (T2)
 *
 * Deterministically generates parameters for the "Valvola V-104" supply chain
 * incident scenario using unsigned 32-bit token hashing (anti-cheat).
 */

export interface PrimarySupplierConfig {
  name: string;
  standardLeadTimeDays: number;
  disruptedLeadTimeDays: number;
  unitCost: number;
}

export interface ExpeditedSupplierConfig {
  name: string;
  leadTimeDays: number;
  unitCost: number;
  batchSize: number;
}

export interface SupplyChainScenarioConfig {
  id: string;
  title: string;
  partNumber: string;
  productionLine: string;
  initialStock: number;
  dailyConsumption: number;
  safetyStock: number;
  primarySupplier: PrimarySupplierConfig;
  expeditedSupplier: ExpeditedSupplierConfig;
  downtimeCostPerHour: number;
  shiftHoursPerDay: number;
  // Calculated target values for grading
  expectedStockoutDay: number;
  expectedDowntimeDays: number;
  expectedDowntimeHours: number;
  expectedDowntimeCost: number;
  expectedReorderQty: number;
  expectedExtraCost: number;
}

/**
 * Public client-safe representation of the scenario (expected values stripped).
 */
export type PublicScenarioConfig = Omit<
  SupplyChainScenarioConfig,
  | 'expectedStockoutDay'
  | 'expectedDowntimeDays'
  | 'expectedDowntimeHours'
  | 'expectedDowntimeCost'
  | 'expectedReorderQty'
  | 'expectedExtraCost'
>;

/**
 * Generates deterministic scenario parameters based on a candidate's session token.
 * Uses 32-bit unsigned bitwise shifting (hash >>> 0) to guarantee positive indexes.
 */
export function generateScenarioFromToken(token: string): SupplyChainScenarioConfig {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i);
    hash |= 0;
  }
  // Convert safely to unsigned 32-bit integer
  const positiveHash = hash >>> 0;

  // Daily Consumption variants: 35, 40, or 45 units/day
  const consumptions = [35, 40, 45];
  const dailyConsumption = consumptions[positiveHash % consumptions.length];

  // Stock Multiplier: 8, 9, or 10 exact days (guarantees integer division)
  const multipliers = [8, 9, 10];
  const stockMultiplier = multipliers[Math.floor(positiveHash / 10) % multipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  // Expedited unit cost variants: 80, 85, or 90 €/unit
  const expeditedCosts = [80, 85, 90];
  const unitCostExpedited = expeditedCosts[Math.floor(positiveHash / 100) % expeditedCosts.length];

  // Standard operational parameters
  const standardUnitCost = 50;
  const standardLeadTime = 5;
  const disruptedLeadTime = 14;
  const expeditedLeadTime = 3;
  const batchSize = 200;
  const downtimeCostPerHour = 1200;
  const shiftHoursPerDay = 8;
  const safetyStock = 80;

  // Exact target calculations
  const expectedStockoutDay = initialStock / dailyConsumption; // Exact integer (8, 9, or 10)
  const expectedDowntimeDays = Math.max(0, disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * downtimeCostPerHour;

  // Deficit during disruption: units needed until primary supplier resumes at day 14
  const unitsNeeded = expectedDowntimeDays * dailyConsumption;

  // Dynamic batch calculation: ceiling to next multiple of batchSize (min 1 batch)
  const expectedReorderQty = Math.max(batchSize, Math.ceil(unitsNeeded / batchSize) * batchSize);
  const expectedExtraCost = (unitCostExpedited - standardUnitCost) * expectedReorderQty;

  return {
    id: 'valvola-v104',
    title: 'Rottura Supply Chain Valvola V-104 su Linea Montaggio 2',
    partNumber: 'V-104-BR',
    productionLine: 'Linea Montaggio 2',
    initialStock,
    dailyConsumption,
    safetyStock,
    primarySupplier: {
      name: 'Valvomeccanica S.p.A.',
      standardLeadTimeDays: standardLeadTime,
      disruptedLeadTimeDays: disruptedLeadTime,
      unitCost: standardUnitCost,
    },
    expeditedSupplier: {
      name: 'AirSupply Logistics International',
      leadTimeDays: expeditedLeadTime,
      unitCost: unitCostExpedited,
      batchSize,
    },
    downtimeCostPerHour,
    shiftHoursPerDay,
    expectedStockoutDay,
    expectedDowntimeDays,
    expectedDowntimeHours,
    expectedDowntimeCost,
    expectedReorderQty,
    expectedExtraCost,
  };
}

/**
 * Strips confidential expected answers from scenario config for public candidate delivery.
 */
export function sanitizeScenarioForCandidate(config: SupplyChainScenarioConfig): PublicScenarioConfig {
  const {
    expectedStockoutDay,
    expectedDowntimeDays,
    expectedDowntimeHours,
    expectedDowntimeCost,
    expectedReorderQty,
    expectedExtraCost,
    ...publicConfig
  } = config;

  return publicConfig;
}
