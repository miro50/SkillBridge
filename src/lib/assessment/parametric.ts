/**
 * SkillBridge Multi-Scenario Parametric Engine (T2 & Option C)
 *
 * Deterministically generates parameters for multiple industrial simulation scenarios:
 * 1. valvola-v104: Supply Chain & Operations Specialist (Valvola V-104)
 * 2. packaging-p200: Production Planner & MRP Specialist (Packaging P-200)
 * 3. scheda-e501: Buyer Tecnico & Procurement Specialist (Microcontrollore E-501)
 *
 * Uses unsigned 32-bit token hashing (anti-cheat) to guarantee uniqueness per candidate.
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
  role: string;
  shortDescription?: string;
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

export interface ScenarioCatalogItem {
  id: string;
  title: string;
  role: string;
  category: 'supply_chain' | 'production_planning' | 'procurement' | 'lean_process';
  difficulty: 'Intermedio' | 'Avanzato';
  partNumber: string;
  productionLine: string;
  summary: string;
  primarySupplier: string;
  downtimeCostPerHour: number;
}

export const SCENARIO_CATALOG: ScenarioCatalogItem[] = [
  {
    id: 'valvola-v104',
    title: 'Rottura Supply Chain Valvola V-104 su Linea Montaggio 2',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Intermedio',
    partNumber: 'V-104-BR',
    productionLine: 'Linea Montaggio 2',
    summary:
      'Rottura fornitura O-Ring critici, calcolo ROP con lotto minimo aereo da 200 pezzi e costo fermo linea da 1.200 €/h.',
    primarySupplier: 'Valvomeccanica S.p.A.',
    downtimeCostPerHour: 1200,
  },
  {
    id: 'packaging-p200',
    title: 'Collo di Bottiglia & Cambio Formato su Linea Packaging P-200',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Avanzato',
    partNumber: 'PKG-P200',
    productionLine: 'Reparto Packaging & Blisteratrice 1',
    summary:
      'Guasto fornitore astucci farmaceutici, ricalcolo fabbisogno MRP, lotto rapido da 250 pezzi e trade-off fermo linea da 1.500 €/h.',
    primarySupplier: 'Cartotecnica Industriale S.p.A.',
    downtimeCostPerHour: 1500,
  },
  {
    id: 'scheda-e501',
    title: 'Crisi Approvvigionamento Microcontrollore Automotive E-501',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'MCU-E501',
    productionLine: 'Linea SMT & Montaggio Schede 3',
    summary:
      'Allocazione globale silicio, reperimento spot broker da 100 pezzi per evitare il blocco totale della linea SMT da 1.800 €/h.',
    primarySupplier: 'SiliconTech Electronics B.V.',
    downtimeCostPerHour: 1800,
  },
  {
    id: 'process-m300',
    title: 'Bilanciamento Linea & Collo di Bottiglia Motore Brushless M-300',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Avanzato',
    partNumber: 'ROT-M300',
    productionLine: 'Isola Robotizzata Lavorazione & Collaudo 4',
    summary:
      'Guasto rettificatrice fornitore alberi rotore M-300, 18 giorni di lead time, lotto rapido CNC da 150 pezzi e trade-off fermo isola robotizzata da 2.100 €/h.',
    primarySupplier: 'PrecisionMachining Meccanica S.r.l.',
    downtimeCostPerHour: 2100,
  },
];

/**
 * Scenario 1: Valvola V-104 (Supply Chain & Operations)
 */
function generateValveScenario(positiveHash: number): SupplyChainScenarioConfig {
  const consumptions = [35, 40, 45];
  const dailyConsumption = consumptions[positiveHash % consumptions.length];

  const multipliers = [8, 9, 10];
  const stockMultiplier = multipliers[Math.floor(positiveHash / 10) % multipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  const expeditedCosts = [80, 85, 90];
  const unitCostExpedited = expeditedCosts[Math.floor(positiveHash / 100) % expeditedCosts.length];

  const standardUnitCost = 50;
  const standardLeadTime = 5;
  const disruptedLeadTime = 14;
  const expeditedLeadTime = 3;
  const batchSize = 200;
  const downtimeCostPerHour = 1200;
  const shiftHoursPerDay = 8;
  const safetyStock = 80;

  const expectedStockoutDay = initialStock / dailyConsumption;
  const expectedDowntimeDays = Math.max(0, disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * downtimeCostPerHour;

  const unitsNeeded = expectedDowntimeDays * dailyConsumption;
  const expectedReorderQty = Math.max(batchSize, Math.ceil(unitsNeeded / batchSize) * batchSize);
  const expectedExtraCost = (unitCostExpedited - standardUnitCost) * expectedReorderQty;

  return {
    id: 'valvola-v104',
    title: 'Rottura Supply Chain Valvola V-104 su Linea Montaggio 2',
    role: 'Supply Chain & Operations Specialist',
    shortDescription: 'Gestione rottura fornitura O-Ring di tenuta per assemblaggio valvole oleodinamiche.',
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
 * Scenario 2: Packaging P-200 (Production Planner / MRP)
 */
function generatePackagingScenario(positiveHash: number): SupplyChainScenarioConfig {
  const consumptions = [50, 60, 70];
  const dailyConsumption = consumptions[positiveHash % consumptions.length];

  const multipliers = [7, 8, 9];
  const stockMultiplier = multipliers[Math.floor(positiveHash / 10) % multipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  const expeditedCosts = [65, 70, 75];
  const unitCostExpedited = expeditedCosts[Math.floor(positiveHash / 100) % expeditedCosts.length];

  const standardUnitCost = 40;
  const standardLeadTime = 6;
  const disruptedLeadTime = 15;
  const expeditedLeadTime = 3;
  const batchSize = 250;
  const downtimeCostPerHour = 1500;
  const shiftHoursPerDay = 8;
  const safetyStock = 100;

  const expectedStockoutDay = initialStock / dailyConsumption;
  const expectedDowntimeDays = Math.max(0, disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * downtimeCostPerHour;

  const unitsNeeded = expectedDowntimeDays * dailyConsumption;
  const expectedReorderQty = Math.max(batchSize, Math.ceil(unitsNeeded / batchSize) * batchSize);
  const expectedExtraCost = (unitCostExpedited - standardUnitCost) * expectedReorderQty;

  return {
    id: 'packaging-p200',
    title: 'Collo di Bottiglia & Cambio Formato su Linea Packaging P-200',
    role: 'Production Planner & MRP Specialist',
    shortDescription: 'Riprogrammazione MRP astucci termosaldati per evitare penali cliente su linea blisteratrice.',
    partNumber: 'PKG-P200',
    productionLine: 'Reparto Packaging & Blisteratrice 1',
    initialStock,
    dailyConsumption,
    safetyStock,
    primarySupplier: {
      name: 'Cartotecnica Industriale S.p.A.',
      standardLeadTimeDays: standardLeadTime,
      disruptedLeadTimeDays: disruptedLeadTime,
      unitCost: standardUnitCost,
    },
    expeditedSupplier: {
      name: 'FastPack Express Italia',
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
 * Scenario 3: Scheda E-501 (Buyer Tecnico & Procurement Specialist)
 */
function generateElectronicsScenario(positiveHash: number): SupplyChainScenarioConfig {
  const consumptions = [20, 25, 30];
  const dailyConsumption = consumptions[positiveHash % consumptions.length];

  const multipliers = [8, 9, 10];
  const stockMultiplier = multipliers[Math.floor(positiveHash / 10) % multipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  const expeditedCosts = [70, 75, 80];
  const unitCostExpedited = expeditedCosts[Math.floor(positiveHash / 100) % expeditedCosts.length];

  const standardUnitCost = 30;
  const standardLeadTime = 10;
  const disruptedLeadTime = 22;
  const expeditedLeadTime = 4;
  const batchSize = 100;
  const downtimeCostPerHour = 1800;
  const shiftHoursPerDay = 8;
  const safetyStock = 50;

  const expectedStockoutDay = initialStock / dailyConsumption;
  const expectedDowntimeDays = Math.max(0, disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * downtimeCostPerHour;

  const unitsNeeded = expectedDowntimeDays * dailyConsumption;
  const expectedReorderQty = Math.max(batchSize, Math.ceil(unitsNeeded / batchSize) * batchSize);
  const expectedExtraCost = (unitCostExpedited - standardUnitCost) * expectedReorderQty;

  return {
    id: 'scheda-e501',
    title: 'Crisi Approvvigionamento Microcontrollore Automotive E-501',
    role: 'Buyer Tecnico & Procurement Specialist',
    shortDescription: 'Allocazione silicio globale: acquisto spot broker certificato per continuità linea SMT.',
    partNumber: 'MCU-E501',
    productionLine: 'Linea SMT & Montaggio Schede 3',
    initialStock,
    dailyConsumption,
    safetyStock,
    primarySupplier: {
      name: 'SiliconTech Electronics B.V.',
      standardLeadTimeDays: standardLeadTime,
      disruptedLeadTimeDays: disruptedLeadTime,
      unitCost: standardUnitCost,
    },
    expeditedSupplier: {
      name: 'GlobalSpot Component Brokers',
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
 * Scenario 4: Process M-300 (Junior Process & Lean Continuous Improvement)
 */
function generateProcessScenario(positiveHash: number): SupplyChainScenarioConfig {
  const consumptions = [60, 75, 90];
  const dailyConsumption = consumptions[positiveHash % consumptions.length];

  const multipliers = [7, 8, 9];
  const stockMultiplier = multipliers[Math.floor(positiveHash / 10) % multipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  const expeditedCosts = [120, 130, 140];
  const unitCostExpedited = expeditedCosts[Math.floor(positiveHash / 100) % expeditedCosts.length];

  const standardUnitCost = 75;
  const standardLeadTime = 8;
  const disruptedLeadTime = 18;
  const expeditedLeadTime = 3;
  const batchSize = 150;
  const downtimeCostPerHour = 2100;
  const shiftHoursPerDay = 8;
  const safetyStock = 120;

  const expectedStockoutDay = initialStock / dailyConsumption;
  const expectedDowntimeDays = Math.max(0, disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * downtimeCostPerHour;

  const unitsNeeded = expectedDowntimeDays * dailyConsumption;
  const expectedReorderQty = Math.max(batchSize, Math.ceil(unitsNeeded / batchSize) * batchSize);
  const expectedExtraCost = (unitCostExpedited - standardUnitCost) * expectedReorderQty;

  return {
    id: 'process-m300',
    title: 'Bilanciamento Linea & Collo di Bottiglia Motore Brushless M-300',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    shortDescription: 'Collo di bottiglia e ritardo fornitura alberi rotore M-300 su isola robotizzata di assemblaggio e collaudo.',
    partNumber: 'ROT-M300',
    productionLine: 'Isola Robotizzata Lavorazione & Collaudo 4',
    initialStock,
    dailyConsumption,
    safetyStock,
    primarySupplier: {
      name: 'PrecisionMachining Meccanica S.r.l.',
      standardLeadTimeDays: standardLeadTime,
      disruptedLeadTimeDays: disruptedLeadTime,
      unitCost: standardUnitCost,
    },
    expeditedSupplier: {
      name: 'RapidCNC Swiss Precision',
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
 * Generates deterministic scenario parameters based on a candidate's session token and scenario ID.
 * Defaults to 'valvola-v104' for backwards compatibility.
 */
export function generateScenarioFromToken(
  token: string,
  scenarioId: string = 'valvola-v104'
): SupplyChainScenarioConfig {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = hash >>> 0;

  if (scenarioId === 'packaging-p200') {
    return generatePackagingScenario(positiveHash);
  }

  if (scenarioId === 'scheda-e501') {
    return generateElectronicsScenario(positiveHash);
  }

  if (scenarioId === 'process-m300') {
    return generateProcessScenario(positiveHash);
  }

  // Default: valvola-v104
  return generateValveScenario(positiveHash);
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
